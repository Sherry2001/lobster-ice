import ErrorMessage from './component/ErrorMessage';
import React from 'react';

/**
 * allowErrorMessage modifies the given component to give it a boolean state
 * variable called hasError. Along with this, the methods showErrorMessage,
 * rendorErrorMessage and clearErrorMessage are added. These allow the component
 * to easily make use of the ErrorMessage component.
 * @param {React.Component} component - A react component
 */
export default function allowErrorMessage(component) {
  component.setState({ hasError: false });
  component.clearErrorMessage = function () {
    component.setState({
      hasError: false,
    });
  };
  component.showErrorMessage = function () {
    component.setState({ hasError: true });
  };
  component.renderErrorMessage = function (message) {
    return (
      <ErrorMessage
        hasError={component.state.hasError}
        message={message}
        closePopup={component.clearHasError}
      />
    );
  };
}
