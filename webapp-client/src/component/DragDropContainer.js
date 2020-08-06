import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import allowErrorMessage from '../errorify';

/**
 * Draggable category container displayed in category list
 * @param {*} props
 */
function DragAndDrop(props) {
  const title = props.title;
  const categoryId = props.categoryId;

  // Drag action dragging categories
  const [{ isDragging }, drag] = useDrag({
    item: { title, type: 'category' },
    end: (item, monitor) => {
      const isDropped = monitor.getDropResult();
      if (item && isDropped) {
        props.deleteCategory(categoryId);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  //Drop action accepting items
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'item',
    drop: () => ({ categoryId: categoryId }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let backgroundColor = 'white';
  if (isActive) {
    backgroundColor = 'lightgrey';
  }

  const mergeRef = (...refs) => {
    return (inst) => {
      for (let ref of refs) {
        ref(inst);
      }
    };
  };

  return (
    <a
      ref={mergeRef(drag, drop)}
      style={{ opacity: isDragging ? 0.5 : 1, backgroundColor }}
      className={
        props.currentCategoryId === categoryId
          ? 'panel-block has-background-light'
          : 'panel-block'
      }
      key={categoryId}
      onClick={() => props.setCurrentCategory(categoryId, title)}
    >
      {title}
    </a>
  );
}

DragAndDrop.propTypes = {
  title: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
  currentCategoryId: PropTypes.string.isRequired,
};

/**
 * Wrapper around Drag functional component that handles error and displays error message
 */
export default class DragDropContainer extends React.Component {
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
        categoryId: this.props.categoryId,
      }),
      headers: { 'Content-type': 'application/json' },
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/category/deleteCategory',
        request
      );
      this.props.getCategoryList();
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
        <DragAndDrop
          title={this.props.title}
          categoryId={this.props.categoryId}
          deleteCategory={this.deleteCategory}
          setCurrentCategory={this.props.setCurrentCategory}
          currentCategoryId={this.props.currentCategoryId}
        />
        {this.renderErrorMessage('Error deleting category')}
      </>
    );
  }
}

DragDropContainer.propTypes = {
  title: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  setCurrentCategory: PropTypes.func.isRequired,
  currentCategoryId: PropTypes.string.isRequired,
};
