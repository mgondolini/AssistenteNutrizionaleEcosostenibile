var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Creates a new user
 */
exports.create_user = (req, res) => {
	var new_user = new User(req.body);
	new_user.save((err, user) => {
	  if (err){
		  console.log("Error while creating new user"); //DEBUG
		  res.send(err);
	  } 
	  console.log("user crated"+user)	//DEBUG
	  res.status(201).json(user);
	});
};


/**
 * Loads a given user
 */
exports.load_user = async (req, res) => {
	console.log("looking for user: "+req.params.username) //DEBUG
	var query = {username: req.params.username};

	await User.findOne(query)
	.exec()
	.then((user) => {
		if(user == null){
			res.status(404).send({description: 'User not found'});
			console.log("User " + req.params.username + " not found"); //DEBUG
		}else{
			res.status(200).json(user);
			console.log("Found user ->" + user.username); //DEBUG
		}	
	})
	.catch((err) => res.send(err));
};


/**
 * Updates a user
 */
exports.update_user = async (req, res) => {
	console.log("Update user: "+ req.params.username); //DEBUG

	var query = { 'username': req.params.username }; //forse da cambiare, passare nome utente
	var update = req.body; //passare il json utente coi campi aggiornati

	await User.findOneAndUpdate(query, update, {new: true})
	.exec()
	.then((user) => {
		if(user == null){
			res.status(404).send({description: 'User not found'});
			console.log("User" + req.params.username + "not found"); //DEBUG
		}
		else{
			res.json(user);
			console.log("user updated"); //DEBUG
		}
	})
	.catch((err) => res.send(err));
};


/**
 * Deletes a user
 */
exports.delete_user = async (req, res) => {

	console.log("Deleting user: "+req.params.username); //DEBUG
	var query = { 'username' : req.params.username };
	
	await User.deleteOne(query)
	.exec()
	.then((user) => {
		if(user == null){
			res.status(404).send({description: 'User not found'});
			console.log("user not found"); //DEBUG
		}
		else{
			res.json({ message: 'User successfully deleted' });
			console.log("User deleted"); //DEBUG
		}
	})
	.catch((err) => res.send(err));
};