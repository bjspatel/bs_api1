var Model       = require("./app/models/db-model"),	//Load bookshelf model
    util        = require("./app/controllers/db/db-worker"),
    database 	= require('./app/database/db'),
    Promise     = require("bluebird"),
    bookshelf 	= database.bookshelf,
    request     = {
        body: {
            companyName: "BrokerSumo",
            userEmail: "brijesh2@brokersumo.com",
            userType: 1,
            userPassword: "My Password2",
            brokerFName: "Brijesh2",
            brokerLName: "Patel2"
        }
    };

var restUtil = require("./app/controllers/rest/rest-util");

var Address         = require("./app/controllers/db/address-controller"),
    Company         = require("./app/controllers/db/company-controller"),
    Broker          = require("./app/controllers/db/broker-controller"),
    User            = require("./app/controllers/db/user-controller"),
    Agent           = require("./app/controllers/db/agent-controller"),
    OnboardingPlan  = require("./app/controllers/db/onboarding_plan-controller");

var companyAddress  = new Address(request, "company.address"),
    brokerAddress   = new Address(request, "broker.address"),
    agentAddress    = new Address(request, "agent.address"),
    onboardingPlan  = new OnboardingPlan(request, "onboarding_plan"),
    company         = new Company(request, "company"),
    broker          = new Broker(request, "broker"),
    user            = new User(request, "user"),
    agent           = new Agent(request, "agent");

function signup(t) {
    console.log("signUp [STARTED]");
    return company.addCompany(null, t)
        .spread(broker.addBroker)
        .spread(user.addUser)
        .then(t.commit)
        .tap(function() {
            console.log("signup [COMPLETED]");
        });
};

function putBroker(t) {
    console.log("putBroker [STARTED]");

    request.body.companyAddress = "My Address1";
    request.body.companyCity = "Ahmedabad1";
    request.body.companyZipCode = "3800541";
    request.body.companyCountry = "India1";
    request.body.companyStateProv = "Gujarat1";
    request.body.brokerAddress = "Broker Address2";
    request.body.brokerCity = "Broker Ahmedabad2";
    request.body.brokerZipCode = "Broker 3800542";
    request.body.brokerCountry = "Broker India2";
    request.body.brokerStateProv = "Broker Gujarat2";
    request.body.brokerUseCompanyAddress = false;

    return broker.getBroker(null, t)
        .spread(companyAddress.updateAddress)
        .spread(company.updateCompany)
        .spread(brokerAddress.updateAddress)
        .spread(broker.updateBroker)
        .then(t.commit)
        .tap(function() {
            console.log("putBroker [COMPLETED]");
        });
}

function putUser(t) {
    console.log("putUser [STARTED]");
    request.body.userPassword = "Updated password";
    return user.getUser()
        .then(user.updateUser)
        .tap(function () {
            console.log("putUser [COMPLETED]");
        });
}

function addCompany(t) {
    console.log("addCompany [STARTED]");
    request.body.companyName = "BrokerSumo New";
    return company.addCompany()
        .tap(function () {
            console.log("addCompany [COMPLETED]");
        });
}

function putCompany(t) {
    console.log("putCompany [STARTED]");
    return company.getCompany(null, t)
        .spread(companyAddress.updateAddress)
        .spread(company.updateCompany)
        .then(t.commit)
        .tap(function () {
            console.log("putCompany [COMPLETED]");
        });
}

function addAgent(t) {
    console.log("addAgent [STARTED]");
    request.body.companyName = "BrokerSumo";
    request.body.userEmail = "brijesh_agent@brokersumo.com";
    request.body.userType = 2;
    request.body.agentFName = "Agent Brijesh";
    request.body.agentLName = "Agent Patel";
    request.body.userPassword = undefined;

    return company.getCompany(null, t)
        .spread(agent.addAgent)
        .then(t.commit)
        .tap(function() {
            console.log("addAgent [COMPLETED]");
        });
}

function putAgent(t) {
    console.log("putAgent [STARTED]");
    request.body.companyName = "BrokerSumo";
    request.body.userEmail = "brijesh_agent@brokersumo.com";
    request.body.userType = 2;
    request.body.agentFName = "Agent Brijesh Updated";
    request.body.agentLName = "Agent Patel";
    request.body.userPassword = undefined;
    request.body.agentAddress = "Agent Address2";
    request.body.agentCity = "Agent Ahmedabad2";
    request.body.agentZipCode = "Agent 3800542";
    request.body.agentCountry = "Agent India2";
    request.body.agentStateProv = "Agent Gujarat2";
    request.body.agentIsCompanyAddress = false;

    return company.getCompany(null, t)
        .spread(agentAddress.updateAddress)
        .spread(agent.getAgent)
        .spread(agent.updateAgent)
        .spread(user.addUser)
        .then(t.commit)
        .tap(function() {
            console.log("putAgent [COMPLETED]");
        });
}

function doTransaction(f) {
    return new Promise(function(resolve, reject) {
        bookshelf.transaction(f)
        .then(resolve)
        .catch(reject);
    });
}

doTransaction(putAgent);

// doTransaction(signup)
// .then(function() {
//     return doTransaction(putBroker);
// })
// .then(function() {
//     return doTransaction(putUser);
// })
// .then(function() {
//     return doTransaction(addCompany);
// })
// .then(function() {
//     return doTransaction(putCompany);
// });

// var Parent = bookshelf.Model.extend({
// 	tableName: 'parent',
// 	child: function() {
// 		return this.hasOne(Child);
// 	}
// });
//
// var Child = bookshelf.Model.extend({
// 	tableName: 'child',
// 	//this has an attribute parent_id
// 	parent: function() {
// 		return this.belongsTo(Parent);
// 	}
// });
//
// var parent, child;
// require("colors");
//
// bookshelf.transaction(function(t) {
//     Parent.forge({name: "Parent3"}).save(null, {transacting: t})
//     .then(function (_parent) {
//     	parent = _parent;
//     	return Child.forge({name: "Child3"}).save(null, {transacting: t});
//     })
//     .then(function (_child) {
//     	child = _child;
//     	child.related('parent').set(parent);
//     	return child.save(null, {transacting: t});
//     })
//     .then(t.commit)
//     .then(function(saved) {
//         console.log((JSON.stringify(saved, null, 4)).green);
//
//         Parent.forge({name: "Parent"})
//         .fetch({withRelated: "child"})
//         .then(function(fetchedParent) {
//             console.log((JSON.stringify(fetchedParent, null, 4)).yellow);
//         })
//         .catch(function(error) {
//             console.log((JSON.stringify(error, null, 4)).red);
//         });
//     });
// });
