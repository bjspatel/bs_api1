var Model			= require("../../models/db-model"),		//Load bookshelf database model
	LocalStrategy	= require("passport-local").Strategy,	//Load local strategy
	bcrypt			= require("bcrypt-nodejs");

module.exports = function (passport, req, res) {

	//serialize the user for the session
	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	//deserialize user from the session
	passport.deserializeUser(function (user, done) {
		done(null, user);
	});

	//define local signup strategy
	passport.use(
		"local-signup",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, email, password, done) {
				process.nextTick(function() {
					new Model.User({email: email})
					.fetch()
					.then(function(model) {
						if(model) {
							return done(null, false, {responseCode: 409, message: "The user '" + email + "' already exists."});
						} else {
							//create a new user
							if(req.body.userType == 1) {
								addBrokerUserWithDependencies(req, done);
							} else if(req.body.userType == 2) {
								addAgent(req, done);
							}
						}
					});
				});
			}
		)
	);

	function addBrokerUserWithDependencies(req, done) {
		if(req.body.companyName) {
			addCompany(req, done);
		} else {
			res.status(400).json({message: "'companyName' parameter not passed."});
		}
	}

	function addCompany(req, done) {
		var companyObject = {
			name: req.body.companyName
		};

		new Model.Company(companyObject)
		.fetch()
		.then(function(fetchedCompany) {
			if(!fetchedCompany) {
				companyObject.address_id = 1;
				new Model.Company(companyObject)
				.save()
				.then(function(savedCompany) {
					req.body.dbReferences = {};
					req.body.dbReferences.company_id = savedCompany.get("company_id");
					addBroker(req, done);
				})
				.catch(function(error) {
					done(null, false, {responseCode: 500, message: "Error while saving company."});
					console.trace("Error while saving company: " + JSON.stringify(error));
				});
			} else {
				req.body.dbReferences = {};
				req.body.dbReferences.company_id = fetchedCompany.get("company_id");
				addBroker(req, done);
			}
		});
	}

	function addBroker(req, done) {
		var newBroker = {
			first_name: req.body.firstName,
			last_name: req.body.lastName,
			email: req.body.email,
			company_id: req.body.dbReferences.company_id,
			billing_address_id: 1,
			credit_card_id: 1
		};

		new Model.Broker(newBroker)
		.save()
		.then(function(savedBroker) {
			req.body.dbReferences.reference_id = savedBroker.get("broker_id");
			addUser(req, res, done);
		})
		.catch(function(error) {
			done(null, false, {responseCode: 500, message: "Error while saving broker."});
			console.trace("Error while saving broker: " + JSON.stringify(error));
		});
	}

	function addUser(req, res, done) {
		var newUser = {
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password),
			type: req.body.userType,
			reference_id: req.body.dbReferences.reference_id
		}

		var signUpUser = new Model.User(newUser);
		signUpUser.save()	//save the user
		.then(function(savedUser) {
			return done(null, savedUser, {responseCode: 201, message: "User '" + savedUser.attributes.email + "' created successfullly."});
		})
		.catch(function(error) {
			done(null, false, {responseCode: 500, message: "Error while saving user."});
			console.trace("Error while saving user: " + JSON.stringify(error));
		});
	}

	//define local signin strategy
	passport.use(
		"local-signin",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, email, password, done) {
				new Model.User({email: email})
				.fetch()
				.then(function(data) {
					var user = data;
					if(!user) {
						//user does not exist
						return done(null, false, {responseCode: 404, message: "User '" + email + "' does not exist."});
					} else {
						user = data.toJSON();
						if(!bcrypt.compareSync(password, user.password)) {
							//user is found, but password is incorrect
							return done(null, false, {responseCode: 401, message: "Password is incorrect."});
						} else {
							//return found user
							return done(null, user, {responseCode: 200, message:"User '" + email + "' signed in successfully."});
						}
					}
				})
				.catch(function(error) {
					console.trace("Error while loading user: " + JSON.stringify(error));
				});
			}
		)
	);
};
