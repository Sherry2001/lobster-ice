import React from 'react';
import '../stylesheets/AddCategoryForm.css';

export default class AddCategoryForm extends React.Component {
  /** This function will be changed later to directly POST request to db instead of calling addCategory */
  createCategory = (e) => {
    e.preventDefault();
    const category = this._inputElement.value;
    this.props.addCategory(category);
    this._inputElement.value = '';
  };
  render() {
    return (
      <form className="add-category-form" onSubmit={this.createCategory}>
        <label htmlFor="categoryName">New Category: </label>
        <input
          ref={(input) => (this._inputElement = input)}
          type="text"
          name="categoryName"
        ></input>
        <br></br>
        <button type="submit" className="submit-button">
          Add Category
        </button>
      </form>
    );
  }
}
