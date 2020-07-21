import React from 'react';
import ErrorMessage from './ErrorMessage';

export default class DeleteCategory {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
    this.deleteCategory = this.deleteCategory.bind(this);
    this.clearHasError = this.clearHasError.bind(this);
  }

  async deleteCategory() {
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
      this.setState({ hasError: true });
    }
  }

  clearHasError() {
    this.setState({
      hasError: false,
    });
  }

  render() {
    return (
      <>
        <ErrorMessage
          hasError={this.state.hasError}
          message={'Error deleting category'}
          closePopup={this.clearHasError}
        />
      </>
    );
  }
}
