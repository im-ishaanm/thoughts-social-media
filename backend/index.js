const functions = require('firebase-functions');

const FBAuth = require('./util/fbauth');

const cors = require('cors');

const { db, express } = require('./util/admin');

const app = express();
app.use(cors());

const { getThoughts,
    postThought,
    getOneThought,
    postComment,
    likeThought,
    unlikeThought,
    deleteThought,
} = require('./handlers/thoughts');

const { signUp,
    login,
    uploadImage,
    addDetails,
    getUserData,
    getOtherUserData,
    markNotifRead
} = require('./handlers/users');


// Get all thoughts
app.get('/thoughts', getThoughts);
// Post a thought
app.post('/postthought', FBAuth, postThought);
// Get a particular thought's data
app.get('/thought/:thoughtId', getOneThought);
// Post a comment for a thought
app.post('/thought/:thoughtId/comment', FBAuth, postComment);
// Like a thought
app.get('/thought/:thoughtId/like', FBAuth, likeThought);
// Unlike a thought
app.get('/thought/:thoughtId/unlike', FBAuth, unlikeThought);
// Delete a thought
app.delete('/thought/:thoughtId', FBAuth, deleteThought)


// Sign up user.
app.post('/signup', signUp);
// Login user
app.post('/login', login);
// Upload image
app.post('/user/image', FBAuth, uploadImage);
// Add User details
app.post('/user/details', FBAuth, addDetails);
// Get User details
app.get('/user', FBAuth, getUserData);
// Get Other User's details
app.get('/user/:handle', getOtherUserData);
// Mark Notifactions
app.post('/notifications', FBAuth, markNotifRead);

exports.api = functions.region('asia-east2').https.onRequest(app);

exports.makeNotifOnLike = functions.region('asia-east2').firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/thoughts/${snapshot.data().thoughtId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().handle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().handle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        thoughtId: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
            })
    });

exports.deleteNotifOnUnlike = functions.region('asia-east2').firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => {
                console.error(err);
            });
    })


exports.makeNotifOnComment = functions.region('asia-east2').firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/thoughts/${snapshot.data().thoughtId}`).get()
            .then(doc => {
                if (doc.exists && doc.data().handle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().handle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        thoughtId: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
            })
    });

exports.onImageChangeUser = functions.region('asia-east2').firestore.document('/users/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            console.log('Image has changed');
            const batch = db.batch();
            return db.collection('thoughts').where('handle', '==', change.before.data().userHandle).get()
                .then((data) => {
                    data.forEach(doc => {
                        let thought = db.doc(`/thoughts/${doc.id}`);
                        batch.update(thought, { userImage: change.after.data().imageUrl });
                    });
                    return batch.commit();
                })
        } else return true;
    });

exports.onThoughtDelete = functions.region('asia-east2').firestore.document('/thoughts/{thoughtId}')
    .onDelete((snapshot, context) => {
        const thoughtId = context.params.thoughtId;
        const batch = db.batch();
        return db.collection('comments').where('thoughtId', '==', thoughtId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('thoughtId', '==', thoughtId).get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('thoughtId', '==', thoughtId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err => console.error(err));
    })