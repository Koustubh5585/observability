import {
  EuiAvatar,
  EuiButton,
  EuiButtonIcon,
  EuiFlexItem,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiNotificationBadge,
  EuiPopover,
  EuiSpacer,
  EuiText,
  EuiTextArea,
  EuiTitle,
} from '@elastic/eui';
import { FlyoutContainers } from '../../common/flyout_containers';
import React, { useEffect, useState } from 'react';
import './collaboration.scss';
import { CommentsList } from './comments_list';
import moment from 'moment';
import { Collaboration } from '../../../components/strings';
import { useDispatch, useSelector } from 'react-redux';
import { addComments, deleteComment, savedComments } from './redux/slices/comments_slice';

type Props = {
  vizId: string;
  mode?: string | 'popover';
  closeFlyout?: () => void;
};

export interface CommentProps {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
}

export const CollaborationPopover = ({ vizId, mode, closeFlyout }: Props) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [isCollaborationPopoverOpen, setIsCollaborationPopoverOpen] = useState(false);
  const [sectionComments, setSectionComments] = useState<Array<CommentProps>>([]);

  const closeCollaborationPopover = () => setIsCollaborationPopoverOpen(false);
  const storedCollaborations = useSelector(savedComments);
  const allComments = storedCollaborations ? storedCollaborations : [];

  useEffect(() => {
    setSectionComments(allComments.filter((item) => item.id === vizId));
  }, []);

  const onSubmitSectionComments = () => {
    if (comment) {
      const newComment: CommentProps = {
        id: vizId,
        username: 'Opensearch',
        comment: comment,
        timestamp: moment.utc(new Date()).format('MMM D, YYYY'),
      };

      setSectionComments([...sectionComments, newComment]);
      dispatch(addComments([...allComments, newComment]));
      setComment('');
    }
  };

  const commentBox = (
    <>
      <EuiSpacer size="s" />
      <div className="display-flex">
        <EuiAvatar size="l" name="Opensearch" color="#E4CDFD" />
        <EuiTextArea
          id="popover-comments-input"
          value={comment}
          compressed
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          aria-label="popover-comments-input"
          className="textArea-leftMargin"
        />
      </div>
      <EuiButton
        className="submit-button"
        size="s"
        fill
        onClick={onSubmitSectionComments}
        style={{ backgroundColor: '#000' }}
      >
        Submit
      </EuiButton>
    </>
  );

  const flyoutHeader = (
    <EuiFlyoutHeader hasBorder>
      <EuiTitle size="s">
        <>{`Comments on this panel (${allComments.length})`}</>
      </EuiTitle>
    </EuiFlyoutHeader>
  );

  const flyoutBody = (
    <EuiFlyoutBody>
      <>
        {allComments.length > 0 ? (
          <CommentsList
            mode={mode!}
            commentsData={allComments}
            deleteComment={(index: number) => handleDeleteComment(index)}
          />
        ) : (
          <EuiText size="m">{Collaboration.NO_COMMENTS_AVAILABLE}</EuiText>
        )}
      </>
    </EuiFlyoutBody>
  );

  const flyoutFooter = (
    <>
      <div className="divider" />
      <EuiFlyoutFooter className="flyout-footer">{commentBox}</EuiFlyoutFooter>
    </>
  );

  const handleDeleteComment = (index: number) => {
    if (mode === 'flyout') {
      dispatch(
        deleteComment({
          id: index,
        })
      );
    } else {
      sectionComments.splice(index, 1);
      setSectionComments(sectionComments);
    }
  };

  return mode === 'flyout' ? (
    <FlyoutContainers
      size="s"
      closeFlyout={closeFlyout!}
      flyoutHeader={flyoutHeader}
      flyoutBody={flyoutBody}
      flyoutFooter={flyoutFooter}
      ariaLabel="collaborationFlyout"
    />
  ) : (
    <div className="collaboration-button">
      <EuiPopover
        initialFocus="#popover-comments-input"
        panelPaddingSize="m"
        button={
          <EuiButtonIcon
            iconSize="l"
            aria-label="actionCollaborationButton"
            iconType="editorComment"
            onClick={() => setIsCollaborationPopoverOpen(!isCollaborationPopoverOpen)}
          />
        }
        isOpen={isCollaborationPopoverOpen}
        closePopover={closeCollaborationPopover}
        anchorPosition="downCenter"
      >
        <div className="popover-width">
          <div className="display-flex">
            <EuiText className="header-width">
              {sectionComments.length > 0 ? `${sectionComments.length} comment` : 'Add a comment'}
            </EuiText>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                aria-label="popover-cancel"
                iconType="cross"
                color="text"
                display="empty"
                onClick={() => setIsCollaborationPopoverOpen(false)}
              />
            </EuiFlexItem>
          </div>
          <EuiSpacer size="m" />
          <CommentsList
            mode={mode!}
            commentsData={sectionComments}
            deleteComment={(index: number) => handleDeleteComment(index)}
          />
          {commentBox}
        </div>
      </EuiPopover>
      {sectionComments.length > 0 && (
        <EuiNotificationBadge className="count-badge">
          {sectionComments.length}
        </EuiNotificationBadge>
      )}
    </div>
  );
};
