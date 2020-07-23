import React from 'react';
import { useDrop } from 'react-dnd';

export default function DropContainer() {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'category',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let backgroundColor = 'white';
  let textMessage = 'Drag category here'
  if (isActive) {
    backgroundColor = 'red';
    textMessage = 'Release to delete'
  }
  return (
    <div className="btn-default" ref={drop} style={{color:'black', backgroundColor}}>
      <i className="fa fa-trash fa-2x" aria-hidden="true"></i>
      {textMessage}
    </div>
  );
}
