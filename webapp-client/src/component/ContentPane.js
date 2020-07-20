import Category from './Category';
import Item from './Item';
import PropTypes from 'prop-types';
import React from 'react';

export default class ContentPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }

  async componentDidMount() {
    const items = await this.getItems(this.props);
    this.setState({ items });
  }

  async getItems(props) {
    const { currentCategory, defaultCategory, userId } = props;
    let url, response, items;
    if (currentCategory === defaultCategory) {
      url = process.env.REACT_APP_API_URL + '/item/getItems/' + userId;
      response = await fetch(url);
      items = await response.json();
    } else {
      url =
        process.env.REACT_APP_API_URL +
        '/category/getCategoryItems/' +
        currentCategory;
      response = await fetch(url);
      const categoryObject = await response.json();
      items = categoryObject.items;
    }
    // TODO: Add Cynthia's error message pop-up.
    if (response.status !== 200) {
      throw new Error(response.statusMessage);
    }
    return items;
  }

  render() {
    return (
      <>
        <Category categoryName="All" />
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
  currentCategory: PropTypes.string.isRequired,
  defaultCategory: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
