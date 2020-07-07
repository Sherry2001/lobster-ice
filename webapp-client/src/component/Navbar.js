import React, { Fragment } from 'react';
import '../stylesheets/Navbar.css';
import Category from './Category';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.default = 'All';
    this.state = {
      categories: [this.default],
      display: this.default,
    };
    this.addCategory = this.addCategory.bind(this);
    this.setContent = this.setContent.bind(this);
  }

  addCategory(category) {
    this.setState({
      categories: [
        ...this.state.categories,
        category,
      ]
    });
  }

  setContent(category) {
    this.setState({
      display: category,
    });
  }

  render() {
    return (
      <Fragment>
        <div className="nav-bar">
          <CategoryList
            categories={this.state.categories}
            setContentPane={this.setContent}
          />
          <AddCategoryForm addCategory={this.addCategory} />
        </div>
        <Category categoryName={this.state.display} />
      </Fragment>
    );
  }
}

class CategoryList extends React.Component {
  render() {
    return (
      <ul className="list-category">
        {this.props.categories.map((category, index) => {
          return (
            <li key={index} onClick={() => this.props.setContentPane(category)}>
              {category}
            </li>
          );
        })}
      </ul>
    );
  }
}

class AddCategoryForm extends React.Component {
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
