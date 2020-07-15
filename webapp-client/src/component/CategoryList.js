import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

export default class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
    this.addAElement = this.addAElement.bind(this);
    this.clearHasError = this.clearHasError.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
  }

  async fetchCategories() {
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
      //response.then(result => {this.categoryList = result});
      const categoryList = await response.json();
      console.log(categoryList);
      return categoryList.map((category, index) =>
        this.addAElement(category.title, index)
      );
    } catch (error) {
      console.log(error);
      this.setState({ hasError: true });
    }
  }

  addAElement(category, index) {
    return (
      <a
        className="panel-block is-active"
        key={index}
        onClick={() => this.props.setContentPane(category)}
      >
        {category}
      </a>
    );
  }

  clearHasError() {
    this.setState({
      hasError: false,
    });
  }

  render() {
    this.fetchCategories();
    return (
      <React.Fragment>
        {this.fetchCategories()}
        {/* {this.categoryList.map((category, index) => this.addAElement(category, index))} */}
      </React.Fragment>
    );
  }
}

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setContentPane: PropTypes.func.isRequired,
};
