import React from 'react';
import logo from './lobster-icon.jpg';
import './App.css';
import CategoryList from './component/CategoryList';
import AddCategoryForm from './component/AddCategoryForm';
import Category from './component/Category';
import ContentPane from './component/ContentPane';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // hard-coded for now, will be fetched from db
    this.defaultCategory = 'All';
    this.state = {
      // categoryID of the current category
      currentCategory: this.defaultCategory,
    };
    this.setCurrentCategory = this.setCurrentCategory.bind(this);
  }

  setCurrentCategory(category) {
    this.setState({
      currentCategory: category,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <h1>Lobster Ice Cream</h1>
          <img src={logo} className="app-logo" alt="logo" />
        </div>
        <div className="columns">
          <div className="column is-one-fifth">
            <nav className="panel pb-1">
              <CategoryList
                setContentPane={this.setCurrentCategory}
                userID="5f050952f516f3570ee26724"
              />
              <div className="panel-block"></div>
              {/* TODO: Pull AddCategoryForm to the bottom of the page */}
              <AddCategoryForm addCategory={this.addCategory} />
            </nav>
          </div>
          <div className="column">
            {/* Category will later be replaced by a component named ItemContainer including category name and list of item ids of that category */}
            <ContentPane
              category={this.state.currentCategory}
              userId="5f050952f516f3570ee26724"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
