import React from 'react';
import { useDrag } from 'react-dnd';
import DeleteCategory from './DeleteCategory';

export default function DragContainer(props) {
  const title = props.title;
  const id = props.id;
  const index = props.index;
  const [{ isDragging }, drag] = useDrag({
    item: { title, type: 'category' },
    end: (item, monitor) => {
      const isDropped = monitor.getDropResult();
      if (item && isDropped) {
        this.props.DeleteCategory(id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <a
      ref={drag}
      style={{ opacity: isDragging ? 0.6 : 1 }}
      className="panel-block is-active"
      key={index}
      onClick={() => this.props.setCurrentCategory(id, title)}
    >
      {title}
    </a>
  );
}
