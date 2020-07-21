import React from 'react';

export default class AddCategoryForm extends React.Component {
  // This function will be changed later to directly POST request to db instead of calling addCategory
  createCategory = (e) => {
    e.preventDefault();
    const category = e.target.elements['add-category'].value;
    this.props.addCategory(category);
    e.target.elements['add-category'].value = '';
  };

  render() {
    return (
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
    );
  }
}
