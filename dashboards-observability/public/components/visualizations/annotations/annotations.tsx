import { EuiButton, EuiFieldText, EuiPopover, EuiToolTip, EuiWrappingPopover } from '@elastic/eui';
import React from 'react';

interface AnnotationProps {
  dataSize: number;
  chartType: string;
  annotationText: string;
  annotationIndex: number;
  showInputBox: boolean;
  isEditMode: boolean;
  onTextChange: (e: React.FormEvent<HTMLInputElement>) => {};
  onAddAnnotation: Function;
  onEditAnnotation: Function;
  onDeleteAnnotation: Function;
  onCancelAnnotation: Function;
}

export const Annotations: React.FC<AnnotationProps> = (props) => {
  // Create annotations
  const handleAddAnnotation = () => {
    props.onAddAnnotation();
    updateAnnotations('ADD');
  };

  // Update annotations
  const handleEditAnnotation = () => {
    props.onEditAnnotation();
    updateAnnotations('EDIT');
  };

  // Delete annotations
  const handleDeleteAnnotation = () => {
    props.onDeleteAnnotation();
    updateAnnotations('DELETE');
  };

  const handleCancelAnnotation = () => {
    props.onCancelAnnotation();
  };

  const updateAnnotations = (mode: string) => {
    // read
    let annotationTexts = Array(props.dataSize).fill('');
    const storedAnnotations = sessionStorage.getItem('ChartsAnnotations');
    const annotations = storedAnnotations ? JSON.parse(storedAnnotations) : [];
    annotations.map((item) => {
      if (item.type === props.chartType) {
        annotationTexts = item.annotationTexts;
      }
    });

    // prepare
    let newAnnotationText = Array<string>();
    if (mode === 'ADD' || mode === 'EDIT') {
      newAnnotationText = [
        ...annotationTexts.slice(0, props.annotationIndex),
        props.annotationText,
        ...annotationTexts.slice(props.annotationIndex + 1),
      ];
    } else if (mode === 'DELETE') {
      newAnnotationText = [
        ...annotationTexts.slice(0, props.annotationIndex),
        '',
        ...annotationTexts.slice(props.annotationIndex + 1),
      ];
    }

    let storedData = [];
    const updatedData = {
      type: props.chartType,
      annotationTexts: newAnnotationText,
    };

    // update
    if (storedAnnotations) {
      storedData = JSON.parse(storedAnnotations);
      const found = storedData.some((item) => item.type === props.chartType);
      if (!found) {
        storedData.push(updatedData);
      } else {
        storedData = storedData.map((item) => (item.type === props.chartType ? updatedData : item));
      }
    } else {
      storedData.push(updatedData);
    }

    sessionStorage.setItem('ChartsAnnotations', JSON.stringify(storedData));
  };

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
        <div style={{ display: 'flex' }}>
          <EuiButton
            fill
            type="submit"
            color="primary"
            onClick={handleEditAnnotation}
            className="buttonLeftMargin"
          >
            Edit
          </EuiButton>
          <EuiButton
            fill
            type="submit"
            color="danger"
            onClick={handleDeleteAnnotation}
            className="buttonLeftMargin"
          >
            Delete
          </EuiButton>
        </div>
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
  ) : null;
};
