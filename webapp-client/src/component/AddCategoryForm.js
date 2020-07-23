import React from 'react';
import ErrorMessage from './ErrorMessage';

export default class AddCategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
    this.createCategory = this.createCategory.bind(this);
    this.clearHasError = this.clearHasError.bind(this);
  }
  // This function will be changed later to directly POST request to db instead of calling addCategory
  async createCategory(e) {
    e.preventDefault();
    const category = e.target.elements['add-category'].value;
    e.target.elements['add-category'].value = '';
    const request = {
      method: 'POST',
      body: JSON.stringify({
        title: category,
        userId: 'fake-user-id',
      }),
      headers: { 'Content-type': 'application/json' },
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/category/createCategory',
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
        <form className="my-1" onSubmit={this.createCategory}>
          <label className="label" htmlFor="add-category">
            Add Category:
          </label>
          <input
            type="text"
            name="add-category"
            className="input is-rounded"
            placeholder="New Category"
          ></input>
          <div className="has-text-centered my-1">
            <button type="submit" className="button">
              Add
            </button>
          </div>
        </form>

        <ErrorMessage
          hasError={this.state.hasError}
          message={'Error creating category'}
          closePopup={this.clearHasError}
        />
      </>
    );
  }
}
