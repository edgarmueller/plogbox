import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, withStyles } from 'material-ui';
import Radium from 'radium';
import { Link } from 'react-router-dom';
import TagList from '../containers/TagListContainer';
import UserIndicator from './UserIndicator';

const RadiumLink = Radium(Link);
const drawerWidth = 240;
const styles = theme => ({
  logo: {
    color: '#333435',
    borderRadius: '16px',
    paddingLeft: '2em',
    paddingRight: '2em',
    paddingTop: '1em',
    paddingBottom: '1em',
    fontSize: '1.8125em',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontFamily: "'Montserrat', sans-serif",
  },
  drawerPaper: {
    width: drawerWidth,
    padding: 10,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
});

const Sidebar = ({ classes }) => (
  <Drawer
    variant="permanent"
    open
    classes={{
      paper: classes.drawerPaper,
    }}
  >
    <RadiumLink className={classes.logo} to="/">
      plog_
    </RadiumLink>
    <UserIndicator />
    <TagList />
  </Drawer>
);

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

Sidebar.defaultProps = {

};

export default withStyles(styles)(Sidebar);
