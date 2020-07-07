import React from 'react';
import '../stylesheets/Category.css';

export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: props.categoryName,
      categoryItems: [],
    };
  }

  render() {
    return (
      <div className="category-page">
        <h2 className="category-name">{this.props.categoryName}</h2>
      </div>
    );
  }
}
