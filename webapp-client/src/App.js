import React, { Fragment } from 'react';
import logo from './lobster-icon.jpg';
import './App.css';
import './stylesheets/bulma.min.css';
import CategoryList from './component/CategoryList';
import AddCategoryForm from './component/AddCategoryForm';
import Category from './component/Category';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    /** hard-coded for now, will be fetched from db */
    this.default = 'All';
    this.state = {
      /** list of category names for now, will be list of category ids later */
      categories: [this.default],
      currentCategory: this.default,
    };
    this.setCurrentCategory = this.setCurrentCategory.bind(this);
    this.addCategory = this.addCategory.bind(this);
  }

  setCurrentCategory(category) {
    this.setState({
      currentCategory: category,
    });
  }

  /** Called in AddCategoryForm, to be deleted later when fetching from db */
  addCategory(category) {
    this.setState({
      categories: [...this.state.categories, category],
    });
  }

  render() {
    return (
      <Fragment>
        <div className="App">
          <h1>Lobster Ice Cream</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="columns">
          <div className="column is-one-fifth">
            <nav className="panel pb-1">
              <CategoryList
                categories={this.state.categories}
                setContentPane={this.setCurrentCategory}
              />
              <div className="panel-block"></div>
              {/* TODO: Pull AddCategoryForm to the bottom of the page */}
              <AddCategoryForm addCategory={this.addCategory} />
            </nav>
          </div>
          <div className="column">
            {/* Category will later be replaced by a component named ItemContainer including category name and list of item ids of that category */}
            <Category categoryName={this.state.currentCategory} />
          </div>
        </div>
      </Fragment>
    );
  }
}
