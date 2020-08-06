import React from 'react';
import CategoryList from '../component/CategoryList';
import AddCategoryForm from '../component/AddCategoryForm';
import ContentPane from '../component/ContentPane';
import Navbar from '../component/Navbar';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    let redirect = false;
    let userId = null;
    if (!this.props.location.state) {
      redirect = true;
    } else {
      userId = this.props.location.state.userId;
    }
    // hard-coded for now, will be fetched from db
    this.defaultCategory = 'All';
    this.state = {
      // categoryID of the current category
      categoryId: this.defaultCategory,
      categoryTitle: this.defaultCategory,
      redirect,
      userId,
    };
    this.setCurrentCategory = this.setCurrentCategory.bind(this);
    this.setUserId = this.setUserId.bind(this);
    this.getUserId = this.getUserId.bind(this);
  }

  setUserId(userId) {
    this.setState({userId});
  }

  getUserId() {
    return this.state.userId;
  }

  setCurrentCategory(id, title) {
    this.setState({
      categoryId: id,
      categoryTitle: title,
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <Navbar setUserId={this.setUserId} getUserId={this.getUserId} />
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
              <AddCategoryForm
                userId={this.state.userId}
                addCategory={this.addCategory}
              />
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

MainPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }),
  }),
};
