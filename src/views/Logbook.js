import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import * as routerActions from 'react-router-redux';
import { DayPickerSingleDateController } from 'react-dates';
import { AppBar, Button, Card, CardContent, Grid, Toolbar, Typography, withStyles } from 'material-ui';
import 'react-dates/lib/css/_datepicker.css';
import * as actions from '../actions';
import { searchPost } from '../api';
import { getPostErrorMessage } from '../reducers';
import EditPost from '../components/EditPostContainer';
import EditPostButtonBar from '../components/EditPostButtonBarContainer';
import Editor from '../components/Editor';


const isSameDate = (date1, date2) => date1.date() === date2.date()
  && date1.month() === date2.month()
  && date1.year() === date2.year();

const styles = () => ({
  flex: {
    flex: 1,
  },
  MuiCardContent: {
    padding: 0,
  },
  headline: {
    marginRight: '0.5em',
  },
  grid: {
    marginTop: '0.5em',
  },
});

class Logbook extends React.Component {

  constructor(props) {
    super(props);
    const startDate = moment([moment().year(), moment().month() - 1]);
    const endDate = moment(startDate).endOf('month');
    this.state = {
      startDate,
      endDate,
      currentDate: moment(props.date),
      post: undefined,
    };
    this.findPostByName = this.findPostByName.bind(this);
  }

  componentWillMount() {
    this.findPostByName(this.state.currentDate.format('YYYYMMDD'));
  }


  findPostByName(postTitle) {
    searchPost(postTitle)
        .then(
          (resp) => {
            if (resp.data.status === 'success' && resp.data.data.id !== undefined) {
              this.setState({ post: resp.data.data });
            }
          },
          // TODO: error handling
          error => console.error(error),
        );
  }

  render() {
    const { classes, createEntry, errorMessage, navigateTo } = this.props;

    if (errorMessage) {
      return (
        <div>
          <Card>
            <CardContent>
              <h1>Logbook</h1>
              <p>{errorMessage}</p>
            </CardContent>
          </Card>
        </div>
      );
    }


    return (
      <Card>
        <CardContent className={classes.MuiCardContent}>
          <EditPost post={this.state.post}>
            <AppBar position="static" color={'accent'}>
              <Toolbar>
                <Typography
                  type={'headline'}
                  className={classes.headline}
                >
                  Logbook
                </Typography>
                <EditPostButtonBar title={'Logbook'} showTitle={false} />
              </Toolbar>
            </AppBar>

            <Grid container spacing={0} className={classes.grid}>
              <Grid item xs={4}>
                <DayPickerSingleDateController
                  noBorder
                  onDateChange={(d) => {
                    navigateTo(`/logbook/${d.format('YYYYMMDD')}`);
                  }}
                  isDayHighlighted={selectedDate =>
                    isSameDate(moment(), selectedDate)
                    || isSameDate(this.state.currentDate, selectedDate)
                  }
                />
              </Grid>

              <Grid item xs={8}>
                {
                  this.state.post && this.state.post.id ?
                    <Editor /> :
                    <div>
                      <p>No entry for given date {this.state.currentDate.format('YYYY-MM-DD')}</p>
                      <Button
                        onClick={() =>
                          createEntry(this.state.currentDate.format('YYYYMMDD'))
                            .then(p => this.setState({ post: p }))
                        }
                      >
                        Create entry
                      </Button>
                    </div>
                }
              </Grid>
            </Grid>
          </EditPost>
        </CardContent>
      </Card>
    );
  }
}

Logbook.propTypes = {
  classes: PropTypes.object.isRequired,
  date: PropTypes.string,
  createEntry: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

Logbook.defaultProps = {
  date: undefined,
  errorMessage: '',
};

const mapStateToProps = (state, ownProps) => ({
  date: _.has(ownProps, 'match.params.date') ? ownProps.match.params.date : undefined,
  errorMessage: getPostErrorMessage(state),
});

const mapDispatchToProps = dispatch => ({
  async createEntry(date) {
    const post = await dispatch(actions.createPost({
      title: date,
    }));
    dispatch(actions.addTag(post.id, { name: 'journal' }));
    return post;
  },
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Logbook));
