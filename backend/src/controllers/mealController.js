var mongoose = require('mongoose');
var Meal = mongoose.model('Meals');

// TODO
exports.load_meals_list = function(req, res){
	console.log("Looking for meals: ") //DEBUG
	var query = {username: req.params.username}
	
	Meal.find(query, function(err, meals) {
		if (err){
			console.log("error while loading meals list"); //DEBUG
			res.send(err);
		}else{
			//TODO: migliorare gestione errori
			if(meals==null){
				res.status(404).send({description: 'meals list not found'});
				console.log("meals list not found"); //DEBUG
			}else{
				res.json(meals);
				console.log("meals list found ->"+meals.meals); //DEBUG
			}	
		}	
	});
};

// TODO
exports.create_meal = function(req, res) {
	console.log("nuovo pasto:"+req.body);
	var new_meal = new Meal(req.body);
	new_meal.save(function(err, meal) {
	  if (err){
		  console.log("error while creating new meal"); //DEBUG
		  res.send(err);
	  } 
	  console.log("meal created"+meal)	//DEBUG
	  res.status(201).json(meal);
	});
};

// TODO
exports.load_meal = function(req, res){
	console.log("looking for meal: "+req.params.meal_num) //DEBUG
    var query = {username: req.params.username};
    var projection = {meals:{$elemMatch: {meal_name: req.params.meal_name}}}

	Meal.findOne(query, projection, function(err, meal) {
		if (err){
			console.log("error while loading meal"); //DEBUG
			res.send(err);
		}else{
			if(meal==null){
				res.status(404).send({description: 'meal not found'});
				console.log("meal not found"); //DEBUG
			}else{
				res.json(meal);
				console.log("found meal ->"+meal.meal_num); //DEBUG
			}	
		}	
	});
};

// TODO
exports.update_meal = function(req, res){
	console.log("update user: "+ req.params.username);
	var query = {username: req.params.username}; 
	var update = req.body; //passare il json di un componenente del pasto da appendere
	//quando ha successo faccio l'update dei valori totali calcolati

	Meal.findOneAndUpdate(query, update, {new: true}, function(err, meal) {
		if (err){
			res.send(err);
			console.log("error while updating meal"); //DEBUG
		}else{
			if(meal==null){
				res.status(404).send({description: 'meal not found'});
				console.log("meal not found"); //DEBUG
			}
			else{
				res.json(meal);
				console.log("meal updated"); //DEBUG
			}
		}
	});
};
