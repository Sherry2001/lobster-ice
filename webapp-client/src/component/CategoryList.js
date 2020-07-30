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
    allowErrorMessage(this);
  }

  async componentDidMount() {
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
      this.setState({ hasError: true });
    }
  }

  componentDidMount() {
    this.getCategoryList();
  }

  componentDidUpdate() {
    this.getCategoryList();
  }

  addCategoryElement(category, key) {
    return (
      <>
        <DragContainer
          title={category.title}
          id={category._id}Ï
          key={key}
          setCurrentCategory={this.props.setCurrentCategory}
        />
      </>
    );
  }

  clearHasError() {
    this.setState({
      hasError: false,
    });
  }

  render() {
    return (
      <>
        {this.addCategoryElement({ title: 'All', _id: 'All' })}
        {this.state.categoryList.map((category) =>
          this.addCategoryElement(category)
        )}

        {this.renderErrorMessage('Error displaying list of category')}
      </>
    );
  }
}

CategoryList.propTypes = {
  currentCategoryId: PropTypes.string.isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};
