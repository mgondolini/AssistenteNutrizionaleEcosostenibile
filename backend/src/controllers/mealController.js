var mongoose = require('mongoose');
var Meal = mongoose.model('Meals');

//TODO: migliorare gestione errori nelle callback

/**
 * Loads all the meals for a given user
 */
exports.load_meals_list = (req, res) => {
	console.log("looking for meal...") //DEBUG
	console.log(req.query); //DEBUG

	var query = req.query;

	Meal.find(query, function(err, userMeals) {
		if (err){
			console.log("error while loading meal"); //DEBUG
			res.send(err);
		}else{
			if(userMeals==null){
				res.status(404).send({description: 'meal not found'});
				console.log("meal not found"); //DEBUG
			}else{
				res.json(userMeals[0]);
				console.log("found meals list->"+userMeals); //DEBUG
			}	
		}	
	});
};


/**
 * Loads a specific meal of a user
 */
exports.load_meal = (req, res) => {
	console.log("looking for meal to load...") //DEBUG

	var query = {'username': req.query.username};
	var projection = {"meals": {$elemMatch: {'meal_name': req.query.mealName}}}

	Meal.find(query, projection, function(err, meal) {
		if (err){
			console.log("error while loading meal"); //DEBUG
			res.send(err);
		}else{
			if(meal==null){ //migliorare il controllo
				res.status(404).send({description: 'meal not found'});
				console.log("meal not found"); //DEBUG
			}else{
				res.json(meal);
				console.log("found meal ->"+meal); //DEBUG
			}	
		}	
	});
};


// Controllo se il documento relativo all'utente esiste, 
// se non c'è creo il nuovo update_meal, altrimenti lo aggiungo
// TODO: gestione delle result 

/**
 * Inserts a new meal for a given user
 */
exports.new_meal = (req, res) => {
	var query = {'username': req.body.username};

	console.log(JSON.stringify(query)); // DEBUG
	Meal.find(query, function(err, userMeals) {
		if (err) res.send(err);
		else{
			if(userMeals.length == 0){
				create_first_meal(req, res);
				console.log("meal not found - insterting"); //DEBUG
			}else{
				add_meal(req, userMeals, res);// aggiungo in coda il update_meal
				// res.send(userMeals)
				console.log("meal already found ->"+userMeals); //DEBUG
			}	
		}	
	});
};

/**
 * Creates the first meal of a user
 * @param {*} req 
 * @param {*} res 
 */
 create_first_meal = (req, res) => {
	var new_meal = new Meal(req.body);
	new_meal.save(function(err, meal) { 
		if (err){
			console.log("error while creating new meal"); //DEBUG
			res.send(err);
		} 
		console.log("meal created"+meal);	//DEBUG
		res.status(201).json(meal);
	});	
}

/**
 * Adds meals to a user's meals list
 * @param {*} req 
 * @param {*} userMeals 
 * @param {*} res 
 */
add_meal = (req, userMeals, res) =>{

	//TODO: GESTIONE RES, CONTROLLO SE ESISTE GIà UN update_meal CON LO STESSO NOME (OPPURE usare un id per evitarlo)
	var meal_to_add = req.body.meals; 

	var update_meal = new Meal(userMeals[0]);
	update_meal.meals.push(meal_to_add);

	console.log("update_meal"+update_meal+"---"+meal_to_add); //DEBUG

	update_meal.save(function(err, meal){
		if (err){
			console.log("error while updating new meal"); //DEBUG
			res.send(err);
		} 
		console.log("meal updated -> "+meal);	//DEBUG
		res.status(201).json(meal);
	});	
}

/**
 * Creates a component for an existing meal
 */
exports.new_component = async (req, res) => {

	var query = {'username': req.body.username, 'meals.meal_name': req.body.mealName};
	 
	await Meal.findOne(query)
	.exec()
    .then((doc) => {
        doc.meals[0].components.push(req.body.components);
        doc.save((err) => { if (err) throw err; });
		res.send(doc);
		//update delle calorie tot ecc
    })
    .catch((err) => res.send(err));
}


