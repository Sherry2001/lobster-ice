import Category from './Category';
import Item from './Item';
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
    let url;
    if (category === 'All') {
      url = process.env.REACT_APP_API_URL + '/item/getItems/' + userId;
    } else {
      url =
        process.env.REACT_APP_API_URL +
        '/category/getCategoryItems/' +
        category;
    }
    try {
      const response = await fetch(url);
      if (response.status !== 200) {
        throw new Error(response.statusMessage);
      }
      const items = await response.json();
      this.setState({ items });
    } catch (error) {
      console.error(error);
    }
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
