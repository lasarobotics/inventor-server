// create our router
var express = require('express');
var router = express.Router();

var mongoose   = require('mongoose');
mongoose.connect('mongodb://lasa:inventor@ds049997.mongolab.com:49997/inventor'); // connect to our database
var Item     = require('../app/models/item');
// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to inventor' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/items')

	// create a item (accessed at POST http://localhost:8080/items)
	.post(function(req, res) {

		var item = new Item();		// create a new instance of the Item model
		item.name = req.body.name;  // set the item name (comes from the request)
    item.team = "none";
		item.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Item created!' });
		});


	})

	// get all the items (accessed at GET http://localhost:8080/api/items)
	.get(function(req, res) {
		Item.find(function(err, items) {
			if (err)
				res.send(err);

			res.json(items);
		});
	});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/items/:item_id')

	// get the item with that id
	.get(function(req, res) {
		Item.findById(req.params.item_id, function(err, item) {
			if (err)
				res.send(err);
			res.json(item);
		});
	})

	// update the item with this id
	.put(function(req, res) {
		Item.findById(req.params.item_id, function(err, item) {

			if (err)
				res.send(err);

			item.name = req.body.name;
			item.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Item updated!' });
			});

		});
	})

	// delete the item with this id
	.delete(function(req, res) {
		Item.remove({
			_id: req.params.item_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});
//Post checkout request
router.route('/items/:item_id/checkout').post(function(req, res) {
   Item.findById(req.params.item_id, function(err, item) {
      if (err)
        res.send(err);
      if( item.team == "none"){
        item.team = req.body.team;
        item.save(function(err) {
          if (err)
            res.send(err);

          res.json({ error: '0',message:"Item checked out!" });
        });
      }
      else{
        res.json({ error:'1', message: 'Item already checked out!' });
      }
    });
  });
router.route('/items/:item_id/checkin').get(function(req, res) {
   Item.findById(req.params.item_id, function(err, item) {
      if( item.team != "none"){
        item.team = "none";
        item.save(function(err) {
          if (err)
            res.send(err);

          res.json({ error: '0',message:"Item checked in!" });
        });
      }
      else{
        res.json({ error:'1', message: 'Item is not checked out!' });
      }

    });
  });
module.exports = router;
