export const posts = [
    {
        title: "Let's test!",
        date: new Date().getTime(),
        isDraft: true,
        blocks: [{
            dialect: "markdown",
            text: `
            # Test, test, test!
            ## Wohooo
            ### Sub wohoo
            `
        }]
    }
];

export const firstPost = posts[0];

export default posts;