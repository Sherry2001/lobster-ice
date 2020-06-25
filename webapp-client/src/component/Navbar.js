import React from 'react';
// installation: npm i react-shadow-scroll or yarn add react-shadow-scroll
import ReactShadowScroll from 'react-shadow-scroll';
import '../stylesheets/Navbar.css';

const Navbar = React.createClass({
  getInitialState() {
    return ({
      categories: {
        'category-1': 'All'
      }
    });
  },
  addCategory(category) {
    const timestamp = (new Date()).getTime();
    this.state.categories['category' + timestamp] = category;
    this.setState({categories: this.state.categories});
  },
  render() {
    return (
      <div className='nav-bar'>
        <CategoryList categories={this.state.categories} />
        <AddCategoryForm addCategory={this.addCategory} />
      </div>
    )
  }
});

const CategoryList = React.createClass({
  render() {
    return(
      <ReactShadowScroll>
        <ul>
          {
            Object.keys(this.props.categories).map(function(key) {
              return <li className="list-category">{this.props.categories[key]}</li>
            }.bind(this))
          }
        </ul>
      </ReactShadowScroll>
    );
  }
});

const AddCategoryForm = React.createClass({
  createCategory() {
    let category = this.refs.categoryName.value;
    if(typeof cateogry === 'string' && category.length > 0) {
      this.props.addCategory(category);
      this.refs.categoryForm.reset();
    }
  },
  render() {
    return(
      <form className="add-category-form" ref="categoryForm" onSubmit={this.createCategory}>
        <label for="categoryName">
          Category Name
        </label>
        <button type="submit" className="submit-button">Add Category</button>
      </form>
    );
  }
});

export default Navbar;