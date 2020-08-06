import React from 'react';
import PropTypes from 'prop-types';
import DropContainer from './DropContainer';
import allowErrorMessage from '../errorify';
import DragDropContainer from './DragDropContainer';
import AddCategoryForm from './AddCategoryForm';

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
      if (this.props.userID === 'error') {
        throw new Error('UserId not defined');
      }
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
      this.showErrorMessage();
    }
  }

  componentDidMount() {
    this.getCategoryList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
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
          getCategoryList={this.getCategoryList}
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
        <AddCategoryForm userId={this.props.userID} getCategoryList={this.getCategoryList} />
      </>
    );
  }
}

CategoryList.propTypes = {
  currentCategoryId: PropTypes.string.isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};
