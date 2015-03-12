module.exports = {
	findDocuments: function(db, searchTerms, collectionToSearch, callback) {

	  // Get the documents collection
	  var collection = db.collection(collectionToSearch);

	  console.log("~~~~~~~~~~~~")
	  console.log(searchTerms);
	  console.log("~~~~~~~~~~~~")

	  // Find some documents
	  collection.find(searchTerms).toArray(function(err, docs) {

	    console.log("Found the following records");
	    console.dir(docs);

		callback(err, docs);

	  }); 
	},

	findDocumentsById: function(db, cardId, collectionToSearch, callback){
		var collection = db.collection(collectionToSearch);

		var ObjectID = require('mongodb').ObjectID;
		var cardID = new ObjectID(cardId)

		collection.find({'_id': cardID}).toArray(function(err, docs) {

		    console.log("Found the following records");
		    console.dir(docs);

			callback(err, docs);

	  })
	}
}