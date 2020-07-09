import React, { Fragment } from 'react';
import logo from './lobster-icon.jpg';
import './App.css';
import CategoryList from './component/CategoryList';
import ContentPane from './component/ContentPane';
import AddCategoryForm from './component/AddCategoryForm';
import Category from './component/Category';
import Navbar from './component/Navbar';

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
        <Navbar logo={logo} />
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
            <ContentPane />
          </div>
        </div>
      </Fragment>
    );
  }
}
