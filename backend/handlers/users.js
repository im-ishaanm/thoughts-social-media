const { validateSignUp, validateLogin, validateUserDetails } = require('../util/validators');
const { db, admin } = require('../util/admin');
const firebaseConfig = require('../util/config');
const firebase = require('firebase');



firebase.initializeApp(firebaseConfig);



exports.signUp = (req, res) => {
    const User = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userHandle: req.body.userHandle
    };

    const { valid, errors } = validateSignUp(User);

    if (!valid) return res.status(400).json(errors);

    const noImage = 'no-img.png';

    // Signing up
    let userToken, userId;
    db.doc(`/users/${User.userHandle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ userHandle: 'this username is already taken.' });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(User.email, User.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            userToken = token;
            const userCredentials = {
                userHandle: User.userHandle,
                email: User.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImage}?alt=media`,
                userId
            };
            return db.doc(`/users/${User.userHandle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ userToken });
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                res.status(400).json({ email: 'Email is already in use.' });
            } else {
                res.status(500).json({ general: 'Something went wrong. Please try again.' });
            }
        })
};

exports.login = (req, res) => {
    const User = {
        email: req.body.email,
        password: req.body.password
    }

    const { errors, valid } = validateLogin(User);

    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(User.email, User.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(userToken => {
            return res.json({ userToken });
        })
        .catch(err => {
            return res.status(403).json({ general: 'Incorrect credentials. Please try again.' })
        })
};

exports.addDetails = (req, res) => {
    let Details = validateUserDetails(req.body);

    console.log(Details);

    db.doc(`/users/${req.user.handle}`).update(Details)
        .then(() => {
            return res.json({ message: 'Details updated successfully! ' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

exports.getOtherUserData = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.user = doc.data();
                return db.collection('thoughts').where('handle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get();
            } else {
                return res.status(404).json({ error: 'User not found.' });
            }
        })
        .then(data => {
            userData.thoughts = [];
            data.forEach(doc => {
                userData.thoughts.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    handle: doc.data().handle,
                    thoughtId: doc.id
                })
            })
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}


exports.getUserData = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle', '==', req.user.handle).get()
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('notifications').where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc').limit(10).get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    read: doc.data().read,
                    createdAt: doc.data().createdAt,
                    thoughtId: doc.data().thoughtId,
                    type: doc.data().type,
                    notificationId: doc.id
                })
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
}


exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageName;
    let imageUpload = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'File type cannot be submitted. ' });
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1];

        imageName = `${Math.round(Math.random() * 100000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageName);

        imageUpload = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageUpload.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageUpload.mimetype
                }
            }
        })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageName}?alt=media`;
                return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: 'Image uploaded successfully! ' });
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: err.code });
            })
    })
    busboy.end(req.rawBody);
}

exports.markNotifRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    })
    batch.commit()
        .then(() => {
            return res.json({ message: 'Notifications marked as read' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}