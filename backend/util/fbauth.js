const { db, admin } = require('./admin');
// Authentication Middleware

module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('bearer ')) {
        idToken = req.headers.authorization.split('bearer ')[1];
    } else return res.status(403).json({ error: 'unauthorized' });
    admin.auth().verifyIdToken(idToken)
        .then(decodedIdToken => {
            req.user = decodedIdToken;

            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.handle = data.docs[0].data().userHandle;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch(err => {
            console.error(err);
            return res.status(400).json({ error: err.code });
        })
}