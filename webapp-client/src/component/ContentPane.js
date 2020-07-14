import React from 'react';
import Category from './Category';
import Item from './Item';
import '../stylesheets/ContentPane.css';

export default class ContentPane extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      displayCategory: <Category categoryName='All' />,
      items: []
    };
    this.setContentPane = this.setContentPane.bind(this);
  }

  async componentDidMount () {
    try {
      const dummyUser = '5f050952f516f3570ee26724';
      const response = await fetch('http://localhost:8080/item/getItems/' + dummyUser);
      if (response.status !== 200) {
        throw new Error(response.statusMessage);
      }
      const items = await response.json();
      this.setState({ items });
    } catch (error) {
      console.error(error);
    }
  }

  setContentPane (content) {
    this.setState({
      displayCategory: content
    });
  }

  render () {
    return (
      <>
        {this.state.displayCategory}
        <div className='wrap tile is-ancestor'>
          {this.state.items.map((item, i) => {
            return <Item key={i} item={item} />;
          })}
        </div>
      </>
    );
  }
}
