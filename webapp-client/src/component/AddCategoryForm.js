import React from 'react';
import ErrorMessage from './ErrorMessage';

export default class AddCategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  /** This function will be changed later to directly POST request to db instead of calling addCategory */
  createCategory = async (e) => {
    e.preventDefault();
    const category = this._inputElement.value;
    const request = {
      method: 'POST',
      body: JSON.stringify({
        title: category,
        userId: 'fake-user-id',
        items: [],
      }),
      headers: { 'Content-type': 'application/json' },
    };
    try {
      const response = await fetch(
        'http://localhost:8080/category/createCategory',
        request
      );
      if (response.status !== 200) {
        throw new Error(response.statusMessage);
      }
      /** to be deleted once CategoryList fetches from db */
      this.props.addCategory(category);
    } catch (error) {
      console.log(error);
      this.setState({ hasError: true });
    }
    this._inputElement.value = '';
  };

  clearHasError = () => {
    this.setState({
      hasError: false,
    });
  };

  render() {
    return (
      <React.Fragment>
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
        <ErrorMessage
          hasError={this.state.hasError}
          message={'Error creating category'}
          closePopup={this.clearHasError}
        />
      </React.Fragment>
    );
  }
}
