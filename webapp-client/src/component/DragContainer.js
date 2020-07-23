import React from 'react';
import { useDrag } from 'react-dnd';

export default function DragContainer(props) {
  const title = props.title;
  const id = props.id;
  const deleteCategory = async () => {
    const request = {
      method: 'DELETE',
      body: JSON.stringify({
        categoryId: id,
      }),
      headers: { 'Content-type': 'application/json' },
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/category/deleteCategory',
        request
      );
      if (response.status !== 200) {
        throw new Error(response.statusMessage);
      }
    } catch (error) {
      // TODO: use errorify to handle errors
      console.log('delete category error');
    }
  };
  const [{ isDragging }, drag] = useDrag({
    item: { title, type: 'category' },
    end: (item, monitor) => {
      const isDropped = monitor.getDropResult();
      if (item && isDropped) {
        deleteCategory(id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <a
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="panel-block is-active"
      key={id}
      onClick={() => props.setCurrentCategory(id, title)}
    >
      {title}
    </a>
  );
}
