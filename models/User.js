var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	createdAt: {type: Types.Datetime, default: Date.now},
    UpdatedAt: {type: Types.Datetime, default: Date.now}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.virtual('url').get(function() {
	return '/users/' + this._id;
});

/**
 * Relationships
 */

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin, createdAt, updatedAt';
User.register();
