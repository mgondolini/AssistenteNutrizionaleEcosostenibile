var mongoose = require('mongoose');
var Meal = mongoose.model('Meals');

//TODO: migliorare gestione errori nelle callback

exports.load_meals_list = function(req, res){
	console.log("looking for meal...") //DEBUG

	console.log(JSON.stringify(req.params.name)) //DEBUG
	console.log(JSON.stringify(req.body.username)) //DEBUG

	var query = req.body.username;
	// var query = {'username':'asd'}; //così funziona, req.body è vuoto

	Meal.find(query, function(err, meals) {
		if (err){
			console.log("error while loading meal"); //DEBUG
			res.send(err);
		}else{
			if(meals==null){
				res.status(404).send({description: 'meal not found'});
				console.log("meal not found"); //DEBUG
			}else{
				res.json(meals);
				console.log("found meal list->"+meals); //DEBUG
			}	
		}	
	});
};


// TODO: QUESTO FUNZIONA SOLO PER IL PRIMO PASTO DI UN UTENTE! 
// Controllare se il documento relativo all'utente esiste, 
// se non c'è creo il nuovo pasto, altrimenti devo chiamare una funzione di update
exports.new_meal = function(req, res) {
	var query = {'username': req.body.username};
	var meal = {'meals:': req.body.meals};

	console.log(query+"--"+meal);
	Meal.find(query, function(err, userMeals) {
		if (err) res.send(err);
		else{
			if(userMeals==null){
				this.create_meal(req, res);
				console.log("meal not found - insterting"); //DEBUG
			}else{
				// aggiungo in coda il pasto
				res.json(userMeals);
				// this.add_meal(meal, userMeals, res);
				console.log("meal already found ->"+userMeals); //DEBUG
			}	
		}	
	});

};

exports.create_meal = function(req, res) {
	var new_meal = new Meal(req.body);
	new_meal.save(function(err, meal) { //vedere le differenze con insertOne per id
		if (err){
			console.log("error while creating new meal"); //DEBUG
			res.send(err);
		} 
		console.log("meal created"+meal);	//DEBUG
		res.status(201).json(meal);
	});	
}

exports.add_meal = function(meal, userMeals, res) {
	var query = userMeals
	var meal_to_add = meal//parsing in modo da pigliare solo meals
	var projection = {$push: {"meals": meal_to_add}}

	// Sets `name` and unsets all other properties
	// userMeals.overwrite(projection);
	// userMeals.save();
	Meal.updateOne(query, projection, function(err, meals) {
		if (err){
			console.log("error while updating meals list"); //DEBUG
			res.send(err);
		}else{
			if(meals==null){
				res.status(404).send({description: 'meals updating not found'});
				console.log("meals updating not found"); //DEBUG
			}else{
				res.json(meals);
				console.log("meals updating found ->"+meals); //DEBUG
			}	
		}	
	});
}


// TODO update solo della quantità di un componente di un prodotto

exports.load_meal = function(req, res){
	console.log("looking for meal...") //DEBUG

	console.log(JSON.stringify(req.params.name)) //DEBUG
	console.log(JSON.stringify(req.body)) //DEBUG

	var query = req.body
	var projection = {"meals": {$elemMatch: {'meal_name': req.params.name}}}

	Meal.find(query, projection, function(err, meal) {
		if (err){
			console.log("error while loading meal"); //DEBUG
			res.send(err);
		}else{
			if(meal==null){
				res.status(404).send({description: 'meal not found'});
				console.log("meal not found"); //DEBUG
			}else{
				res.json(meal);
				console.log("found meal ->"+meal); //DEBUG
			}	
		}	
	});
};


// exports.update_meal = function(req, res){
// 	console.log("update meal: "+ req.params.username);
// 	var query = {username: req.params.username}; 
// 	var update = req.body; //passare il json di un componenente del pasto da appendere
// 	//quando ha successo faccio l'update dei valori totali calcolati

// 	Meal.findOneAndUpdate(query, update, {new: true}, function(err, meal) {
// 		if (err){
// 			res.send(err);
// 			console.log("error while updating meal"); //DEBUG
// 		}else{
// 			if(meal==null){
// 				res.status(404).send({description: 'meal not found'});
// 				console.log("meal not found"); //DEBUG
// 			}
// 			else{
// 				res.json(meal);
// 				console.log("meal updated"); //DEBUG
// 			}
// 		}
// 	});
// };
