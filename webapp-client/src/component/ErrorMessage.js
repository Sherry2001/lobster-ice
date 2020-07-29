import React from 'react';

export default class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openWindow: true,
    };
    this.displayError = this.displayError.bind(this);
  }

  displayError() {
    if (this.props.hasError && this.state.openWindow) {
      return (
        <div className="notification is-warning">
          <button className="delete" onClick={this.props.closePopup}></button>
          {this.props.message}
        </div>
      );
    }
    return null;
  }

  render() {
    return this.displayError();
  }
}
