import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import * as routerActions from 'react-router-redux';
import { DayPickerSingleDateController } from 'react-dates';
import { Button, Card, CardContent } from 'material-ui';
import 'react-dates/lib/css/_datepicker.css';
import * as actions from '../actions';
import { getPostErrorMessage } from '../reducers';
import EditPost from '../views/EditPostView';

class Logbook extends React.Component {

  constructor(props) {
    super(props);
    const startDate = moment([moment().year(), moment().month() - 1]);
    const endDate = moment(startDate).endOf('month');
    this.state = {
      startDate,
      endDate,
      currentDate: this.props.date,
      post: undefined,
    };
  }

  componentWillMount() {
    this.props.findPostByName(this.state.currentDate)
      .then(
        post => this.setState({ post }),
      );
  }

  render() {
    const { createEntry, errorMessage, navigateTo } = this.props;

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
      <div>
        <Card>
          <CardContent>
            <h1>Logbook</h1>
            <div style={{
              paddingTop: '1em',
              paddingLeft: '1em',
              paddingRight: '1em',
              display: 'flex',
            }}
            >
              <div style={{
                width: '25%',
                marginRight: '1em',
              }}
              >
                <DayPickerSingleDateController
                  onDateChange={(d) => {
                    const date = d.format('YYYYMMDD');
                    this.setState({ currentDate: date });
                    navigateTo(`/logbook/${date}`);
                  }}
                  isDayHighlighted={(d) => {
                    const currentDate = moment();
                    return d.date() === currentDate.date()
                      && d.month() === currentDate.month()
                      && d.year() === currentDate.year();
                  }}
                />
              </div>
              <div style={{ width: '75%' }}>
                {
                  this.state.post ?
                    <EditPost selectedPost={this.state.post} /> :
                    <div>
                      <p>No entry for given date</p>
                      <Button
                        onClick={() =>
                          createEntry(this.state.currentDate)
                            .then(p => this.setState({ post: p }))
                        }
                      >
                        Create entry
                      </Button>
                    </div>
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
  }
}

Logbook.propTypes = {
  date: PropTypes.string,
  findPostByName: PropTypes.func.isRequired,
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
  findPostByName(postName) {
    return dispatch(actions.findPostByName(postName));
  },
  async createEntry(date) {
    // TODO: too many requests, should be a single one
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
)(Logbook);
