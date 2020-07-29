import React from 'react';
import './App.css';
import CategoryList from './component/CategoryList';
import AddCategoryForm from './component/AddCategoryForm';
import Category from './component/Category';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
      userId: '',
    };
    this.setCurrentCategory = this.setCurrentCategory.bind(this);
    this.setUserId = this.setUserId.bind(this);
  }

  setUserId(userId) {
    this.setState({ userId });
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
        <Navbar userID={this.state.userId} setUserId={this.setUserId} />
        <div className="columns">
          <div className="column is-one-fifth">
            <nav className="panel pb-1">
            <DndProvider backend={HTML5Backend}>
              <CategoryList
                currentCategoryId={this.state.categoryId}
                setCurrentCategory={this.setCurrentCategory}
                //TODO: Take in userID from OAuth */
                userID={this.state.userId}
              />
            </DndProvider>
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
