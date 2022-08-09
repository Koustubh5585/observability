import React, { useState } from 'react';

interface AnnotationProps {
  showInputBox: boolean;
  onTextChange: Function;
  onAddAnnotation: Function;
}

export const Annotations: React.FC<AnnotationProps> = (props) => {
  const handleAddAnnotation = () => {
    props.onAddAnnotation();
  };

  const handleEditAnnotation = () => {};

  const handleDeleteAnnotation = () => {};

  return props.showInputBox ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <input
        type="text"
        name="name"
        placeholder="Add annotations"
        onChange={(e) => props.onTextChange(e)}
        style={{ padding: '5px' }}
      />
      <button
        type="submit"
        onClick={handleAddAnnotation}
        style={{
          backgroundColor: 'blue',
          borderColor: 'gray',
          margin: '5px',
          padding: '5px',
          color: 'white',
          borderRadius: '5px',
        }}
      >
        Add
      </button>
    </div>
  ) : null;
};
