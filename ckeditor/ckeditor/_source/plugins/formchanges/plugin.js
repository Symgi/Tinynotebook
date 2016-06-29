
/**************************************
    Webutler V2.1 - www.webutler.de
    Copyright (c) 2008 - 2011
    Autor: Sven Zinke
    Free for any use
    Lizenz: GPL
**************************************/


(function()
{
    CKEDITOR.plugins.add( 'formchanges',
    {
    	init : function( editor )
    	{
    		editor.addCss(
    			'img.cke_radio, img.cke_radio_checked, img.cke_checkbox, img.cke_checkbox_checked {' +
    			'    background-position: center center;' +
    			'    background-repeat: no-repeat;' +
    			'    width: 16px;' +
    			'    height: 16px;' +
    			'}'+
    			'img.cke_radio {' +
    			'    background-image: url(' + CKEDITOR.getUrl( this.path + 'images/radio_off.gif' ) + ');' +
    			'}'+
    			'img.cke_radio_checked {' +
    			'    background-image: url(' + CKEDITOR.getUrl( this.path + 'images/radio_on.gif' ) + ');' +
    			'}'+
    			'img.cke_checkbox {' +
    			'    background-image: url(' + CKEDITOR.getUrl( this.path + 'images/checkbox_off.gif' ) + ');' +
    			'}'+
    			'img.cke_checkbox_checked {' +
    			'    background-image: url(' + CKEDITOR.getUrl( this.path + 'images/checkbox_on.gif' ) + ');' +
    			'}' +
    			'img.cke_select, img.cke_selects {' +
    			'    background-position: center center;' +
    			'    background-repeat: no-repeat;' +
    			'    width: 100px;' +
    			'}' +
    			'img.cke_select {' +
    			'    background-image: url(' + CKEDITOR.getUrl( this.path + 'images/select.gif' ) + ');' +
    			'    height: 19px;' +
    			'}' +
    			'img.cke_selects {' +
    			'    background-image: url(' + CKEDITOR.getUrl( this.path + 'images/selects.gif' ) + ');' +
    			'    height: 47px;' +
    			'}'
            );
            
    		editor.on( 'doubleclick', function( evt )
    		{
    			var element = evt.data.element;
    			
                if( element.hasClass( 'cke_radio' ) || element.hasClass( 'cke_radio_checked' ) )
                    evt.data.dialog = 'radio';
                else if( element.hasClass( 'cke_checkbox' ) || element.hasClass( 'cke_checkbox_checked' ) )
                    evt.data.dialog = 'checkbox';
                else if( element.hasClass( 'cke_select' ) || element.hasClass( 'cke_selects' ) )
                    evt.data.dialog = 'select';
                else
                    return null;
    		});
    		
    		if ( editor.contextMenu )
    		{
                editor.contextMenu.addListener( function( element, selection )
                {
                    if( element && element.data( 'cke-real-element-type' ) == 'radiofield' && (element.hasClass( 'cke_radio' ) || element.hasClass( 'cke_radio_checked' )) )
                        return { radio : CKEDITOR.TRISTATE_OFF };
                    else if( element && element.data( 'cke-real-element-type' ) == 'checkboxfield' && (element.hasClass( 'cke_checkbox' ) || element.hasClass( 'cke_checkbox_checked' )) )
                        return { checkbox : CKEDITOR.TRISTATE_OFF };
                    else if( element && element.data( 'cke-real-element-type' ) == 'selectfield' && ( element.hasClass( 'cke_select' ) || element.hasClass( 'cke_selects' ) ) )
                        return { select : CKEDITOR.TRISTATE_OFF };
                    else
                        return null;
                });
            }
    	},
    	afterInit : function( editor )
    	{
    		var dataProcessor = editor.dataProcessor,
    			dataFilter = dataProcessor && dataProcessor.dataFilter;
        	
    		if( dataFilter )
    		{
    			dataFilter.addRules(
    			{
    				elements :
    				{
    					input : function( element )
    					{
    						var attributes = element.attributes;
    						switch(attributes.type)
    						{
    							case 'radio' :
    								if(attributes.checked)
    									return editor.createFakeParserElement( element, 'cke_radio_checked', 'radiofield', false );
                                    else
    									return editor.createFakeParserElement( element, 'cke_radio', 'radiofield', false );
    								break;
    								
    							case 'checkbox' :
    								if(attributes.checked)
    									return editor.createFakeParserElement( element, 'cke_checkbox_checked', 'checkboxfield', false );
                                    else
    									return editor.createFakeParserElement( element, 'cke_checkbox', 'checkboxfield', false );
    								break;
    						}
    					},
    					select : function( element )
    					{
    						var attributes = element.attributes;
    						if(attributes.size >= 2)
        						return editor.createFakeParserElement( element, 'cke_selects', 'selectfield', false );
    						else
        						return editor.createFakeParserElement( element, 'cke_select', 'selectfield', false );
    					}
    				}
    			});
    		}
    	},
    	requires : [ 'fakeobjects' ] 
    });
    
    CKEDITOR.on( 'dialogDefinition', function( ev )
    {
    	var dialogName = ev.data.name;
    	var dialogDefinition = ev.data.definition;
        var editor = ev.editor;
        
    	if ( dialogName == 'radio' )
    	{
            dialogDefinition.onLoad = function()
            {
                var dialog = CKEDITOR.dialog.getCurrent();
                dialog.on('show', function()
                {
        			this.radioField = false;
        			this.editMode = false;
        			
        			var selection = editor.getSelection(),
        				element = selection.getSelectedElement();
        			
        			if ( element && element.data( 'cke-real-element-type' ) && element.data( 'cke-real-element-type' ) == 'radiofield' )
        			{
        				this.editMode = true;
        				this.radioField = element;
        				element = editor.restoreRealElement( this.radioField );
        				this.setupContent( element );
        				selection.selectElement( this.radioField );
        			}
                });
            };
            
            dialogDefinition.onOk = function()
            {
                var dialog = CKEDITOR.dialog.getCurrent();
    			var name = dialog.getValueOf( 'info', 'name' ),
    				value = dialog.getValueOf( 'info', 'value' ),
    				isChecked = ( dialog.getValueOf( 'info', 'checked' ) == true ) ? true : false,
    				element = editor.document.createElement( 'input' );
    
    			if ( this.editMode )
    			{
    				this.radioField.copyAttributes( element, { type: 1, name : 1, value : 1 } );
    				this.radioField.moveChildren( element );
    			}
    
    			element.removeAttribute( '_cke_saved_name' );
    			element.setAttribute( 'name', name );
    			element.setAttribute( 'value', value );
    			
    			var type;
    			if( !isChecked )
    			{
                    type = 'cke_radio';
    				element.removeAttribute( 'checked' );
    			}
                else
    			{
    				type = 'cke_radio_checked';
    				element.setAttribute( 'checked', 'checked' );
    			}
    
    			var fakeElement = editor.createFakeElement( element, type, 'radiofield', false );
    			if ( !this.editMode )
    				editor.insertElement( fakeElement );
    			else
    			{
    				fakeElement.replace( this.radioField );
    				editor.getSelection().selectElement( fakeElement );
    			}
    			
    			return true;
    		};
    	}
    	
    	if ( dialogName == 'checkbox' )
    	{
            dialogDefinition.onLoad = function()
            {
                var dialog = CKEDITOR.dialog.getCurrent();
                dialog.on('show', function()
                {
        			this.checkboxField = false;
        			this.editMode = false;
        			
        			var selection = editor.getSelection(),
        				element = selection.getSelectedElement();
        			
        			if ( element && element.data( 'cke-real-element-type' ) && element.data( 'cke-real-element-type' ) == 'checkboxfield' )
        			{
        				this.editMode = true;
        				this.checkboxField = element;
        				element = editor.restoreRealElement( this.checkboxField );
        				this.setupContent( element );
        				selection.selectElement( this.checkboxField );
        			}
                });
            };
            
            dialogDefinition.onOk = function()
            {
                var dialog = CKEDITOR.dialog.getCurrent();
    			var name = dialog.getValueOf( 'info', 'txtName' ),
    				value = dialog.getValueOf( 'info', 'txtValue' ),
    				isChecked = ( dialog.getValueOf( 'info', 'cmbSelected' ) == true ) ? true : false,
    				element = editor.document.createElement( 'input' );
    
    			if ( this.editMode )
    			{
    				this.checkboxField.copyAttributes( element, { type: 1, name : 1, value : 1 } );
    				this.checkboxField.moveChildren( element );
    			}
    
    			element.removeAttribute( '_cke_saved_name' );
    			element.setAttribute( 'name', name );
    			element.setAttribute( 'value', value );
    			
    			var type;
    			if( !isChecked )
    			{
                    type = 'cke_checkbox';
    				element.removeAttribute( 'checked' );
    			}
                else
    			{
    				type = 'cke_checkbox_checked';
    				element.setAttribute( 'checked', 'checked' );
    			}
    
    			var fakeElement = editor.createFakeElement( element, type, 'checkboxfield', false );
    			if ( !this.editMode )
    				editor.insertElement( fakeElement );
    			else
    			{
    				fakeElement.replace( this.checkboxField );
    				editor.getSelection().selectElement( fakeElement );
    			}
    			
    			return true;
    		};
    	}
    	
    	if ( dialogName == 'select' )
    	{
        	function getOptions( combo )
        	{
        		combo = getSelect( combo );
        		return combo ? combo.getChildren() : false;
        	}
        	
        	function getSelect( obj )
        	{
        		if ( obj && obj.domId && obj.getInputElement().$ )
        			return  obj.getInputElement();
        		else if ( obj && obj.$ )
        			return obj;
        		return false;
        	}
        	
            dialogDefinition.onShow = function()
    		{
    			this.editMode = false;
    			delete this.selectBox;
    			this.setupContent( 'clear' );
    			
    			var selection = editor.getSelection(),
    				element = selection.getSelectedElement();
    			
    			if ( element && element.data( 'cke-real-element-type' ) && element.data( 'cke-real-element-type' ) == 'selectfield' )
    			{
    				this.editMode = true;
    				this.selectBox = element;
    				element = editor.restoreRealElement( this.selectBox );
    				this.setupContent( 'select', element );
    				
    				var objOptions = getOptions( element );
    				for ( var i = 0 ; i < objOptions.count() ; i++ )
    					this.setupContent( 'option', objOptions.getItem( i ) );
    				
    				selection.selectElement( this.selectBox );
    			}
    		};
    		
            dialogDefinition.onOk = function()
    		{
    			var element = editor.document.createElement( 'select' );
    			this.commitContent( element );
    
                var fakeElement;
                var fakeSelect;
                
                if(element.getAttribute( 'size' ) >= 2)
                    fakeSelect = 'cke_selects';
                else
                    fakeSelect = 'cke_select';
                
                fakeElement = editor.createFakeElement( element, fakeSelect, 'selectfield', false );
                
                if ( !this.editMode )
                	editor.insertElement( fakeElement );
                else
                {
                	fakeElement.replace( this.selectBox );
                	editor.getSelection().selectElement( fakeElement );
                }
    		};
    	}
    });
})();

