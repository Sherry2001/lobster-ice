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
  if (isActive) {
    return (
      <i ref={drop}  className="fa fa-trash-o fa-3x" aria-hidden="true"></i>
    );
  } else {
    return (
      <i ref={drop} className="fa fa-trash fa-3x" aria-hidden="true"></i>
    );
  }
}
