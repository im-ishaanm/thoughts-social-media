let schema = {
    users: [
        {
            userId: 'USER_ID',
            userHandle: 'USERNAME',
            imageUrl: 'URL_LINK',
            email: 'USER_EMAIL_ADDRESS',
            createdAt: new Date().toISOString(),
            bio: 'USER_BIO',
            userWebsite: 'USER_WEBSITE'
        }
    ],
    thoughts: [
        {
            body: 'THOUGHT_CONTENTS',
            userHandle: 'USERNAME',
            createdAt: new Date().toISOString(),
            likeCount: 24,
            commentCount: 4
        }
    ]
}

const userDetails = {
    credentials: {
        userId: 'USER_ID',
        userHandle: 'USERNAME',
        imageUrl: 'URL_LINK',
        email: 'USER_EMAIL_ADDRESS',
        createdAt: new Date().toISOString(),
        bio: 'USER_BIO',
        userWebsite: 'USER_WEBSITE'
    },
    notifications: [
        {
            recipient: 'USERNAME',
            sender: 'USERNAME',
            read: 'true / false',
            thoughtId: 'THOUGHT_ID',
            type: 'like / comment',
            createdAt: new Date().toISOString()
        }
    ],
    comments: [
        {
            userHandle: 'USERNAME',
            thoughtId: 'THOUGHT_ID',
            body: 'COMMENT_BODY',
            createdAt: new Date().toISOString()
        }
    ],
    likes: [
        {
            userHandle: 'USER',
            thoughtId: 'THOUGHT_ID'
        },
        {
            userHandle: 'USER',
            thoughtId: 'THOUGHT_ID'
        }
    ]
}