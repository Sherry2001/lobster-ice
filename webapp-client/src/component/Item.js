import '../stylesheets/Item.css';
import allowErrorMessage from '../errorify';
import PropTypes from 'prop-types';
import React from 'react';
import {useDrag} from 'react-dnd';
import GoogleMap from './GoogleMap';

function DragItem(props) {
  const savedItem = props.item;

  const [{isDragging}, drag] = useDrag({
    item: {type: 'item'},
    end: (item, monitor) => {
      const isDropped = monitor.getDropResult();
      if (item && isDropped) {
        props.addItemToCategory(savedItem._id, `${isDropped.categoryId}`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{opacity: isDragging ? 0.5 : 1}}
      className="tile is-parent is-4"
    >
      <article className="tile is-child box">
        <article className="media">
          <div className="media-content">
            <p className="title">{savedItem.highlight}</p>
          </div>
          <div className="media-right">
            <a className="map-pin">
              <i
                onClick={() => props.setShowMap(true)}
                className="fa fa-map-pin"
                aria-hidden="true"
                id="showMap"
              ></i>
            </a>
          </div>
        </article>
        <div className="content">
          <p>{savedItem.comment}</p>
        </div>
        <div className="level">
          <div className="level-left">
            {props.formatSourceLink(savedItem.sourceLink)}
          </div>
          <div className="level-right">
            <a className="trash">
              <i
                onClick={() => props.deleteItem(savedItem)}
                className="fa fa-trash"
                aria-hidden="true"
              ></i>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

DragItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    comment: PropTypes.string,
    highlight: PropTypes.string.isRequired,
    placeId: PropTypes.string,
    sourceLink: PropTypes.string.isRequired,
  }).isRequired,
  addItemToCategory: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  formatSourceLink: PropTypes.func.isRequired,
  setShowMap: PropTypes.func.isRequired,
};

export default class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showMap: false};
    this.addItemToCategory = this.addItemToCategory.bind(this);
    this.formatSourceLink = this.formatSourceLink.bind(this);
    this.setShowMap = this.setShowMap.bind(this);
    allowErrorMessage(this);
  }

  formatSourceLink(link) {
    if (link) {
      return <a href={link}>Source</a>;
    }
    return '';
  }

  setShowMap(status) {
    this.setState({showMap: status});
  }

  async addItemToCategory(itemId, categoryId) {
    const request = {
      method: 'PUT',
      body: JSON.stringify({
        itemId: itemId,
        categoryId: categoryId,
      }),
      headers: {'Content-type': 'application/json'},
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/item/addItemToCategory',
        request
      );
      if (response.status !== 200) {
        throw new Error();
      }
    } catch (error) {
      this.showErrorMessage();
    }
  }

  render() {
    let googleMap = null;
    if (this.state.showMap) {
      googleMap = (
        <GoogleMap
          setShowMap={this.setShowMap}
          // placeId="ChIJd8BlQ2BZwokRAFUEcm_qrcA"
          placeId={this.props.item.placesId}
        />
      );
    }
    return (
      <>
        <DragItem
          item={this.props.item}
          deleteItem={this.props.deleteItem}
          addItemToCategory={this.addItemToCategory}
          formatSourceLink={this.formatSourceLink}
          setShowMap={this.setShowMap}
        />
        {googleMap}
        {this.renderErrorMessage('Error adding item to category')}
      </>
    );
  }
}

Item.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    comment: PropTypes.string,
    highlight: PropTypes.string.isRequired,
    placeId: PropTypes.string,
    sourceLink: PropTypes.string.isRequired,
  }).isRequired,
  deleteItem: PropTypes.func.isRequired,
};
