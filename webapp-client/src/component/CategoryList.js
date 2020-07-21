import React from 'react';
import PropTypes from 'prop-types';

export default class CategoryList extends React.Component {
  constructor(props){
    super(props);
    this.addAElement = this.addAElement.bind(this);
  }

  addAElement(category, index){
    return (
      <a className="panel-block is-active" key={index} onClick={() => this.props.setContentPane(category)}>
        {category}
      </a>
    ); 
  }

  render() {
    return (
      <React.Fragment>
        {this.props.categories.map((category, index) => this.addAElement(category, index))}
      </React.Fragment>
    );
  }
}

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setContentPane: PropTypes.func.isRequired
}
