/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, console, window */

import ClassicEditor from 'ckeditor5-editor-classic/src/classic';
import EnterPlugin from 'ckeditor5-enter/src/enter';
import TypingPlugin from 'ckeditor5-typing/src/typing';
import ParagraphPlugin from 'ckeditor5-paragraph/src/paragraph';
import HeadingPlugin from 'ckeditor5-heading/src/heading';
import ImagePlugin from 'ckeditor5-image/src/image';
import UndoPlugin from 'ckeditor5-undo/src/undo';
import ClipboardPlugin from 'ckeditor5-clipboard/src/clipboard';
import ImageStyle from 'ckeditor5-image/src/imagestyle/imagestyle';
import ImageToolbar from 'ckeditor5-image/src/imagetoolbar';

ClassicEditor.create( document.querySelector( '#editor' ), {
	plugins: [ ImageToolbar, EnterPlugin, TypingPlugin, ParagraphPlugin, HeadingPlugin, ImagePlugin, UndoPlugin, ClipboardPlugin, ImageStyle ],
	toolbar: [ 'headings', 'undo', 'redo' ]
} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
