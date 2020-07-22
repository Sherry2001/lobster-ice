import errorify from '../errorify.js';
import ErrorMessage from './ErrorMessage';
import PropTypes from 'prop-types';
import React from 'react';

export default class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
    };
    this.addCategoryElement = this.addCategoryElement.bind(this);
    errorify(this);
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
      const categoryList = await response.json();
      this.setState({
        categoryList,
      });
    } catch (error) {
      this.showErrorMessage();
    }
  }

  addCategoryElement(category, index) {
    return (
      <a
        className="panel-block is-active"
        key={index}
        onClick={() =>
          this.props.setCurrentCategory(category._id, category.title)
        }
      >
        {category.title}
      </a>
    );
  }

  render() {
    return (
      <>
        {this.addCategoryElement({ title: 'All', _id: 'All' }, 0)}
        {this.state.categoryList.map((category, index) =>
          this.addCategoryElement(category, index + 1)
        )}
        {this.renderErrorMessage('Error displaying categories')}
      </>
    );
  }
}

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};
