import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

export default class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      categoryList: [],
    };
    this.addCategoryElement = this.addCategoryElement.bind(this);
    this.clearHasError = this.clearHasError.bind(this);
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
      this.setState({ hasError: true });
    }
  }

  addCategoryElement(category, index) {
    return (
      <a
        className="panel-block is-active"
        key={index}
        onClick={() => this.props.setCurrentCategory(category._id, category.title)}
      >
        {category.title}
      </a>
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
        {this.addCategoryElement({title: 'All', _id:'All'},0)}
        {this.state.categoryList.map((category, index) =>
          this.addCategoryElement(category, index + 1)
        )}

        <ErrorMessage
          hasError={this.state.hasError}
          message={'Error displaying list of category'}
          closePopup={this.clearHasError}
        />
      </>
    );
  }
}

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};
