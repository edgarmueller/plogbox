import React from 'react';

class Hovered extends React.Component {
  state = {
    isHovered: false,
  };

  onMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  onMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  render() {
    const { children } = this.props;
    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {children(this.state.isHovered)}
      </div>
    )
  }
}


export default Hovered;