var Ctrl = require('./controllers/controller.js'),
	CardModel = require('./models/cardmodel.js'),
	SearchModel = require('./models/searchmodel.js'),
	Jade = require('jade'),
	MongoClient = require('mongodb').MongoClient, 
	assert = require('assert'),
	url = 'mongodb://localhost:27017/mtg_cards',
	// Make it easier to customize your database names by variablizing them.
	mtgDB = 'mtgcards',
	myCollection = 'mtg_collection'
 


module.exports = function (app) {
	app.get('/test', function(req, res){
		Ctrl.test(req, res);
	});
	app.get('/search', function(req, res){
		// TODO: Add Jade var for search form target
		var searchJadevars = {
			pagetitle: "Awesome Aesop",
			heading: "This is a smaller heading",
			youAreUsingJade: true
		}
		return res.render('views/searchview.jade', searchJadevars);
	});

	app.post('/card-request', function(req, res){

		var searchTerm = req.body.searchterm;

		MongoClient.connect(url, function(err, db) {
			SearchModel.findDocuments(db, {name: searchTerm}, 'mtgcards', function(err, results){
				return res.status(200).json(results);
			});
		});
		
	});

	app.post('/card-view', function(req, res){
		console.log(req.body);

		var searchTerm = req.body.searchterm;

		MongoClient.connect(url, function(err, db) {
			SearchModel.findDocuments(db, {name:  {'$regex': searchTerm}}, 'mtgcards', function(err, results){
				console.log('---------');
				var dumpCheck = false;
				var data = "words"; // JSON.stringify(results);

				var jadeVars = {};
				jadeVars.cardResults = [];

				for (var i = 0; i < results.length; i++){
					jadeVars.cardResults[i] = {
						uuid: results[i]._id,
						cardName: results[i].name,
						sets: results[i].printings,
						imgname: "http://mtgimage.com/card/"+results[i].imageName+".jpg",
					}
				}

				jadeVars.searchterm = searchTerm;
				jadeVars.dumpCheck = dumpCheck;
				jadeVars.dumpData = data;

				console.log(jadeVars);

				// TODO: Add Jade var for back to search button based on if is from collection search

				return res.render('views/searchreturn.jade', jadeVars);

			});
		});

		
	});

	app.post('/collection-save', function(req, res){

		var saveRequest = req.body;
		console.log(saveRequest);

		MongoClient.connect(url, function(err, db){

			SearchModel.findDocumentsById(db, saveRequest.uuid, 'mtgcards', function(err, results){
				if (!err){

					var dataToSave = results;
					dataToSave[0].ownedPrinting = saveRequest.set;
					dataToSave[0].numberOwned = saveRequest.qty;
					
					CardModel.saveData(db, dataToSave, 'mtg_collection', function(err, results){

						var savedJadevars = {
							pagetitle: "Awesome Aesop",
							heading: "Saved Data",
							youAreUsingJade: true
						}
						return res.render('views/searchview.jade', savedJadevars);
					})
				}
			});
		})
	});

	app.get('/search-collection', function(req, res){
		var searchJadevars = {
			pagetitle: "Awesome Aesop",
			heading: "This is a smaller heading",
			youAreUsingJade: true
		}
		return res.render('views/searchview.jade', searchJadevars);
	})

	app.post('/collection-update', function(req, res){
		console.log(req.body);

		MongoClient.connect(url, function(err, db){
			if (!err){
				CardModel.updateCollection(db, cardToUpdate, 'mtg_collection', function(err, results){
					// return something or render success message
				})
			}
		})

	})

	app.post('/dump', function(req, res){
		var thingy = JSON.stringify(req.body);
		return res.render('views/dump.jade', {dump: thingy});
	})

	app.get('/*', function(req, res) {
		return res.status(401).json({'success': false, 'err': 'Unauthorized'});
	});
};