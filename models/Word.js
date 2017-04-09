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
	name: { type: String, required: true, initial: true, default: '', index: true, unique: true },
	mainViMean: { type: String, default: '' },
	mainEnMean: { type: String, default: '' },
	vdictHref: { type: String, default: '' },
	translateToEn: { type: Types.Html, wysiwyg: true },
	translateToVi: { type: Types.Html, wysiwyg: true },
	createdBy: { type: Types.Relationship, ref: 'User', index: true, many: false },
	createdAt: { type: Types.Datetime, default: Date.now },
	UpdatedAt: { type: Types.Datetime, default: Date.now }
});

/**
 * Relationships
 */
Word.relationship({ ref: 'List', refPath: 'lists', path: 'words' });

/**
 * Registration
 */
Word.defaultColumns = 'name, translate, createdBy, createdAt, UpdatedAt';
Word.register();
