import React from 'react';

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
      <form className="my-1" onSubmit={this.createCategory}>
        <input
          ref={(input) => (this._inputElement = input)}
          type="text"
          className="input is-rounded"
          placeholder="New Category"
        ></input>
        <br></br>
        <div className="has-text-centered my-1">
          <button type="submit" className="button">
            Add Category
          </button>
        </div>
      </form>
    );
  }
}
