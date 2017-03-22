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
	description: {type: Types.Textarea },
    words: { type: Types.Relationship, ref: 'Word', many: true }
});

/**
 * Relationships
 */
List.relationship({ref: 'Word', refPath: 'words', path: 'lists'});

/**
 * Registration
 */
List.defaultColumns = 'title, description';
List.register();
