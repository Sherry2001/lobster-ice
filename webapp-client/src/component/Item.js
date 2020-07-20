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
    const { item } = this.props;
    return (
      <div className="tile is-parent is-4">
        <article className="tile is-child box">
          <p className="title">{item.highlight}</p>
          <div className="content">
            <p>{item.comment}</p>
            {this.formatSourceLink(item.sourceLink)}
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
};
