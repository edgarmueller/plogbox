export const posts = [
  {
    title: "Let's test!",
    date: new Date().getTime(),
    isDraft: true,
    blocks: [
      {
        id: 0,
        dialect: 'markdown',
        text: `
            # Test, test, test!
            ## Wohooo
            ### Sub wohoo
            `,
      },
    ],
  },
];

export const firstPost = posts[0];

export default posts;
