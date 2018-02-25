
(function() {
    //we need this as we are not compiling with coffee
    var __slice = [].slice,
      __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
      __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  
    var codemirror_config = {
        mode: 'htmlmixed',
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 2,
        tabSize: 3,
        indentWithTabs: false,
        matchBrackets: true,
        saveCursorPosition: true,
        styleActiveLine: true
    };

    ContentTools.Tools.Codemirror = (function(_super) {
        __extends(Codemirror, _super);

        function Codemirror() {
        return Codemirror.__super__.constructor.apply(this, arguments);
        }

        ContentTools.ToolShelf.stow(Codemirror, 'codemirror');

        Codemirror.label = 'Edit HTML';

        Codemirror.icon = 'preformatted';

        Codemirror.canApply = function(element, selection) {
            return true;
        };

        Codemirror.isApplied = function(element, selection) {
            return false;
        };

        Codemirror.apply = function(element, selection, callback) {
            var from, to, toolDetail, _ref, tool;
            tool = this;
            toolDetail = {
                'tool': this,
                'element': element,
                'selection': selection
            };
            if (!this.dispatchEditorEvent('tool-apply', toolDetail)) {
                return;
            }

            var originalElement = element;
            if (element.parent().type() !== 'Region') {
                element = element.closest(function(node) {
                    return node.parent().type() === 'Region';
                });
            }
            var region = element.parent();
            var html = region.html();
            var app = ContentTools.EditorApp.get();
            var modal = new ContentTools.ModalUI();
            var dialog = new ContentTools.CodemirrorDialog(html);
            dialog.addEventListener('save', (function(_this) {
                return function(ev) {
                    region.setContent(ev.detail().content);
                    callback(true);
                    tool.dispatchEditorEvent('tool-applied', toolDetail);
                    modal.hide();
                    dialog.hide();
                };
              })(this));
            dialog.addEventListener('cancel', (function(_this) {
                return function() {
                  modal.hide();
                  dialog.hide();
                };
              })(this));
            app.attach(modal);
            app.attach(dialog);
            modal.show();
            return dialog.show();
        };

        return Codemirror;

    })(ContentTools.Tool);

    ContentTools.CodemirrorDialog = (function(_super) {
        __extends(CodemirrorDialog, _super);
        
        function CodemirrorDialog(html) {
            this.editorHtml = html;
            CodemirrorDialog.__super__.constructor.call(this, 'Edit HTML');
        }
    
        CodemirrorDialog.prototype.mount = function() {
          var domControlGroup;
          CodemirrorDialog.__super__.mount.call(this);
          ContentEdit.addCSSClass(this._domElement, 'ct-cm-dialog');
          ContentEdit.addCSSClass(this._domElement, 'ct-cm-large-dialog');
          //ContentEdit.addCSSClass(this._domView, 'ct-cm-dialog__preview');
          this._domInput = document.createElement('textarea');
          this._domInput.innerHTML = this.editorHtml;
          this._domInput.setAttribute('class', 'ct-cm-dialog_textarea');
          this._domView.appendChild(this._domInput);
          domControlGroup = this.constructor.createDiv(['ct-control-group']);
          this._domControls.appendChild(domControlGroup);
          this._domButton = this.constructor.createDiv(['ct-control', 'ct-control--text', 'ct-control--save', 'ct-control--muted']);
          this._domButton.textContent = ContentEdit._('Save');
          domControlGroup.appendChild(this._domButton);
          return this._addDOMEventListeners();
        };
    
        CodemirrorDialog.prototype.save = function() {
            return this.dispatchEvent(this.createEvent('save', {
              'content': this.codemirror.getValue()
            }));
        };
    
        CodemirrorDialog.prototype.show = function() {
          CodemirrorDialog.__super__.show.call(this);
          this.codemirror = CodeMirror.fromTextArea(this._domInput, codemirror_config);
          
          this.codemirror.on('change', (function(_this) {
            return function(inst) {
                ContentEdit.removeCSSClass(_this._domButton, 'ct-control--muted');
            };
          })(this));

          return this._domInput.focus();
        };
    
        CodemirrorDialog.prototype.unmount = function() {
          if (this.isMounted()) {
            this._domInput.blur();
          }
          CodemirrorDialog.__super__.unmount.call(this);
          this._domButton = null;
          this._domInput = null;
          this.codemirror = null;

          return null;
        };
    
        CodemirrorDialog.prototype._addDOMEventListeners = function() {
            CodemirrorDialog.__super__._addDOMEventListeners.call(this);
            return this._domButton.addEventListener('click', (function(_this) {
                return function(ev) {
                    var cssClass;
                    ev.preventDefault();
                    cssClass = _this._domButton.getAttribute('class');
                    if (cssClass.indexOf('ct-control--muted') === -1) {
                        return _this.save();
                    }
                };
            })(this));
        };
    
        return CodemirrorDialog;
    
    })(ContentTools.DialogUI);

}).call(this);