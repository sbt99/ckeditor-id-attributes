import { Plugin } from 'ckeditor5/src/core';
import IdAttributesEditing from './idattributesediting';
import IdAttributesUI from './idattributesui';

class IdAttributes extends Plugin {
	static get requires() {
		return [ IdAttributesEditing, IdAttributesUI ];
	}

	static get pluginName() {
		return 'IdAttributes';
	}
}

export default IdAttributes;
