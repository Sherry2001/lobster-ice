import React from 'react';
import PropTypes from 'prop-types';
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
      const categoryList = await response.json();
      this.setState({
        categoryList,
      });
    } catch (error) {
      this.showErrorMessage();
    }
  }

  addCategoryElement(category) {
    return (
      <a
        className={this.props.currentCategoryId === category._id ? "panel-block has-background-light" : "panel-block"}
        key={category._id}
        onClick={() => {
          this.props.setCurrentCategory(category._id, category.title);
        }}
      >
        {category.title}
      </a>
    );
  }

  render() {
    return (
      <>
        {this.addCategoryElement({title: 'All', _id:'All'})}
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
