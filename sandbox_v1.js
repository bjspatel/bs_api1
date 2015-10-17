var Model       = require("./app/models/db-model"),	//Load bookshelf model
    util        = require("./app/controllers/db/db-util"),
    database 	= require('./app/database/db'),
    Promise     = require("bluebird"),
    bookshelf 	= database.bookshelf,
    request     = {
        body: {
            companyAddress: "My Address",
            companyCity: "Ahmedabad",
            companyZipCode: "380054",
            companyCountry: "India",
            companyStateProv: "Gujarat",
            companyName: "BrokerSumo",
            userEmail: "brijesh@brokersumo.com",
            userType: 1,
            userPassword: "My Password",
            brokerFName: "Brijesh",
            brokerLName: "Patel"
        }
    };

var Address = function(request) {
    var req = request;
    var thisObj = this;

    this.addAddress = function(refObjects, t) {
        return util.addEntity(req, Model.Address, [], refObjects, t);
    };

    this.updateAddress = function(refObjects, t) {
        if(refObjects.address) {
            if(refObjects.address.get("id") === 1 || refObjects.address.get("id") === 0) {
                return thisObj.addAddress(refObjects, t);
            }
            return util.updateEntity(req, Model.Address, refObjects, t);
        } else {
            console.log(refObjects);
            return thisObj.addAddress(refObjects, t);
        }
    };
}

var Company = function(request) {
    var req = request;

    this.addCompany = function (refObjects, t) {
        return util.addEntity(req, Model.Company, refObjects, t);
    };

    this.updateCompany = function (refObjects, t) {
        console.log("UPDATING COMPANY");
        return util.updateEntity(req, Model.Company, refObjects, t);
    };

    this.getCompany = function (refObjects, t) {
        return util.getEntity(req, Model.Company, ["address"], refObjects, t);
    };
};

Broker = function(request) {
    var req = request;
    var relations = ["company"];

    this.addBroker = function (refObjects, t) {
        return util.addEntity(req, Model.Broker, refObjects, t);
    };

    this.updateBroker = function(refObjects, t) {
        return util.updateEntity(req, Model.Broker, refObjects, t);
    };

    this.getBroker = function (refObjects, t) {
        return util.getEntity(req, Model.Broker, relations, refObjects, t);
    };
}

User = function(request) {
    var req = request;

    this.addUser = function(refObjects, t) {
        return util.addEntity(req, Model.User, refObjects, t);
    };

    this.updateUser = function(refObjects, t) {
        return util.updateEntity(req, Model.User, refObjects, t);
    };

    this.getUser = function (refObjects, t) {
        return util.getEntity(req, Model.User, [], refObjects, t);
    };
};

var restUtil = require("./app/controllers/rest/rest-util");

var address = new Address(request),
    company = new Company(request),
    broker  = new Broker(request),
    user    = new User(request);

//signup - [DONE]
bookshelf.transaction(function(t) {
    company.addCompany(null, t)
    .spread(address.addAddress)
    .spread(broker.addBroker)
    .spread(user.addUser)
    .then(t.commit)
});

//put user - [DONE]
// request.body.password = "Updated password again";
// user.getUser()
// .then(user.updateUser)

//add Company - [DONE]
// bookshelf.transaction(function(t) {
//     company.addCompany(t)
//     .tap(console.log)
//     .then(t.commit);
// });

//put Company - [DONE]
// bookshelf.transaction(function(t) {
//     company.getCompany(null, t)
//     .spread(address.updateAddress)
//     .spread(company.updateCompany)
//     .then(t.commit)
// });

//put Broker
// bookshelf.transaction(function(t) {
//     broker.getBroker(null, t)
//     .spread(address.updateAddress)
//     .spread(company.updateCompany)
//     .spread(broker.updateBroker)
//     .then(t.commit)
// });


// var response = restUtil.getResponseData(savedCompany, "Company", "add");
// restUtil.sendResponse(response.code, response.content);





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
// Parent.forge({name: "Parent"}).save()
// .then(function (_parent) {
// 	parent = _parent;
// 	return Child.forge({name: "Child"}).save();
// })
// .then(function (_child) {
// 	child = _child;
// 	child.related('parent').set(parent);
// 	return child.save();
// })
// .then(function(saved) {
//     console.log((JSON.stringify(saved, null, 4)).green);
//
//     Parent.forge({name: "Parent"})
//     .fetch({withRelated: "child"})
//     .then(function(fetchedParent) {
//         console.log((JSON.stringify(fetchedParent, null, 4)).yellow);
//     })
//     .catch(function(error) {
//         console.log((JSON.stringify(error, null, 4)).red);
//     });
//
//
// });

function test() {


    // new Company()
    // .where({company_id: 12})
    // .fetch({withRelated: ["address"]})
    // .then(function(model) {
    //     console.log(model.toJSON());
    // });

    // new Address({id: 1})
    // .fetch({withRelated: ["company"]})
    // .then(function(model) {
    //     console.log(model.toJSON());
    // });


    // Broker
    // .where({broker_id: 23})
    // .fetch({withRelated: ["billingAddress"]})
    // .then(function(model) {
    //     console.log(model.toJSON());
    // })
}
//test();
