var express = require('express');
var router = express.Router();
var urlmn = require('url');

var fs = require("fs");

var datas  = [
  {
    idNumb: 0,
    username: 'david',
    permissions: 'admin'
  },{
    idNumb: 1,
    username: 'meir',
    permissions: 'admin'
  },{
    idNumb: 2,
    username: 'qwert',
    permissions: 'admin'
  },{
    idNumb: 3,
    username: 'voisespin',
    permissions: 'admin'
  },{
    idNumb: 4,
    username: 'romi',
    permissions: 'admin'
  },{
    idNumb: 5,
    username: 'amin',
    permissions: 'admin'
  },{
    idNumb: 6,
    username: 'ttt',
    permissions: 'admin'
  },{
    idNumb: 7,
    username: 'aaa',
    permissions: 'admin'
  }
];

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/';

MongoClient.connect(url, function(err, db) {
  var collectionUsers = db.collection('users');
  collectionUsers.remove({}); // clear database

  for(var d = 0; d < datas.length; d++) {  // set items from 'datas' object to the database
    collectionUsers.save(datas[d]);
  }

});

/* GET users listing. */
router.get('/', function(req, res, next) {

  var query = urlmn.parse(req.url, true);

  if(query.query.data) {
    var datareq = JSON.parse(query.query.data); // definition properties from the client on XHR

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collectionUsers = db.collection('users');

      if(datareq.type == 'update') { // rewrite item in DB

        if(datareq.username) {
          collectionUsers.update({idNumb: datareq.idNumb}, {$set: {username: datareq.username}})
        } else if (datareq.permissions) {
          collectionUsers.update({idNumb: datareq.idNumb}, {$set: {permissions: datareq.permissions}})
        }

        res.send('success');

      } else if(datareq.type == 'delete') { // delete item from DB

        collectionUsers.remove({idNumb: datareq.idNumb});

        res.send('success');

      } else if(datareq.type == 'add')  { // add new item

        collectionUsers.find({}).toArray(function(err, docs){
          var newData = {idNumb: docs.length, username: 'Enter name', permissions: 'user'};

          collectionUsers.save(newData);

          res.send(JSON.stringify(newData));
        });
      }
    });

  } else { // if this non ajax request - render page from index.jade

    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);

      var collectionUsers = db.collection('users');

      collectionUsers.find({}).toArray(function(err, docs){
        res.send(JSON.stringify(docs));
      });

    });
  }



});


module.exports = router;
