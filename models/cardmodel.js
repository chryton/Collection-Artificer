module.exports = {
	saveData: function(db, data, collectionToSave, callback){

		var collection = db.collection(collectionToSave),
			removeKey = ['_id', 'printings', 'rulings', 'foreignNames', 'imageName'];

		for (var i = 0; i < removeKey.length; i++){
			delete data[0][removeKey[i]];
		}

		console.log('Data saving...');

		collection.insert(data, function(err, result){
			callback(err, result);
		});

		console.log('Data saved!');

	},

	updateCollection: function(db, cardID, cardData, collectionToSearch, callback){
		var collection = db.collection(collectionToSearch);

		var ObjectID = require('mongodb').ObjectID;
		var cardID = new ObjectID(cardID);


		if (cardData > 0){
			console.log('Updating data...')
			collection.update(
				{"_id" : cardID},
				{
					$set: {
						numberOwned: cardData
					}
				}, 
				function(err, result){
					if(err){
						console.log('~~~~~~~~~~~~~~');
						console.log('Update Error:');
						console.log(err);
						console.log('~~~~~~~~~~~~~~');
					}
					callback(err, result);
				}
			)
		}else{
			console.log('Deleting Data...')
			collection.remove({"_id": cardID}, function(err, result){
				if(!err){
					console.log('~~~~~~~~~~~~~~');
					console.log('Remove Error:');
					console.log(err);
					console.log('~~~~~~~~~~~~~~');
				}
				callback(err, result);
			})
		}
	},

	viewAllCards: function(db, collectionToSearch, callback){
		var collection = db.collection(collectionToSearch);
		collection.find({}).sort({'name': 1}).toArray(function(err, results){
			if (!err){
				callback(err, results);
			}else{
				console.log('*****************************');
				console.log('*****************************');
				console.log('There was an error with viewing all cards:');
				console.log(err);
			}
		})
	}
}