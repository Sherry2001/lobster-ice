import React, { Fragment } from "react";
// installation: npm i react-shadow-scroll or yarn add react-shadow-scroll
import ReactShadowScroll from "react-shadow-scroll";
//import {Route, NavLink, useLocation} from 'react-router-dom';
import "../stylesheets/Navbar.css";
import Category from "./Category"
import CategoryPane from "./ContentPane"

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: {
        "All": <Category categoryName={'All'} />,
      },
    };
    this.addCategory = this.addCategory.bind(this);
  }

  addCategory(category) {
    this.setState({
      categories: {
        ...this.state.categories,
        [category]: <Category categoryName={category} />,
      },
    });
  }
  render() {
    return (
      <Fragment>
        <div className="nav-bar">
          <CategoryList
            categories={this.state.categories}
            newListItem={this.newListItem}
          />
          <AddCategoryForm addCategory={this.addCategory} />
        </div>
        <CategoryPane category={this.state.categories['All']} />
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
            return <li key={key}>{key}</li>;
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
    this._inputElement.value = "";
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
