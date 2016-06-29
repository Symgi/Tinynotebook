CKEDITOR.plugins.add('ccmsacdc', {

    requires: 'widget',

    icons: 'ccmsacdc',

    init: function (editor) {
        var placeholderId = "";
        var generateNewPlaceholderId;

        editor.widgets.add('ccmsacdc', {
            edit: function() {
                if (CKEDITOR.currentInstance) {
                    this.element.focus();
                    placeholderId = this.element.$.getAttribute('id');

                    if (placeholderId !== undefined && placeholderId !== null && placeholderId !== '')
                        return;

                    placeholderId = generateNewPlaceholderId();
                    this.element.$.setAttribute('id', placeholderId);
                    this.editor.fire('ckACDCPlaceholderInserted', placeholderId);
                    CKEDITOR.dialog.add(CKEDITOR.currentInstance);
                }
            },

            init: function () {

                this.element.on('click', function (event) {
                    placeholderId = event.sender.$.getAttribute('id');
                     editor.fire('ckACDCPlaceholderClicked', placeholderId);
                });


                placeholderId = this.element.$.getAttribute('id');
                var showCommentsIcon = editor.showCommentsIcon;
                generateNewPlaceholderId = editor.generateNewPlaceholderId;
                var locationTag = editor.ccmsLocationTag;
                var placeholder = editor.ccmsPlaceHolder;
                var showDisplayId = editor.ccmsShowDisplayId;

                var spanTag = document.createElement("span");
                spanTag.className = 'comment-id';
                spanTag.innerHTML = "";
                spanTag.onclick = function (event) {
                    editor.fire('ckPlaceholderCommentClicked', locationTag(placeholderId.toString()));
                };

                if (showCommentsIcon() === true) {
                   this.element.$.nextSibling.appendChild(spanTag);
                   return true;
                }

                if (showDisplayId() =='false') {
                    return true;
                }

                var widgetDataplaceholder = placeholder(placeholderId);

                if (widgetDataplaceholder == undefined  || widgetDataplaceholder == '')
                    return true;

                if ( isNaN(widgetDataplaceholder.displayID))
                       return true;

                spanTag.className = 'placeholder-id';
                spanTag.innerHTML = widgetDataplaceholder.displayID;
                this.element.$.nextSibling.appendChild(spanTag);

                return true;
            },


            inline: true,

            template: '<acdcplaceholder>Click to edit DRS options</acdcplaceholder>',

            upcast: function (element) {
                return element.name == 'acdcplaceholder';
            },

            setData: function (keyOrData, value) {
                //this.element.removeClass('data-cke-temp');
                var classes = CKEDITOR.tools.clone(this.data.classes);
                //delete classes.
                //widget.setData('classes', classes);
            },

        });

        editor.ui.addButton && editor.ui.addButton('ccmsacdc', {
            label: 'Placeholder',
            command: 'ccmsacdc',
            toolbar: 'insert',
            icon: 'ccmsacdc'
        });

    }
});
