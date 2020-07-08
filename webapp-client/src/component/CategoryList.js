import React from 'react';
import '../stylesheets/CategoryList.css';

export default class CategoryList extends React.Component {
    // this.props.categories: a list of category ids fetched from db
    // this.props.setContentPane: sets the current category to be displayed
  render() {
    return (
      <ul className="list-category">
        {this.props.categories.map((category, index) => {
          return (
            <li key={index} onClick={() => this.props.setContentPane(category)}>
              {category}
            </li>
          );
        })}
      </ul>
    );
  }
}
