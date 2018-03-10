import React from 'react';
import PropTypes from 'prop-types';

class MouseOverVisibleSpan extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    const { children } = this.props;
    const isVisible = this.state.visible ? 'visible' : 'hidden';
    const childrenWithProps = React.Children.map(children, child => {
      const style = { visibility: isVisible };
      return React.cloneElement(child, { style });
    });

    return (
      <span
        onMouseEnter={() => this.setState({ visible: true }) }
        onMouseLeave={() => this.setState({ visible: false }) }
      >
        {childrenWithProps}
      </span>
    );
  }
}

MouseOverVisibleSpan.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default MouseOverVisibleSpan;
