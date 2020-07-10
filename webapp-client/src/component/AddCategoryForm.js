import React from 'react';

export default class AddCategoryForm extends React.Component {
  // This function will be changed later to directly POST request to db instead of calling addCategory
  createCategory = (e) => {
    e.preventDefault();
    const category = this._inputElement.value;
    this.props.addCategory(category);
    this._inputElement.value = '';
  };
  render() {
    return (
      <form className="my-1" onSubmit={this.createCategory}>
        <label className="label" for="add-category">
          Add Category:
        </label>
        <input
          ref={(input) => (this._inputElement = input)}
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
