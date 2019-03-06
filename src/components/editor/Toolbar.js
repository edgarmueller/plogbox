import React from 'react';
import PropTypes from 'prop-types';
import IconButton from "@material-ui/core/IconButton";
import { Edit, Slideshow, VerticalSplit } from "@material-ui/icons";
import BounceLoader from 'react-spinners/BounceLoader'

const ToolBar = ({ isSaving, toolbarHandlers }) => {

  return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: 'center',
          padding: "5px",
          backgroundColor: "#e6e6e6"
        }}
      >
        <IconButton onClick={toolbarHandlers.handleClickShowEditorView}>
          <Edit />
        </IconButton>
        <IconButton onClick={toolbarHandlers.handleClickShowRenderedView}>
          <Slideshow />
        </IconButton>
        {
          <IconButton onClick={toolbarHandlers.handleClickShowBoth}>
            <VerticalSplit />
          </IconButton>
        }
        {isSaving ? <BounceLoader size={40}/> : null}
      </div>
  );
};


ToolBar.propTypes = {
  isSaving: PropTypes.bool,
  toolbarHandlers: PropTypes.shape({
    handleClickShowBoth: PropTypes.func.isRequired,
    handleClickShowRenderedView: PropTypes.func.isRequired,
    handleClickShowEditorView: PropTypes.func.isRequired
  }).isRequired
};

ToolBar.defaultProps = {
  isSaving: false
};

export default ToolBar;
