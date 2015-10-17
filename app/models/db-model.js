var database 	= require('../database/db'),
	bookshelf 	= database.bookshelf,
	knex		= database.knex;

var User = bookshelf.Model.extend({
	tableName: 'user'
});

var Agent = bookshelf.Model.extend({
	tableName: 'agent',
	company: function() {
		return this.belongsTo(Company);
	},
	address: function() {
		return this.belongsTo(Address);
	}
});

var Broker = bookshelf.Model.extend({
	tableName: 'broker',
	company: function() {
		return this.belongsTo(Company);
	},
	address: function() {
		return this.belongsTo(Address);
	}
});

var Company = bookshelf.Model.extend({
	tableName: 'company',
	address: function() {
		return this.belongsTo(Address);
	},
	broker: function() {
		return this.hasMany(Broker);
	},
	agent: function() {
		return this.hasMany(Agent);
	}
});

var OnboardingPlan = bookshelf.Model.extend({
	tableName: 'onboarding_plan'
});

var Address = bookshelf.Model.extend({
	tableName: 'address'
});

var BankAccount = bookshelf.Model.extend({
	tableName: 'bank_account'
});

var CreditCard = bookshelf.Model.extend({
	tableName: 'creadit_card'
});

var OnboardingComponent = bookshelf.Model.extend({
	tableName: 'onboarding_component'
});

module.exports = {
   User: User,
   Company: Company,
   Broker: Broker,
   Agent: Agent,
   OnboardingPlan: OnboardingPlan,
   Address: Address,
   BankAccount: BankAccount,
   CreditCard: CreditCard,
   OnboardingComponent: OnboardingComponent
};
