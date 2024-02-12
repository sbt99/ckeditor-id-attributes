import { Plugin } from 'ckeditor5/src/core';
import IdAttributesCommand from './idattributescommand';

/**
 * The name of the ID attribute.
 */
export const MODEL_ID_ATTRIBUTE = 'customId';

/**
 * The name of the ID attribute.
 */
export const VIEW_ID_ATTRIBUTE = 'id';

class IdAttributesEditing extends Plugin {
	static get pluginName() {
		return 'IdAttributesEditing';
	}

	init() {
		this._registerSchema();
		this._registerConverters();
	}

	_registerSchema() {
		this.editor.model.schema.extend( '$block', { allowAttributes: [ MODEL_ID_ATTRIBUTE, 'id' ] } );
	}

	_registerConverters() {
		const editor = this.editor;

		// Converts the 'customId' model property (attribute) of a any $block
		// model into an 'id' attribute on a the corresponding view element.
		editor.conversion.for( 'downcast' ).add( dispatcher =>
			dispatcher.on( `attribute:${ MODEL_ID_ATTRIBUTE }`, ( evt, data, conversionApi ) => {
				if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
					return;
				}

				const viewWriter = conversionApi.writer;
				const elementView = conversionApi.mapper.toViewElement( data.item );

				if ( data.attributeNewValue !== null ) {
					viewWriter.setAttribute( VIEW_ID_ATTRIBUTE, data.attributeNewValue, elementView );
				} else {
					viewWriter.removeAttribute( VIEW_ID_ATTRIBUTE, elementView );
				}
			} )
		);

		editor.conversion
			.for( 'upcast' )
			.attributeToAttribute( {
				view: VIEW_ID_ATTRIBUTE,
				model: MODEL_ID_ATTRIBUTE
			} );

		this.editor.commands.add( 'IdAttributes', new IdAttributesCommand( this.editor ) );
	}
}

export default IdAttributesEditing;
