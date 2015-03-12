module.exports = {
	saveData: function(db, data, collectionToSave, callback){

		var collection = db.collection(collectionToSave);
		var key = "_id";
		delete data[0][key];
		console.log('Save Data:');
		console.log(data);
		console.log('~~~~~~~/~^*()*^~/~~~~~~~~')

		collection.insert(data, function(err, result){
			callback(err, result);
		});

	},

	updateCollection: function(db, cardID, cardData, collectionToSearch, callback){
		var collection = db.collection(collectionToSearch);
		collection.update(
			{"_id" : cardID},
			{
				$set: {}
			}, 
			function(err, result){
				if(err){
					console.log('~~~~~~~~~~~~~~')
					console.log('Update Error:')
					console.log(err)
					console.log('~~~~~~~~~~~~~~')
				}
				callback(result)
			}
		)
	}
}