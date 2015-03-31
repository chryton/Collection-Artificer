module.exports = {
	saveData: function(db, data, collectionToSave, callback){

		var collection = db.collection(collectionToSave),
			removeKey = ['_id', 'printings', 'rulings', 'foreignNames', 'imageName'];

		for (var i = 0; i < removeKey.length; i++){
			delete data[0][removeKey[i]];
		}

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