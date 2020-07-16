import React, { Component } from 'react';

class Item extends Component {
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

export default Item;
