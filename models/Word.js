var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Word Model
 * ==========
 */
var Word = new keystone.List('Word', {
    autokey: { from: 'name', path: 'slug', unique: true }
});

Word.add({
	name: { type: String, required: true, initial: true, default: '', index: true },
	translate: {type: Types.Textarea }
});

/**
 * Relationships
 */
Word.relationship({ref: 'List', refPath: 'lists', path: 'words'});

/**
 * Registration
 */
Word.defaultColumns = 'name, translate';
Word.register();
