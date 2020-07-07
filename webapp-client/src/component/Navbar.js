import React, { Fragment } from 'react';
// installation: npm i react-shadow-scroll or yarn add react-shadow-scroll
import ReactShadowScroll from 'react-shadow-scroll';
import '../stylesheets/Navbar.css';
import Category from './Category';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.default = <Category categoryName={'All'} />;
    this.state = {
      categories: {
        All: this.default,
      },
      display: this.default,
    };
    this.addCategory = this.addCategory.bind(this);
    this.setContent = this.setContent.bind(this);
  }

  addCategory(category) {
    this.setState({
      categories: {
        ...this.state.categories,
        [category]: <Category categoryName={category} />,
      },
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
        <div>{this.state.display}</div>
      </Fragment>
    );
  }
}

class CategoryList extends React.Component {
  render() {
    return (
      <ReactShadowScroll className="list-category">
        <ul>
          {Object.keys(this.props.categories).map((key) => {
            return (
              <li key={key} onClick={() => this.props.setContentPane(key)}>
                {key}
              </li>
            );
          })}
        </ul>
      </ReactShadowScroll>
    );
  }
}

class AddCategoryForm extends React.Component {
  createCategory = (e) => {
    e.preventDefault();
    let category = this._inputElement.value;
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
