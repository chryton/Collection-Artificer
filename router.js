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

		var searchJadevars = {
			pagetitle: "Awesome Aesop",
			collectionSearched: mtgDB,
			backBtn: '/search'
		}
		return res.render('views/searchview.jade', searchJadevars);
	});

	app.get('/search-collection', function(req, res){
		var searchJadevars = {
			pagetitle: "Awesome Aesop",
			collectionSearched: myCollection,
			backBtn: '/search-collection'
		}
		return res.render('views/searchview.jade', searchJadevars);
	})

	app.post('/card-request', function(req, res){

		var searchTerm = req.body.searchterm,
			collectionSearched = req.body.collection;


		MongoClient.connect(url, function(err, db) {
			SearchModel.findDocuments(db, {name: searchTerm}, collectionSearched, function(err, results){
				return res.status(200).json(results);
			});
		});
		
	});

	app.post('/card-view', function(req, res){
		console.log(req.body);

		var searchTerm = req.body.searchterm,
			collectionSearched = req.body.collection;

		MongoClient.connect(url, function(err, db) {
			SearchModel.findDocuments(db, {name:  {'$regex': searchTerm}}, collectionSearched, function(err, results){
				console.log('---------');
				var dumpCheck = false,
					data = "words", // JSON.stringify(results);
					jadeVars = {};
				
				jadeVars.cardResults = [];

				for (var i = 0; i < results.length; i++){
					jadeVars.cardResults[i] = {
						uuid: results[i]._id,
						cardName: results[i].name,
						sets: results[i].printings || results[i].ownedPrinting
					}
				}

				// Set Back Button link
				if (collectionSearched == myCollection){

					jadeVars.backBtn = '/search-collection';
					jadeVars.searchTarget = '/collection-update';

				}else if(collectionSearched == mtgDB){

					jadeVars.backBtn = '/search';
					jadeVars.searchTarget = '/collection-save';

				}else{

					jadeVars.backBtn = '/';

				}

				jadeVars.searchterm = searchTerm;
				jadeVars.dumpCheck = dumpCheck;
				jadeVars.dumpData = data;

				return res.render('views/searchreturn.jade', jadeVars);

			});
		});

		
	});

	app.post('/collection-save', function(req, res){

		var saveRequest = req.body;
		console.log(saveRequest);

		MongoClient.connect(url, function(err, db){

			SearchModel.findDocumentsById(db, saveRequest.uuid, mtgDB, function(err, results){
				if (!err){

					var dataToSave = results;
					dataToSave[0].ownedPrinting = saveRequest.set;
					dataToSave[0].numberOwned = saveRequest.qty;
					
					CardModel.saveData(db, dataToSave, myCollection, function(err, results){

						var jadeVars = {
							pagetitle: "Welcome to Card Artificer",
							heading: "Card Saved!",
						}
						return res.render('views/welcome.jade', jadeVars);
					})
				}
			});
		})
	});

	app.post('/collection-update', function(req, res){
		console.log(req.body);

		MongoClient.connect(url, function(err, db){
			if (!err){
				CardModel.updateCollection(db, cardToUpdate, myCollection, function(err, results){
					// Add results rendering rules
				})
			}
		})

	});

	app.get('/view-collection', function(req, res){
		console.log('Time to see all the cards in my collection');
		MongoClient.connect(url, function(err, db){
			if(!err){
				CardModel.viewAllCards(db, myCollection, function(err, results){
					if (!err){
						var cardsInCollection = results,
							jadeVars = {
								cards: cardsInCollection,
								pagetitle: 'Cards in your collection'
							}
						return res.render('views/collectionview.jade', jadeVars);
					}
				});
			}
		})
	})

	app.post('/dump', function(req, res){
		var thingy = JSON.stringify(req.body);
		return res.render('views/dump.jade', {dump: thingy});
	})

	app.get('/*', function(req, res) {
		return res.render('views/welcome.jade')
	});
};