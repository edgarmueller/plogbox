/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import BlockEditor from '../../src/components/BlockEditor';

test('should render Editor', () => {
  const block = {
    id: 1,
    dialect: 'markdown',
    text: '# some markdown text',
  };

  /* eslint-disable */
  const AceEditor = require('react-ace').default;
  /* eslint-enable */

  // TODO: use fake props?
  const enzymeWrapper = mountWithContext(
    <BlockEditor
      postId={0}
      block={block}
      onDrop={() => {}}
      handleUpdateBlock={() => {}}
    />,
  );

  const editor = enzymeWrapper.find(AceEditor);
  expect(editor.length).toBe(1);
});
