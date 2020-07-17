import Category from './Category';
import Item from './Item';
import PropTypes from 'prop-types';
import React from 'react';

export default class ContentPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayCategory: <Category categoryName="All" />,
      items: [],
    };
    this.setContentPane = this.setContentPane.bind(this);
  }

  async componentDidMount() {
    const { category, userId } = this.props;
    const items = await this.getItems(category, userId);
    this.setState({ items });
  }

  async getItems(category, userId) {
    let url, response, items;
    if (category === 'All') {
      url = process.env.REACT_APP_API_URL + '/item/getItems/' + userId;
      response = await fetch(url);
      items = await response.json();
    } else {
      url =
        process.env.REACT_APP_API_URL +
        '/category/getCategoryItems/' +
        category;
      response = await fetch(url);
      const categoryObject = await response.json();
      items = categoryObject.items;
    }
    if (response.status !== 200) {
      throw new Error(response.statusMessage);
    }
    return items;
  }

  setContentPane(content) {
    this.setState({
      displayCategory: content,
    });
  }

  render() {
    return (
      <>
        {this.state.displayCategory}
        <div className="wrap tile is-ancestor">
          {this.state.items.map((item, i) => {
            return <Item key={i} item={item} />;
          })}
        </div>
      </>
    );
  }
}

ContentPane.propTypes = {
  category: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
