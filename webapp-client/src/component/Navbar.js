import React from 'react';
// installation: npm i react-shadow-scroll or yarn add react-shadow-scroll
import ReactShadowScroll from 'react-shadow-scroll';
import '../stylesheets/Navbar.css';

export default class Navbar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      categories : {
        'category-1' : 'All',
        'category-2' : 'France Trip',
        'category-3' : 'Senior Trip',
        'category-4' : 'All the food',
        'category-5' : 'China Trip'
      }
    };
  }
  addCategory(category) {
    const timestamp = (new Date()).getTime();
    const newCategories = Object.assign({}, this.state.categories, {['category' + timestamp]: category});
    this.setState({categories: newCategories});
  }
  render() {
    return (
      <div className='nav-bar'>
        <CategoryList categories={this.state.categories} />
        <AddCategoryForm addCategory={this.addCategory} />
      </div>
    )
  }
}

class CategoryList extends React.Component {
  render () {
    return (
      <ReactShadowScroll className="list-category">
        <ul>
          {
            Object.keys(this.props.categories).map((key) => {
              return <li>{this.props.categories[key]}</li>
            })
          }
        </ul>
      </ReactShadowScroll>
    )
  }
}

class AddCategoryForm extends React.Component {
  createCategory = () => {
    let category = this.refs.categoryName.value;
    if(typeof cateogry === 'string' && category.length > 0) {
      this.props.addCategory(category);
      this.refs.categoryForm.reset();
    }
  }
  render () {
    return(
      <form className="add-category-form" ref="categoryForm" onSubmit={this.createCategory}>
        <label htmlFor="categoryName">New Category: </label>
        <input type="text" name="categoryName"></input><br></br>
        <button type="submit" className="submit-button">Add Category</button>
      </form>
    )
  }
}
