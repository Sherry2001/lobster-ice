import React, { Component } from 'react';

class Item extends Component {
  formatSourceLink = () => {
    if (this.props.item.sourceLink) {
      return <a href={this.props.item.sourceLink}>Source</a>;
    }
    return "";
  };

  render() {
    return (
      <div className="tile is-parent is-4">
        <article className="tile is-child box">
          <p className="title">{this.props.item.highlight}</p>
          <div className="content">
            <p>{this.props.item.comment}</p>
            {this.formatSourceLink()}
          </div>
        </article>
      </div>
    );
  }
}

export default Item;