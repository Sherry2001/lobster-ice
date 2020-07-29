import React from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import allowErrorMessage from '../errorify';

/**
 * Draggable category container displayed in category list
 * @param {*} props
 */
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

Drag.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
};

/**
 * Wrapper around Drag functional component that handles error and displays error message
 */
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

DragContainer.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
