import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';
import DragContainer from './DragDropContainer';
import DropContainer from './DropContainer';

export default class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      categoryList: [],
    };
    this.addCategoryElement = this.addCategoryElement.bind(this);
    this.clearHasError = this.clearHasError.bind(this);
    this.getCategoryList = this.getCategoryList.bind(this);
  }

  async getCategoryList(){
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
        {this.addCategoryElement({ title: 'All', _id: 'All' }, 'All')}
        {this.state.categoryList.map((category) =>
          this.addCategoryElement(category)
        )}

        <ErrorMessage
          hasError={this.state.hasError}
          message={'Error displaying list of category'}
          closePopup={this.clearHasError}
        />
        <DropContainer />
      </>
    );
  }
}

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};
