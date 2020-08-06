import React from 'react';
import {useDrop} from 'react-dnd';

/**
 * Drop area to delete a category
 */
export default function DropContainer() {
  const [{canDrop, isOver}, drop] = useDrop({
    accept: 'category',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let backgroundColor = 'white';
  let textMessage = 'Drag category here';
  if (isActive) {
    backgroundColor = 'red';
    textMessage = 'Release to delete';
  }
  return (
    <div
      className="btn-default pt-1"
      ref={drop}
      style={{color: 'black', backgroundColor}}
    >
      <i className="fa fa-trash fa-2x" aria-hidden="true"></i>
      {textMessage}
    </div>
  );
}
