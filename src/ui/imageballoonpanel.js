/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/ui/imageballoonpanel
 */

import throttle from 'ckeditor5-utils/src/lib/lodash/throttle';
import global from 'ckeditor5-utils/src/dom/global';
import BalloonPanelView from 'ckeditor5-ui/src/balloonpanel/balloonpanelview';
import { isImageWidget } from '../utils';

const arrowVOffset = BalloonPanelView.arrowVerticalOffset;
const positions = {
	//	   [text range]
	//	        ^
	//	+-----------------+
	//	|     Balloon     |
	//	+-----------------+
	south: ( targetRect, balloonRect ) => ( {
		top: targetRect.bottom + arrowVOffset,
		left: targetRect.left + targetRect.width / 2 - balloonRect.width / 2,
		name: 's'
	} ),

	//	+-----------------+
	//	|     Balloon     |
	//	+-----------------+
	//	        V
	//	   [text range]
	north: ( targetRect, balloonRect ) => ( {
		top: targetRect.top - balloonRect.height - arrowVOffset,
		left: targetRect.left + targetRect.width / 2 - balloonRect.width / 2,
		name: 'n'
	} )
};

export default class ImageBalloonPanel extends BalloonPanelView {
	constructor( editor ) {
		super( editor.locale );

		this.editor = editor;
		const editingView = editor.editing.view;

		// Let the focusTracker know about new focusable UI element.
		editor.ui.focusTracker.add( this.element );

		// Hide the balloon if editor had focus and now focus is lost.
		this.listenTo( editor.ui.focusTracker, 'change:isFocused', ( evt, name, is, was ) => {
			if ( was && !is ) {
				this.detach();
			}
		} );

		// Hide the balloon if no image is currently selected.
		editor.listenTo( editingView, 'render', () => {
			const selectedElement = editingView.selection.getSelectedElement();

			if ( !selectedElement || !isImageWidget( selectedElement ) ) {
				this.detach();
			}
		}, { priority: 'low' } );

		this._throttledAttach = throttle( () => {
			this._attach();
		}, 100 );
	}

	attach() {
		this._attach();
		this.editor.ui.view.listenTo( global.window, 'scroll', this._throttledAttach );
		this.editor.ui.view.listenTo( global.window, 'resize', this._throttledAttach );
	}

	detach() {
		this.hide();
		this.editor.ui.view.stopListening( global.window, 'scroll', this._throttledAttach );
		this.editor.ui.view.stopListening( global.window, 'resize', this._throttledAttach );
	}

	_attach() {
		const editingView = this.editor.editing.view;

		this.attachTo( {
			target: editingView.domConverter.viewRangeToDom( editingView.selection.getFirstRange() ),
			positions: [ positions.north, positions.south ]
		} );
	}
}