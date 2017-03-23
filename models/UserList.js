var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * UserList Model
 * ==========
 */
var UserList = new keystone.List('UserList');

UserList.add({
    userId: { type: Types.Relationship, ref: 'User', index: true, many: false },
    listId: { type: Types.Relationship, ref: 'List', index: true, many: false },
    createdAt: { type: Types.Datetime, default: Date.now },
    UpdatedAt: { type: Types.Datetime, default: Date.now }
});

/**
 * Relationships
 */

/**
 * Registration
 */
UserList.defaultColumns = 'userId, listId, createdAt, UpdatedAt';
UserList.register();