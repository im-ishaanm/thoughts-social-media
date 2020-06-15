const { db } = require('../util/admin');
const { validateThought } = require('../util/validators');

exports.getThoughts = (req, res) => {
    db
        .collection('thoughts')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let thoughts = [];
            data.forEach(doc => {
                thoughts.push({
                    thoughtId: doc.id,
                    handle: doc.data().handle,
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    userImage: doc.data().userImage
                });
            })
            return res.json(thoughts);
        })
        .catch(err => console.error(err));
}

exports.postThought = (req, res) => {
    const thought = {
        handle: req.user.handle,
        body: req.body.body,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    }

    const { valid, errors } = validateThought(thought.body);

    if (!valid) return res.status(400).json(errors);

    db
        .collection('thoughts')
        .add(thought)
        .then(doc => {
            const returnThought = thought;
            returnThought.thoughtId = doc.id;
            res.json(returnThought);
        })
        .catch(err => {
            return res.status(500).json({ error: 'something went wrong..' })
        })
}

exports.getOneThought = (req, res) => {
    let thoughtData = {};
    db.doc(`/thoughts/${req.params.thoughtId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Thought not found.' });
            }
            thoughtData = doc.data();
            thoughtData.thoughtId = doc.id;
            return db.collection('comments')
                .orderBy('createdAt', 'desc')
                .where('thoughtId', '==', req.params.thoughtId)
                .get();
        })
        .then(data => {
            thoughtData.comments = [];
            data.forEach(doc => {
                thoughtData.comments.push(doc.data());
            });
            return res.json(thoughtData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
}

exports.postComment = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({ error: 'Comment cannot be empty.' });

    let newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        thoughtId: req.params.thoughtId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/thoughts/${req.params.thoughtId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Thought not found' });
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment)
        })
        .then(() => {
            res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong x_x' });
        })

}


exports.likeThought = (req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('thoughtId', '==', req.params.thoughtId)
        .limit(1);

    const thoughtDocument = db.doc(`/thoughts/${req.params.thoughtId}`);

    let thoughtData;

    thoughtDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                thoughtData = doc.data();
                thoughtData.thoughtId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Thought not found' });
            }
        })
        .then((data) => {
            if (data.empty) {
                return db
                    .collection('likes')
                    .add({
                        thoughtId: req.params.thoughtId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        thoughtData.likeCount++;
                        return thoughtDocument.update({ likeCount: thoughtData.likeCount });
                    })
                    .then(() => {
                        return res.json(thoughtData);
                    });
            } else {
                return res.status(400).json({ error: 'Thought already liked' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};


exports.unlikeThought = (req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('thoughtId', '==', req.params.thoughtId)
        .limit(1);

    const thoughtDocument = db.doc(`/thoughts/${req.params.thoughtId}`);

    let thoughtData;

    thoughtDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                thoughtData = doc.data();
                thoughtData.thoughtId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Thought not found' });
            }
        })
        .then((data) => {
            if (data.empty) {
                return res.status(400).json({ error: 'Thought not liked' });
            } else {
                return db
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        thoughtData.likeCount--;
                        return thoughtDocument.update({ likeCount: thoughtData.likeCount });
                    })
                    .then(() => {
                        res.json(thoughtData);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

exports.deleteThought = (req, res) => {
    const document = db.doc(`/thoughts/${req.params.thoughtId}`);
    document.get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Thought not found. ' });
            }
            if (doc.data().handle !== req.user.handle) {
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Thought deleted successfully.' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
}