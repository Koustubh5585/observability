import React, { ChangeEventHandler } from 'react';

interface AnnotationProps {
  showInputBox: boolean;
  onTextChange: (e: React.FormEvent<HTMLInputElement>) => {};
  onAddAnnotation: Function;
}

export const Annotations: React.FC<AnnotationProps> = (props) => {
  const handleAddAnnotation = () => {
    props.onAddAnnotation();
  };

  return props.showInputBox ? (
    <div className="annotationContainer">
      <input
        type="text"
        name="annotationText"
        placeholder="Add annotations"
        onChange={props.onTextChange}
        className="euiFieldText"
      />
      <button type="submit" onClick={handleAddAnnotation} className="addButton">
        Add
      </button>
    </div>
  ) : null;
};
