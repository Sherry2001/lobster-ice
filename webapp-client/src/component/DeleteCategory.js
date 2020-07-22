import React from 'react';
import ErrorMessage from './ErrorMessage';

export default function DeleteCategory (props) {
  let hasError = false;

  const deleteCategory = async () => {
    console.log("in deleteCategory");
    const request = {
      method: 'POST',
      body: JSON.stringify({
        categoryId: this.props.categoryId,
      }),
      headers: { 'Content-type': 'application/json' },
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/category/deleteCategory',
        request
      );
      if (response.status !== 200) {
        throw new Error(response.statusMessage);
      }
    } catch (error) {
      hasError = true;
    }
  };

  const clearHasError = () => {
    hasError= false;
  };

  return (
    <>
      <ErrorMessage
        hasError={hasError}
        message={'Error deleting category'}
        closePopup={clearHasError}
      />
    </>
  );
}
