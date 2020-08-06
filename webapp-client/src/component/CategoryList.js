import React from 'react';
import PropTypes from 'prop-types';
import DropContainer from './DropContainer';
import allowErrorMessage from '../errorify';
import DragDropContainer from './DragDropContainer';

export default class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      categoryList: [],
    };
    this.addCategoryElement = this.addCategoryElement.bind(this);
    this.getCategoryList = this.getCategoryList.bind(this);
    allowErrorMessage(this);
  }

  async getCategoryList() {
    const header = { 'Content-Type': 'application/json' };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          '/category/getCategories/' +
          this.props.userID,
        header
      );
      if (response.status !== 200) {
        throw new Error(response.statusMessage);
      }
      // Gets an array of Mongo Cateogry objects, each with _id and title fields
      const categoryList = await response.json();
      this.setState({
        categoryList,
      });
    } catch (error) {
      this.clearErrorMessage();
    }
  }

  componentDidMount() {
    this.getCategoryList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props || prevState !== this.state) {
      this.getCategoryList();
    }
  }

  /**
   * Given Mongo category object, creates panel block displaying category title and updates current category id and
   *  title on click
   * @param {{_id, title}} category - Mongo category object with _id and title fields
   */
  addCategoryElement(category) {
    return (
      <>
        <DragDropContainer
          title={category.title}
          categoryId={category._id}
          currentCategoryId={this.props.currentCategoryId}
          setCurrentCategory={this.props.setCurrentCategory}
        />
      </>
    );
  }

  render() {
    return (
      <>
        <div className="partial">
          {this.addCategoryElement({title: 'All', _id: 'All'})}
          {this.state.categoryList.map((category) =>
            this.addCategoryElement(category)
          )}
          {this.renderErrorMessage('Error displaying list of category')}
        </div>
        <DropContainer />
      </>
    );
  }
}

CategoryList.propTypes = {
  currentCategoryId: PropTypes.string.isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};
