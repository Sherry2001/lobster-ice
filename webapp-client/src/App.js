import React from 'react';
import './App.css';
import CategoryList from './component/CategoryList';
import AddCategoryForm from './component/AddCategoryForm';
import ContentPane from './component/ContentPane';
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
      // TODO: Take in userID from OAuth
      userId: '5f050952f516f3570ee26724',
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
            <DndProvider backend={HTML5Backend}>
              <CategoryList
                setCurrentCategory={this.setCurrentCategory}
                userId={this.state.userId}
              />
            </DndProvider>
              <div className="panel-block"></div>
              {/* TODO: Pull AddCategoryForm to the bottom of the page */}
              <AddCategoryForm addCategory={this.addCategory} />
            </nav>
          </div>
          <div className="column">
            <DndProvider backend={HTML5Backend}>
              <ContentPane
                defaultCategory={this.defaultCategory}
                categoryId={this.state.categoryId}
                categoryTitle={this.state.categoryTitle}
                userId={this.state.userId}
              />
            </DndProvider>
          </div>
        </div>
      </>
    );
  }
}
