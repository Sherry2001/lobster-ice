import React from 'react';
import './App.css';
import CategoryList from './component/CategoryList';
import AddCategoryForm from './component/AddCategoryForm';
import ContentPane from './component/ContentPane';
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
    this.setUserId = this.setUserId.bind(this);
  }

  setCurrentCategory(id, title) {
    this.setState({
      categoryId: id,
      categoryTitle: title,
    });
  }

  setUserId(userId) {
    this.setState({ userId });
  }

  render() {
    return (
      <>
        <Navbar userId={this.userId} />
        <div className="columns">
          <div className="column is-one-fifth">
            <nav className="panel pb-1">
              <CategoryList
                setCurrentCategory={this.setCurrentCategory}
                userID={this.userId}
              />
              <div className="panel-block"></div>
              {/* TODO: Pull AddCategoryForm to the bottom of the page */}
              <AddCategoryForm addCategory={this.addCategory} />
            </nav>
          </div>
          <div className="column">
            <ContentPane
              defaultCategory={this.defaultCategory}
              categoryId={this.state.categoryId}
              categoryTitle={this.state.categoryTitle}
              userId={this.userId}
              setUserId={this.setUserId}
            />
          </div>
        </div>
      </>
    );
  }
}
