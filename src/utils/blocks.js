import * as _ from 'lodash';

export const moveBlockUp = (blocks, block) => {
  const index = _.findIndex(blocks, b => b.id === block.id);

  if (index === 0) {
    return blocks;
  }

  const otherBlock = blocks[index - 1];
  const copy = blocks.slice();
  copy[index - 1] = block;
  copy[index] = otherBlock;

  return copy;
};

export const moveBlockDown = (blocks, block) => {
  const index = _.findIndex(blocks, b => b.id === block.id);

  if (index === blocks.size - 1) {
    return blocks;
  }

  const otherBlock = blocks[index + 1];
  const copy = blocks.slice();
  copy[index + 1] = block;
  copy[index] = otherBlock;
  return copy;
};


/**
 * Sort blocks by their index.
 *
 * @param blocks the List of blocks to be sorted
 * @return the sorted List as determined by the index property
 */
  // TODO: make use of this
export const sortBlocks = blocks => blocks.sortBy(b => b.index);