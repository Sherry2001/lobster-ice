import React from 'react';
import '../stylesheets/Item.css';

const Item = (props) => {
  return (
    <div className="item">
      <h3 className="highlight">
        {props.highlight.value}
      </h3>
      <a className="source-link" target="_blank" href={props.sourcelink.value}></a>
      <p className="notes">
        {props.notes.value}
      </p>
    </div>
  );
};

export default Item;
