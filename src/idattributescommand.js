import { Command } from 'ckeditor5/src/core';

class IdAttributesCommand extends Command {
	refresh() {
		const element = this.editor.model.document.selection.anchor.parent;

		this.isEnabled = true;

		if ( !!element && element.hasAttribute( 'customId' ) ) {
			this.value = element.getAttribute( 'customId' );
		} else {
			this.value = false;
		}
	}

	execute( options ) {
		const model = this.editor.model;
		const element = this.editor.model.document.selection.anchor.parent;
		model.change( writer => {
			writer.setAttribute( 'customId', options.newValue, element );
		} );
	}
}

export default IdAttributesCommand;
