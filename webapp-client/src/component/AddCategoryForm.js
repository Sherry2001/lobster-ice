import React from 'react';
import ErrorMessage from './ErrorMessage';
import allowErrorMessage from '../errorify';

export default class AddCategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
    // post request to db to add the category
    this.createCategory = this.createCategory.bind(this);
    allowErrorMessage(this);
  }
  async createCategory(e) {
    e.preventDefault();
    const category = e.target.elements['add-category'].value;
    e.target.elements['add-category'].value = '';
    if (category.trim() === '') {
      return;
    }
    const request = {
      method: 'POST',
      body: JSON.stringify({
        title: category,
        userId: '5f050952f516f3570ee26724',
      }),
      headers: { 'Content-type': 'application/json' },
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/category/createCategory',
        request
      );
      if (response.status !== 200) {
        throw new Error();
      }
    } catch (error) {
      this.showErrorMessage();
    }
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

        {this.renderErrorMessage('Error creating categories')}
      </>
    );
  }
}
