import React from 'react';
import logo from './lobster-icon.jpg';
import './App.css';
import CategoryList from './component/CategoryList';
import AddCategoryForm from './component/AddCategoryForm';
import Category from './component/Category';
import Navbar from './component/Navbar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // hard-coded for now, will be fetched from db
    this.defaultCategory = 'All';
    this.state = {
      // categoryID of the current category
      categoryId: this.defaultCategory,
      categoryTitle: this.defaultCategory,
    };
    this.setCurrentCategory = this.setCurrentCategory.bind(this);
  }

  setCurrentCategory(id, title) {
    this.setState({
      categoryId: id,
      categoryTitle: title,
    });
  }

  render() {
    return (
      <>
        <Navbar />
        <div className="columns">
          <div className="column is-one-fifth">
            <nav className="panel pb-1">
              <CategoryList
                currentCategoryId={this.state.categoryId}
                setCurrentCategory={this.setCurrentCategory}
                //TODO: Take in userID from OAuth */
                userID="5f050952f516f3570ee26724"
              />
              <div className="panel-block"></div>
              {/* TODO: Pull AddCategoryForm to the bottom of the page */}
              <AddCategoryForm addCategory={this.addCategory} />
            </nav>
          </div>
          <div className="column">
            {/* Category will later be replaced by a component named ItemContainer including category name and list of item ids of that category */}
            <Category categoryName={this.state.categoryTitle} />
          </div>
        </div>
      </>
    );
  }
}
