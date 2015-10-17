module.exports = function(express, app, passport) {
	var config = require("../../config/development"),
        restController = require("../controllers/rest/rest-controller")(passport);
		awsController = require("../controllers/aws/aws-controller");
		router = express.Router();

    //Signup page
	router.get("/signup", function(req, res) {
		res.render("signup", {title: "Web-Clasroom Signup", message: req.flash("signupMessage")});
	});
	//Process Signup form
	router.post("/signup", passport.authenticate('local-signup', {
		successRedirect: '/signin',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	//Home page
	router.get("/", function(req, res) {
		res.redirect("/signin");
	});

	//Process rest routes
	router.post("/api/v1/signin", restController.authentication.signin);
    router.post("/api/v1/signup", restController.authentication.signup);

    router.get("/api/v1/user", restController.user.sendUserData);
	router.get("/api/v1/user/:id", restController.user.sendUserData);
	router.put("/api/v1/user/:id", restController.user.updateUserData);

    router.get("/api/v1/company", restController.company.sendCompanyData);
	router.get("/api/v1/company/:id", restController.company.sendCompanyData);
	router.put("/api/v1/company/:id", restController.company.updateCompanyData);

    router.get("/api/v1/company/:id/broker", restController.broker.sendBrokerData);
    router.get("/api/v1/broker/:id", restController.broker.sendBrokerData);

	router.get("/api/v1/company/:id/agent", restController.agent.sendAgentData);
    router.get("/api/v1/agent/:id", restController.agent.sendAgentData);
	router.post("/api/v1/agent", restController.agent.inviteAgent);

	router.get("/api/v1/onboardingPlan", restController.onboardingplan.sendOnboardingPlanData);
	router.get("/api/v1/onboardingPlan/:id", restController.onboardingplan.sendOnboardingPlanData);

	router.post("/upload", awsController.uploadFile);

	app.use(router);
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/signin");
	}
}
