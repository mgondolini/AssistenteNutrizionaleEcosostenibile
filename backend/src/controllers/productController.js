var mongoose = require('mongoose');
var Product = mongoose.model('Product');

exports.load_product = function(req, res){
	console.log("Looking for barcode: " + req.params.barcode + "...") //DEBUG
	var query = {code: req.params.barcode}
	
	Product.findOne(query, function(err, product) {
		if (err){
			console.log("error while loading product"); //DEBUG
			res.send(err);
		}else{
			//TODO: migliorare gestione errori
			if(product==null){
				res.status(404).send({description: 'product not found'});
				console.log("product not found"); //DEBUG
			}else{
				res.json(product);
				console.log("product found ->"+product.barcode); //DEBUG
			}	
		}	
	});
};