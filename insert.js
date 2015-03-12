var mongo = require('mongodb');
var mtgJson = require('./seeds/others/AllCards-X2.json');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


var insertDocuments = function(db, data, callback) {
	// Get the documents collection
	var collection = db.collection('mtgcards');
	// Insert some documents
	console.log(data.size);
	for (var key in data){

		// console.log(key);

		collection.insert(data[key], function(err, result) {
		  console.log(err);
		  callback(result);
		});
	}
}


// Connection URL
var url = 'mongodb://localhost:27017/mtg_cards';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	// db.createCollection("mtgcards");
	// db.createCollection("myMTGLibrary");

	insertDocuments(db, mtgJson, function(){
		db.close();
	});

});