import '../stylesheets/ContentPane.css';
import allowErrorMessage from '../errorify.js';
import Item from './Item';
import PropTypes from 'prop-types';
import React from 'react';

export default class ContentPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    allowErrorMessage(this);
  }

  componentDidMount() {
    this.setItems(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setItems(this.props);
    }
  }

  async setItems(props) {
    const { categoryId, defaultCategory, userId } = props;
    let url;
    let response;
    let items;
    try {
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
      if (response.status !== 200) {
        throw new Error(response.statusMessage);
      }
      this.setState({ items });
    } catch (error) {
      this.showErrorMessage();
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
        {this.renderErrorMessage('Error retrieving clippings')}
        <div className="wrap tile is-ancestor">
          {this.state.items.map((item, index) => {
            return <Item key={index} item={item} />;
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
