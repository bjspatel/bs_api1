module.exports = function(passport) {

    this.authentication   = require("../db/authentication-controller")(passport);
    this.user             = require("../db/user-controller");
    this.company          = require("../db/company-controller");
    this.broker           = require("../db/broker-controller");
    this.agent            = require("../db/agent-controller");
    this.onboardingplan   = require("../db/onboardingplan-controller");

    return this;
};
