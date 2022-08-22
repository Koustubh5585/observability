import { EuiButton, EuiFieldText, EuiPopover, EuiToolTip, EuiWrappingPopover } from '@elastic/eui';
import React from 'react';

interface AnnotationProps {
  annotationText: string;
  showInputBox: boolean;
  isEditMode: boolean;
  onTextChange: (e: React.FormEvent<HTMLInputElement>) => {};
  onAddAnnotation: Function;
  onCancelAnnotation: Function;
}

export const Annotations: React.FC<AnnotationProps> = (props) => {
  // Create annotations
  const handleAddAnnotation = () => {
    props.onAddAnnotation();
  };

  // Update annotations
  const handleEditAnnotation = () => {
    props.onAddAnnotation();
  };

  // Delete annotations
  const handleDeleteAnnotation = () => {
    //TODO: Add delete operations
  };

  const handleCancelAnnotation = () => {
    props.onCancelAnnotation();
  };

  const formAnnotation = (
    <div className="annotationContainer">
      <EuiFieldText
        value={props.annotationText || ''}
        name="annotationText"
        placeholder="Add annotations"
        onChange={props.onTextChange}
        className="euiFieldText"
      />
      {props.isEditMode ? (
        <EuiButton
          fill
          type="submit"
          color="primary"
          onClick={handleEditAnnotation}
          className="buttonLeftMargin"
        >
          Edit
        </EuiButton>
      ) : (
        <EuiButton
          fill
          type="submit"
          color="primary"
          onClick={handleAddAnnotation}
          className="buttonLeftMargin"
        >
          Add
        </EuiButton>
      )}

      <EuiButton
        fill
        type="submit"
        color="text"
        onClick={handleCancelAnnotation}
        className="buttonLeftMargin"
      >
        Cancel
      </EuiButton>
    </div>
  );

  // return (
  //   <div>
  //     <EuiPopover
  //       button={document.querySelector('#explorerPlotComponent')!}
  //       anchorPosition="upCenter"
  //       isOpen={props.showInputBox}
  //       closePopover={handleCancelAnnotation}
  //     >
  //       {formAnnotation}
  //     </EuiPopover>
  //   </div>
  // );

  return props.showInputBox ? (
    <div className="annotationContainer">
      <EuiFieldText
        value={props.annotationText || ''}
        name="annotationText"
        placeholder="Add annotations"
        onChange={props.onTextChange}
        className="euiFieldText"
      />
      {props.isEditMode ? (
        <EuiButton
          fill
          type="submit"
          color="primary"
          onClick={handleEditAnnotation}
          style={{
            margin: '0px 0px 0px 5px',
          }}
        >
          Edit
        </EuiButton>
      ) : (
        <EuiButton
          fill
          type="submit"
          color="primary"
          onClick={handleAddAnnotation}
          style={{
            margin: '0px 0px 0px 5px',
          }}
        >
          Add
        </EuiButton>
      )}

      <EuiButton
        fill
        type="submit"
        color="text"
        onClick={handleCancelAnnotation}
        style={{
          margin: '0px 0px 0px 5px',
        }}
      >
        Cancel
      </EuiButton>
    </div>
  ) : null;
};
