import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentCreate from 'material-ui/svg-icons/content/create';
import { Card, CardText, CardTitle, TableRowColumn } from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ButtonBar from './ButtonBarContainer';
import Tag from './TagContainer';

const miniFloatingButtonStyle = {
  margin: '0.75em',
};

const floatingButtonStyle = {
  float: 'right',
  marginTop: '2.5em',
};

const formatDate = (timestap) => {
  const t = new Date(timestap);
  return t.toDateString();
};

export const PostList =
  ({
     posts,
     addPost,
     setSelection,
     selection,
     selectPost,
     deletePost,
  }) =>
    (<div>
      <Card>
        <CardTitle>
          <span><strong>SELECT A POST &nbsp;</strong></span>
          <ButtonBar />
        </CardTitle>

        <CardText>
          <Table
            selectable={false}
            onCellClick={(row, col) => {
              console.log('CALL ME', row);
              // if (this.state.didDelete) {
              //     // ignore
              //   this.setState({
              //     didDelete: false,
              //   });
              // } else {
              setSelection(false, row, col);
              // }
            }}
          >
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Title</TableHeaderColumn>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Edit or Delete</TableHeaderColumn>
                <TableHeaderColumn>Tags</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} >
              {
                posts.map((post, rowIndex) => (
                  <TableRow key={post.id}>
                    <TableRowColumn>{post.title}</TableRowColumn>
                    <TableRowColumn>{formatDate(post.date)}</TableRowColumn>
                    <TableRowColumn>
                      <FloatingActionButton
                        onClick={() => selectPost(post)}
                        backgroundColor="#2c3e50"
                        mini
                        style={miniFloatingButtonStyle}
                      >
                        <ContentCreate />
                      </FloatingActionButton>
                      <FloatingActionButton
                        onClick={() => deletePost(post)}
                        backgroundColor="#2c3e50"
                        mini
                        style={miniFloatingButtonStyle}
                      >
                        <ContentRemove />
                      </FloatingActionButton>
                    </TableRowColumn>
                    <TableRowColumn>
                      <Tag
                        post={post}
                        isEditingTags={selection.row === rowIndex && selection.col === 3}
                        setSelection={setSelection}
                      />
                    </TableRowColumn>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>

          <FloatingActionButton
            style={floatingButtonStyle}
            onClick={addPost}
            backgroundColor="#2c3e50"
          >
            <ContentAdd />
          </FloatingActionButton>
        </CardText>
      </Card>


    </div>
    );

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  selection: PropTypes.shape({
    row: PropTypes.number,
    col: PropTypes.number,
  }),
  setSelection: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  selectPost: PropTypes.func.isRequired,
};

PostList.defaultProps = {
  posts: [],
  errorMessage: undefined,
  selection: {
    row: -1,
    col: -1,
  },
};

export default PostList;
