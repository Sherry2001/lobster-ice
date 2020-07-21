import '../stylesheets/ContentPane.css';
import { debounce } from 'lodash';
import Item from './Item';
import PropTypes from 'prop-types';
import React from 'react';

export default class ContentPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.setItems = debounce(this.setItems, 1);
  }

  componentDidMount() {
    this.setItems(this.props);
  }

  componentDidUpdate() {
    this.setItems(this.props);
  }

  async setItems(props) {
    const { categoryId, defaultCategory, userId } = props;
    let url;
    let response;
    let items;
    if (categoryId === defaultCategory) {
      url = process.env.REACT_APP_API_URL + '/item/getItems/' + userId;
      response = await fetch(url);
      items = await response.json();
    } else {
      url =
        process.env.REACT_APP_API_URL +
        '/category/getCategoryItems/' +
        categoryId;
      response = await fetch(url);
      const categoryObject = await response.json();
      items = categoryObject.items;
    }
    // TODO: Add Cynthia's error message pop-up.
    if (response.status !== 200) {
      throw new Error(response.statusMessage);
    }
    this.setState({ items });
  }

  async deleteItem(item) {
    const url = process.env.REACT_APP_API_URL + '/item/deleteItem/';
    console.log(item._id);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ itemId: item._id }),
    });
    if (response.status !== 200) {
      console.error(response.statusMessage);
      throw new Error(response.statusMessage);
    }
  }

  render() {
    return (
      <>
        <nav className="level">
          <h1 className="level-item has-text-centered title">
            {this.props.categoryTitle}
          </h1>
        </nav>
        <div className="wrap tile is-ancestor">
          {this.state.items.map((item, index) => {
            return (
              <Item key={index} item={item} deleteItem={this.deleteItem} />
            );
          })}
        </div>
      </>
    );
  }
}

ContentPane.propTypes = {
  categoryTitle: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  defaultCategory: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
