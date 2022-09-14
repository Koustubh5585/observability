import {
  EuiAvatar,
  EuiButtonIcon,
  EuiComment,
  EuiCommentList,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiPopover,
  EuiText,
} from '@elastic/eui';
import React, { useState } from 'react';
import { CommentProps } from './collaboration';
import './collaboration.scss';

type Props = {
  mode: string;
  commentsData: Array<CommentProps>;
  deleteComment: Function;
};

export const CommentsList = ({ mode, commentsData, deleteComment }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const getCommentBody = (message: string) => {
    return (
      <EuiText size="xs">
        <p>{message}</p>
      </EuiText>
    );
  };

  const getCommentHeader = (user: string, event: string, time: string) => {
    return (
      <EuiText size="xs">
        <p><b>{user}</b> {event} {time}</p>
      </EuiText>
    );
  };

  const onDeleteClick = () => {
    deleteComment(selectedIndex);
    setSelectedIndex(-1);
  };

  let contextMenuPanel = [
    <EuiContextMenuItem
      size="s"
      data-test-subj="deleteCommentContextMenuItem"
      key="Delete"
      onClick={() => {
        onDeleteClick();
      }}
    >
      Delete
    </EuiContextMenuItem>,
  ];

  const contextMenu = (index: number) => {
    return (
      <EuiPopover
        panelPaddingSize="s"
        button={
          <EuiButtonIcon
            aria-label="actionMenuButton"
            iconType="boxesHorizontal"
            onClick={() => setSelectedIndex(index)}
          />
        }
        isOpen={selectedIndex === index}
        closePopover={() => setSelectedIndex(-1)}
        anchorPosition="downLeft"
      >
        <EuiContextMenuPanel items={contextMenuPanel} />
      </EuiPopover>
    );
  };

  const avatar = (avatarName: string) => <EuiAvatar size="l" name={avatarName} color="#E4CDFD" />;

  const getComments = () => {
    return commentsData.map((item, index) => {
      return (
        <EuiComment
          key={index}
          username={getCommentHeader(item.username, 'added a comment on', item.timestamp)}
          children={getCommentBody(item.comment)}
          actions={contextMenu(index)}
          timelineIcon={avatar(item.username)}
        />
      );
    });
  };

  return (
    <EuiCommentList className={mode === 'popover' ? 'comments-list' : ''}>
      {commentsData && getComments()}
    </EuiCommentList>
  );
};
