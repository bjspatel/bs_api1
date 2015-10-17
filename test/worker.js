var assert = require("chai").assert,
    dbWorker = require("../app/controllers/db/db-worker");

describe("dbWorker Utilities", function() {
    var req = {
        body: {
            companyName: "BrokerSumo",
            userEmail: "brijesh@brokersumo.com",
            userType: 1,
            userPassword: "My Password",
            brokerFName: "Brijesh",
            brokerLName: "Patel",
            companyAddress: "Company Address",
            companyCity: "Company Ahmedabad",
            companyZipCode: "Company 380054",
            companyCountry: "Company India",
            companyStateProv: "Company Gujarat",
            brokerAddress: "Broker Address",
            brokerCity: "Broker Ahmedabad",
            brokerZipCode: "Broker 380054",
            brokerCountry: "Broker India",
            brokerStateProv: "Broker Gujarat",
            brokerUseCompanyAddress: false,
            agentFName: "Agent Brijesh",
            agentLName: "Agent Patel",
            agentOfficeLocation: "Agent Ahmedabad",
            agentStatus: 1,
            agentAddress: "Agent Address",
            agentCity: "Agent Ahmedabad",
            agentZipCode: "Agent 380054",
            agentCountry: "Agent India",
            agentStateProv: "Agent Gujarat",
            onboardingPlanName: "BS Ahmedabad Plan",
            onboardingPlanIsTemplate: 0
        }
    };

    it("dbWorker.prepareDBObject for 'user'", function() {
        var actualObj = {},
            expectedObj = {
                "email": "brijesh@brokersumo.com",
                "password": "My Password",
                "type": 1
            };
        dbWorker.prepareDataObject(actualObj, req, "user");
        assert.deepEqual(actualObj, expectedObj, "user object created");
    });

    it("dbWorker.prepareDBObject for 'company'", function() {
        var actualObj = {},
            expectedObj = {
                "name": "BrokerSumo"
            };
        dbWorker.prepareDataObject(actualObj, req, "company");
        assert.deepEqual(actualObj, expectedObj, "company object created");
    });

    it("dbWorker.prepareDBObject for 'company.address'", function() {
        var actualObj = {},
            expectedObj = {
                "address": "Company Address",
                "city": "Company Ahmedabad",
                "zip_code": "Company 380054",
                "country": "Company India",
                "state_prov": "Company Gujarat"
            };
        dbWorker.prepareDataObject(actualObj, req, "company.address");
        assert.deepEqual(actualObj, expectedObj, "company.address object created");
    });

    it("dbWorker.prepareDBObject for 'broker'", function() {
        var actualObj = {},
            expectedObj = {
                "email": "brijesh@brokersumo.com",
                "first_name": "Brijesh",
                "last_name": "Patel"
            };
        dbWorker.prepareDataObject(actualObj, req, "broker");
        assert.deepEqual(actualObj, expectedObj, "broker object created");
    });

    it("dbWorker.prepareDBObject for 'broker.address'", function() {
        var actualObj = {},
            expectedObj = {
                "address": "Broker Address",
                "city": "Broker Ahmedabad",
                "zip_code": "Broker 380054",
                "country": "Broker India",
                "state_prov": "Broker Gujarat"
            };

        dbWorker.prepareDataObject(actualObj, req, "broker.address");
        assert.deepEqual(actualObj, expectedObj, "broker.address object created");
    });

    it("dbWorker.prepareDBObject for 'agent'", function() {
        var actualObj = {},
            expectedObj = {
                "email": "brijesh@brokersumo.com",
                "first_name": "Agent Brijesh",
                "last_name": "Agent Patel",
                "office_location": "Agent Ahmedabad",
                "status": 1
            };

        dbWorker.prepareDataObject(actualObj, req, "agent");
        assert.deepEqual(actualObj, expectedObj, "agent object created");
    });

    it("dbWorker.prepareDBObject for 'agent.address'", function() {
        var actualObj = {},
            expectedObj = {
                "address": "Agent Address",
                "city": "Agent Ahmedabad",
                "zip_code": "Agent 380054",
                "country": "Agent India",
                "state_prov": "Agent Gujarat"
            };

        dbWorker.prepareDataObject(actualObj, req, "agent.address");
        assert.deepEqual(actualObj, expectedObj, "agent.address object created");
    });

    it("dbWorker.prepareDBObject for 'onboardingPlan'", function() {
        var actualObj = {},
            expectedObj = {
                "name": "BS Ahmedabad Plan"
            };

        dbWorker.prepareDataObject(actualObj, req, "onboarding_plan");
        assert.deepEqual(actualObj, expectedObj, "onboardingPlan object created");
    });
});
