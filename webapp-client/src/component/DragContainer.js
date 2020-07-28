import React from 'react';
import { useDrag } from 'react-dnd';
import allowErrorMessage from '../errorify';

function Drag(props) {
  const title = props.title;
  const id = props.id;
  const [{ isDragging }, drag] = useDrag({
    item: { title, type: 'category' },
    end: (item, monitor) => {
      const isDropped = monitor.getDropResult();
      if (item && isDropped) {
        props.deleteCategory(id);
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

export default class DragContainer extends React.Component {
  constructor(props) {
    super(props);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.state = {};
    allowErrorMessage(this);
  }

  async deleteCategory() {
    const request = {
      method: 'DELETE',
      body: JSON.stringify({
        categoryId: this.props.id,
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
      this.showErrorMessage();
    }
  }

  render() {
    return (
      <>
        <Drag
          title={this.props.title}
          id={this.props.id}
          deleteCategory={this.deleteCategory}
          setCurrentCategory={this.setCurrentCategory}
        />
        {this.renderErrorMessage('Error deleting category')}
      </>
    );
  }
}
