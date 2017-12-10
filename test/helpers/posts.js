export const blocks = [
  {
    id: 0,
    dialect: 'markdown',
    text: `
            # Test, test, test!
            ## Wohooo
            ### Sub wohoo
            `,
  },
];

export const posts = [
  {
    id: 0,
    title: "Let's test!",
    date: new Date().getTime(),
    isDraft: true,
    blocks,
    tags: [
      {
        name: 'woohoo',
      },
      {
        name: 'another one',
      },
    ],
  },
];

export const firstPost = posts[0];

