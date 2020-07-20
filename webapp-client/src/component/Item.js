import PropTypes from 'prop-types';
import React from 'react';

export default class Item extends React.Component {
  formatSourceLink(link) {
    if (link) {
      return <a href={link}>Source</a>;
    }
    return '';
  }

  render() {
    const { item, deleteItem } = this.props;
    return (
      <div className="tile is-parent is-4">
        <article className="tile is-child box">
          <div className="level">
            <div className="level-left">
              <p className="title">{item.highlight}</p>
            </div>
            <div className="level-right">
              <i className="fa fa-plus" aria-hidden="true"></i>
            </div>
          </div>
          <div className="content">
            <p>{item.comment}</p>
          </div>
          <div className="level">
            <div className="level-left">
              {this.formatSourceLink(item.sourceLink)}
            </div>
            <div className="level-right">
              <i
                onClick={() => deleteItem(item)}
                className="fa fa-trash"
                aria-hidden="true"
              ></i>
            </div>
          </div>
        </article>
      </div>
    );
  }
}

Item.propTypes = {
  item: PropTypes.shape({
    comment: PropTypes.string,
    highlight: PropTypes.string.isRequired,
    placeId: PropTypes.string,
    sourceLink: PropTypes.string.isRequired,
  }).isRequired,
  deleteItem: PropTypes.func.isRequired,
};
