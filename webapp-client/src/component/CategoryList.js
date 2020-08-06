import React from 'react';
import PropTypes from 'prop-types';
import DragContainer from './DragContainer';
import DropContainer from './DropContainer';
import allowErrorMessage from '../errorify';

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
    const header = {'Content-Type': 'application/json'};
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

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.getCategoryList();
    }
  }

  /** Adds each category as a draggable object displaying name and onclick to change current category displayed*/
  addCategoryElement(category, key) {
    return (
      <>
        <DragContainer
          title={category.title}
          id={category._id}
          key={key}
          setCurrentCategory={this.props.setCurrentCategory}
          currentCategoryId={this.props.currentCategoryId}
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
