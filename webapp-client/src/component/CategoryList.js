import React from 'react';

// TODO: Add support to highlight active category.
export default class CategoryList extends React.Component {
  // this.props.categories: a list of category ids fetched from db
  // this.props.setContentPane: sets the current category to be displayed
  render() {
    return (
      <React.Fragment>
        {this.props.categories.map((category, index) => {
          return (
            <a className="panel-block is-active" key={index} onClick={() => this.props.setContentPane(category)}>
              {category}
            </a>
          );
        })}
      </React.Fragment>
    );
  }
}
