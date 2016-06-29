﻿// Uploadcare CKeditor plugin
// Version: 2.1.3

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var searchSelectedElement = require ('../tools/search-selected-element');
var editInst = require('../globals/editor');

module.exports = function() {
  if (typeof uploadcare == 'undefined') {
    return; // not loaded yet
  }
  var editor = editInst.editor;

  var config = editor.config.uploadcare || {};

  // Apply default properties.
  if ( ! ('crop' in config)) {
    config.crop = '';
  }

  uploadcare.plugin(function(uc) {
    var settings, element, file;

    if (element = searchSelectedElement(editor, 'img')) {
      file = element.getAttribute('src');
    } else if (element = searchSelectedElement(editor, 'a')) {
      file = element.getAttribute('href');
    }

    if (file && uc.utils.splitCdnUrl(file)) {
      settings = uc.settings.build(
        uc.jQuery.extend({}, config, {multiple: false})
      );
      file = uploadcare.fileFrom('uploaded', file, settings);
    } else {
      settings = uc.settings.build(config)
      file = null;
    }

    var dialog = uploadcare.openDialog(file, settings).done(function(selected) {
      var files = settings.multiple ? selected.files() : [selected];
      uc.jQuery.when.apply(null, files).done(function() {
        uc.jQuery.each(arguments, function() {
          var imageUrl = this.cdnUrl;
          if (this.isImage && ! this.cdnUrlModifiers) {
            imageUrl += '-/preview/';
          }
          if (element) {
            var widget;
            if (editor.widgets && (widget = editor.widgets.selected[0])
                && widget.element === element
            ) {
              widget.setData('src', imageUrl).setData('height', null)
            } else if (element.getName() == 'img') {
              element.data('cke-saved-src', '');
              element.setAttribute('src', imageUrl);
              element.removeAttribute('width');
              element.removeAttribute('height');
            } else {
              element.data('cke-saved-href', '');
              element.setAttribute('href', this.cdnUrl);
            }
          } else {
            if (this.isImage) {
              editor.insertHtml('<img src="' + imageUrl + '" alt=""/><br>', 'unfiltered_html');
            } else {
              editor.insertHtml('<a href="' + this.cdnUrl + '">' + this.name + '</a> ', 'unfiltered_html');
            }
          }
        });
      });
    });
  });
}
},{"../globals/editor":2,"../tools/search-selected-element":6}],2:[function(require,module,exports){
'use scrict'

module.exports = {
  editor:null
}
},{}],3:[function(require,module,exports){
// Uploadcare CKeditor plugin
// Version: 2.1.1
'use strict';

var editInst = require('./globals/editor');

CKEDITOR.plugins.add('uploadcare', {
  hidpi: true,
  icons: 'uploadcare',
  init : function(editor) {
    editInst.editor = editor;
    var getBody = require('./tools/get-body');

    editor.addContentsCss( this.path + 'styles/plugin.css' );
    var config = editor.config.uploadcare || {};

    // Check if Uploadcare is already loaded and load it if not.
    if (typeof uploadcare === 'undefined') {
        var version = config.widgetVersion || '2.4.0';
        var widget_url = 'https://ucarecdn.com/widget/' + version +
                 '/uploadcare/uploadcare.full.min.js'
        CKEDITOR.scriptLoader.load(widget_url);
    }

    editor.addCommand('showUploadcareDialog', {
      allowedContent: 'img[!src,alt]{width,height};a[!href]',
      requiredContent: 'img[src];a[href]',
      exec : require('./commands/show-uploadcare-dialog')
    });

    editor.ui.addButton && editor.ui.addButton('Uploadcare', {
      label : 'Uploadcare',
      toolbar : 'insert',
      command : 'showUploadcareDialog'
    });

    editor.on('contentDom', function() {

      var editable = editor.editable();
      var tools = null;
      var isResizing = false;
      var resizeImg = null;
      var resizeElements = null;
      var resizerSize = 12;

      var clearToolbar = require('./tools/clear-toolbar');

      editable.attachListener( editable.isInline() ? editable : editor.document, 'mousemove', function( evt ) {
        evt = evt.data;
        var target = evt.getTarget();
        var src = target.$.getAttribute('src');

        function onMouseOut(evt) {
          var target = evt.data.getTarget();
          var rect = target.$.getBoundingClientRect();

          if((evt.data.$.clientX < rect.left || evt.data.$.clientX > rect.right) ||
          (evt.data.$.clientY < rect.top || evt.data.$.clientY > rect.bottom)) {
            tools.hide();
          }
        }

        if(target.is('img') && (src.indexOf('www.ucarecdn.com') > -1) && !isResizing) {
          var body = getBody();
          if(!tools) {
            tools = body.findOne('div.tools-container');
            if(!tools) {
              tools = CKEDITOR.dom.element.createFromHtml('<div class="tools-container"><button class="button resize icon icon-resize"></button><button class="button dialog icon icon-crop"></button></div>');
            }
            tools.setStyle('zindex', '100');
            body.append(tools);
            tools.on('mouseout', onMouseOut);
          }
          else {
            tools.show();
          }

          var rect = getPosition(target);
          tools.setStyle('top', rect.top + 'px');
          tools.setStyle('left', rect.left + 'px');

          tools.removeAllListeners();
          var resizeBtn = tools.findOne('button.resize');
          resizeBtn.removeAllListeners();
          resizeBtn.on('click', onResizeAction.bind(target));

          var dialogBtn = tools.findOne('button.dialog');
          dialogBtn.removeAllListeners();
          dialogBtn.on('click', function(){
            editor.getSelection().selectElement( target );
            editor.execCommand('showUploadcareDialog');
          });

          target.removeAllListeners();
          target.on('mouseout', onMouseOut);

        } else if (tools && target.$ !== tools.$ && !isResizing) {
          if(target.getParent() && !target.getParent().hasClass('tools-container')) {
            tools.hide();
          }
        }

        if(isResizing) {
          console.log('Resizing!!!!');
          var nativeEvt = evt.$;

          var moveDiffX = nativeEvt.screenX - resizeElements.startX;
          var moveDiffY = resizeElements.startY - nativeEvt.screenY;
          var moveRatio = Math.abs(moveDiffX / moveDiffY);

          if ( moveDiffX <= 0 ) {
						if ( moveDiffY <= 0 ) {
							adjustToX(moveDiffX);
            } else {
							if ( moveRatio >= resizeElements.ratio ) {
								adjustToX(moveDiffX);
              } else {
								adjustToY(moveDiffY);
              }
						}
					} else {
						if ( moveDiffY <= 0 ) {
							if ( moveRatio >= resizeElements.ratio ) {
								adjustToY(moveDiffY);
              } else {
								adjustToX(moveDiffX);
              }
						} else {
							adjustToY(moveDiffY);
						}
					}
            if(resizeElements.newWidth >= 15 && resizeElements.newHeight >= 15) {
              resizeImg.setAttributes( {width: resizeElements.newWidth, height: resizeElements.newHeight} );
              resizeElements.resizeBorder.setStyle('width', resizeElements.newWidth + 'px');
              resizeElements.resizeBorder.setStyle('height', resizeElements.newHeight + 'px');

              resizeElements.bottomRightResizer.setStyle('left', resizeElements.imgRect.left + resizeElements.newWidth - resizerSize/2 + 'px');
              resizeElements.bottomRightResizer.setStyle('top', resizeElements.imgRect.top + resizeElements.newHeight - resizerSize/2 + 'px');
            }
					}
      });

      editor.on('dragstart', function(evt) {
        clearToolbar();
      });

      function onResizeAction(raEvt) {
        clearToolbar();
        var img = this;
        var rect = getPosition(img);
        editor.getSelection().fake(img);

        var body = getBody();
        var screenOverlay = CKEDITOR.dom.element.createFromHtml('<div class="screen-overlay"><div>');
        var resizeBorder = CKEDITOR.dom.element.createFromHtml('<div class="resize-border"><div>');
        screenOverlay.append(resizeBorder);
        body.append(screenOverlay);

        var bodyRect = getPosition(editable.getDocument().getDocumentElement());

        screenOverlay.setStyle('width', bodyRect.width + 'px');
        screenOverlay.setStyle('height', bodyRect.height + 'px');

        resizeBorder.setStyle('top', rect.top + 'px');
        resizeBorder.setStyle('left', rect.left + 'px');
        resizeBorder.setStyle('width', rect.width + 'px');
        resizeBorder.setStyle('height', rect.height + 'px');

        resizeElements = {
          resizeBorder: resizeBorder,
          imgRect: rect,
          newWidth: rect.width,
          newHeight: rect.height
        }

        createResizers(rect, screenOverlay);
        resizeImg = img;

        screenOverlay.on('click', function(){
          editor.resetUndo();
          if(isResizing) {
            isResizing = false;
            updateImgSrc();
            return;
          }

          screenOverlay.remove();
          resizeImg = null;
          resizeElements = null;
        });

        resizeBorder.on('click', function(clickEvt) {
          clickEvt.data.$.stopPropagation();
          clickEvt.data.$.preventDefault();
        });

        resizeElements.bottomRightResizer.on('mousedown', function(mdEvt) {

          console.log('mouse Down');
          console.log(mdEvt);
          mdEvt.data.$.stopPropagation();
          mdEvt.data.$.preventDefault();
          isResizing = true;
          resizeElements.startX = mdEvt.data.$.screenX;
				  resizeElements.startY = mdEvt.data.$.screenY;
          resizeElements.startWidth = resizeImg.$.clientWidth;
          resizeElements.startHeight = resizeImg.$.clientHeight;
          resizeElements.ratio = resizeElements.startWidth / resizeElements.startHeight;

        });

        resizeElements.bottomRightResizer.on('mouseup', function(evt) {
          editor.resetUndo();
          console.log('Mouse Up');
          console.log(evt);
          isResizing = false;
          updateImgSrc();
        });
      }

      function createResizers(rect, overlay) {

        var bottomRightResizer = CKEDITOR.dom.element.createFromHtml('<div class="resizer bottom-right"><div>');
        setUpResizer(bottomRightResizer, rect.bottom, rect.right, resizerSize);
        overlay.append(bottomRightResizer);
        resizeElements.bottomRightResizer = bottomRightResizer;
      }

      function setUpResizer(element, top, left, size) {
        element.setStyle('top', top - size/2 + 'px');
        element.setStyle('left', left - size/2 + 'px');
        element.setStyle('width', size + 'px');
        element.setStyle('height', size + 'px');
        element.on('click', function(evt) {
          evt.data.$.stopPropagation();
          evt.data.$.preventDefault();
        });
      }

      function getPosition(element) {
        var body = getBody();
        var resRect = element.$.getBoundingClientRect();

        return {
          top: resRect.top + body.$.scrollTop,
          bottom: resRect.bottom + body.$.scrollTop,
          left: resRect.left + body.$.scrollLeft,
          right: resRect.right + body.$.scrollLeft,
          width: resRect.width,
          height: resRect.height
        };
      }

      function updateImgSrc() {
        var initialUrl = resizeImg.getAttribute('src');
        var newUrl = initialUrl.substr(0, initialUrl.indexOf('/preview')) + '/preview/' + resizeElements.newWidth + 'x' + resizeElements.newHeight + '/';
        resizeImg.setAttributes({
              'data-cke-saved-src': newUrl,
              'src': newUrl
            });
      }

      function adjustToX(moveDiffX) {
				resizeElements.newWidth = resizeElements.startWidth + moveDiffX;
				resizeElements.newHeight = Math.round( resizeElements.newWidth / resizeElements.ratio );
			}

			// Calculate height first, and then adjust width, preserving ratio.
			function adjustToY(moveDiffY) {
				resizeElements.newHeight = resizeElements.startHeight - moveDiffY;
				resizeElements.newWidth = Math.round( resizeElements.newHeight * resizeElements.ratio );
			}
    });
  }
});

},{"./commands/show-uploadcare-dialog":1,"./globals/editor":2,"./tools/clear-toolbar":4,"./tools/get-body":5}],4:[function(require,module,exports){
'use strict'

var getBody = require('./get-body');

module.exports = function() {
  var body = getBody();
  var tools = body.findOne('div.tools-container');

  if(tools) {
    tools.hide();
  } else {
    console.log('tools not found');
  }
}
},{"./get-body":5}],5:[function(require,module,exports){
'use strict'

var editor = require('../globals/editor').editor;

module.exports = function getBody() {
  var editable = editor.editable();
  return editable.getDocument().getDocumentElement().findOne('body');
}
},{"../globals/editor":2}],6:[function(require,module,exports){
'use strict'

module.exports = function (editor, needle) {
  var sel = editor.getSelection();
  var element = sel.getSelectedElement();
  if (element && element.is(needle)) {
    return element;
  }

  var widget;
  if (editor.widgets && (widget = editor.widgets.selected[0])) {
    if (widget.element.is(needle)) {
      return widget.element;
    }
  }

  var range = sel.getRanges()[0];
  if (range) {
    range.shrink(CKEDITOR.SHRINK_TEXT);
    return editor.elementPath(range.getCommonAncestor()).contains(needle, 1);
  }
}
},{}]},{},[3])
