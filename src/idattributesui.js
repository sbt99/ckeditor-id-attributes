/* eslint-disable no-undef */
import { Plugin } from 'ckeditor5/src/core';
import {
	ContextualBalloon,
	ButtonView,
	clickOutsideHandler,
	BalloonPanelView
} from 'ckeditor5/src/ui';
import pencilIcon from '../theme/icons/idattributes.svg';
import IdAttributesFormView from './ui/idattributesview';

class IdAttributesUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	static get pluginName() {
		return 'IdAttributesUI';
	}

	init() {
		this._createButton();
		this._createForm();
	}

	destroy() {
		super.destroy();
		this._form.destroy();
	}

	_createButton() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'IdAttributes', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Set element id attribute' ),
				icon: pencilIcon,
				tooltip: true,
				class: 'element-add-attributes-btn'
			} );

			this.listenTo( view, 'execute', () => {
				this._showForm();
			} );

			return view;
		} );
	}

	_createForm() {
		const editor = this.editor;
		const view = editor.editing.view;
		const viewDocument = view.document;

		this._balloon = this.editor.plugins.get( 'ContextualBalloon' );

		this._form = new IdAttributesFormView( editor.locale );
		// Render the form so its #element is available for clickOutsideHandler.
		this._form.render();

		this.listenTo( this._form, 'submit', () => {
			editor.execute( 'IdAttributes', {
				newValue: this._form.labeledInput.fieldView.element.value
			} );

			this._hideForm( true );
		} );

		this.listenTo( this._form, 'cancel', () => {
			this._hideForm( true );
		} );

		// Close the form on Esc key press.
		this._form.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._hideForm( true );
			cancel();
		} );

		// Reposition the balloon or hide the form if an image widget is no longer selected.
		this.listenTo( editor.ui, 'update', () => {
			if ( !viewDocument.selection ) {
				this._hideForm( true );
			}
		} );

		// Close on click outside of balloon panel element.
		clickOutsideHandler( {
			emitter: this._form,
			activator: () => this._isVisible,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideForm()
		} );
	}

	_showForm() {
		if ( this._isVisible ) {
			return;
		}

		const editor = this.editor;
		const command = editor.commands.get( 'IdAttributes' );
		const labeledInput = this._form.labeledInput;

		if ( !this._isInBalloon ) {
			const defaultPositions = BalloonPanelView.defaultPositions;
			const target = document.querySelector( '.element-add-attributes-btn' );

			this._balloon.add( {
				view: this._form,
				position: {
					target,
					positions: [
						defaultPositions.northArrowSouth,
						defaultPositions.northArrowSouthWest,
						defaultPositions.northArrowSouthEast,
						defaultPositions.southArrowNorth,
						defaultPositions.southArrowNorthWest,
						defaultPositions.southArrowNorthEast
					]
				}
			} );
		}

		// Make sure that each time the panel shows up, the field remains in sync with the value of
		// the command. If the user typed in the input, then canceled the balloon (`labeledInput#value`
		// stays unaltered) and re-opened it without changing the value of the command, they would see the
		// old value instead of the actual value of the command.
		// https://github.com/ckeditor/ckeditor5-image/issues/114
		labeledInput.fieldView.value = labeledInput.fieldView.element.value = command.value || '';

		this._form.labeledInput.fieldView.select();
	}

	_hideForm( focusEditable ) {
		if ( !this._isInBalloon ) {
			return;
		}

		// Blur the input element before removing it from DOM to prevent issues in some browsers.
		// See https://github.com/ckeditor/ckeditor5/issues/1501.
		if ( this._form.focusTracker.isFocused ) {
			this._form.saveButtonView.focus();
		}

		this._balloon.remove( this._form );

		if ( focusEditable ) {
			this.editor.editing.view.focus();
		}
	}

	get _isVisible() {
		return this._balloon.visibleView === this._form;
	}

	get _isInBalloon() {
		return this._balloon.hasView( this._form );
	}
}

export default IdAttributesUI;
