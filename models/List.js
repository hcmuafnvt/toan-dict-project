var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * List Model
 * ==========
 */
var List = new keystone.List('List', {
    autokey: { from: 'title', path: 'slug', unique: true }
});

List.add({
    title: { type: String, required: true, initial: true, default: '', index: true },
    description: { type: Types.Textarea },
    words: { type: Types.Relationship, ref: 'Word', many: true },
    numberOfWords: { type: Types.Number, default: 0 },
    numberOfUserStudy: { type: Types.Number, default: 0 },
    createdBy: { type: Types.Relationship, ref: 'User', index: true, many: false },
    createdAt: { type: Types.Datetime, default: Date.now },
    UpdatedAt: { type: Types.Datetime, default: Date.now }
});

/**
 * Relationships
 */
//List.relationship({ ref: 'Word', refPath: 'words', path: 'lists' });

/**
 * Registration
 */
List.defaultColumns = 'title, description, createdAt, UpdatedAt';
List.register();
