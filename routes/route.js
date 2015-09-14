// create our router
var express = require('express');
var router = express.Router();

var mongoose   = require('mongoose');
var mongo_address = process.env.MONGO_SERVER;
mongoose.connect(mongo_address); // connect to our database
var Item     = require('../app/models/item');
var _ = require('underscore');
// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to inventor' });
});

// on routes that end in /item
// ----------------------------------------------------
router.route('/items')

	// create a item (accessed at POST http://localhost:8080/items)
	.post(function(req, res) {
		if(req.body.name){
			var item = new Item();		// create a new instance of the Item model
			item.name = req.body.name;  // set the item name (comes from the request)
			item.quantity = 1;
			if(req.body.quantity){
				item.quantity = req.body.quantity;
			}
			console.log(item);
			item.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Item created!' });
			});
		}
		else{
			res.json({ error:'1', message: 'Incorrect parameters' });
		}


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
				if (req.body.team && req.body.quantity && !isNaN(parseInt(req.body.quantity))){
					var quantity = parseInt(req.body.quantity);
					if (quantity < item.quantity && quantity > 0){
						item.quantity = item.quantity - quantity;
						if (item.checkout){
							var teamexists = false;
							for (var i = 0; i < item.checkout.length;i++){
								if (item.checkout[i].team === req.body.team){
									 item.checkout[i].quantity = item.checkout[i].quantity + quantity;
									 teamexists = true;
									 console.log(item.checkout[i]);
								}
							}
							if (!teamexists){
								item.checkout.push({"team":req.body.team,"quantity":quantity});
							}
						}
						else{
							item.checkout = [{"team":req.body.team,"quantity":quantity}]
						}
						item.markModified('checkout');
						item.save(function(err) {
							if (err)
								res.send(err);

							res.json({ error: '0',message:"Item checked out!" });
						});
					}
					else{
						res.json({ error:'100', message: 'Invalid quantity requested!' });
					}
				}
				else{
					res.json({ error:'1', message: 'Incorrect parameters' });
				}
    });
  });
router.route('/items/:item_id/checkin').get(function(req, res) {
   Item.findById(req.params.item_id, function(err, item) {
      if( item.team ){
        delete item.team;
				console.log(item);
        item.save(function(err) {
          if (err)
            res.send(err);

          res.json({ error: '0',message:"Item checked in!" });
        });
      }
      else{
        res.json({ error:'2', message: 'Item is not checked out!' });
      }

    });
  });


// on routes that end in /teams
// ----------------------------------------------------
router.route('/teams')
.get(function (req,res){
	Item.find().distinct('team', function(err, teams) {
		if (err)
			res.send(err);
		res.json(teams);
	});
});
module.exports = router;
