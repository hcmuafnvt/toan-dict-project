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
	mainType: { type: String, default: '' },
	phoneticSpelling: { type: String, default: '' },
	soundLink: { type: String, default: '' },
	mainViMean: { type: String, default: '' },
	mainEnMean: { type: String, default: '' },
	vdictHref: { type: String, default: '' },
	//translateToEn: Schema.Types.Mixed,
	translateToVi: { type: Types.Html, wysiwyg: true },
	createdBy: { type: Types.Relationship, ref: 'User', index: true, many: false },
	createdAt: { type: Types.Datetime, default: Date.now },
	UpdatedAt: { type: Types.Datetime, default: Date.now }
});

Word.schema.add({
	translateToEn: {type:keystone.mongoose.Schema.Types.Mixed} // for storing entire JS objects
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
