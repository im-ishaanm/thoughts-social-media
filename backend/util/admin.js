const admin = require('firebase-admin');
const express = require('express');

const serviceAccount = require('./serviceAcc.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://thoughts-17ad7.firebaseio.com",
    storageBucket: "gs://thoughts-17ad7.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db, express }