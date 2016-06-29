/*
 * TextSignature Plugin for CKEditor (http://ckeditor.com/addon/textsignature)
 * Created by ALL-INKL.COM - Neue Medien M�nnich - 27. Jan 2014
 * Licensed under the terms of GPL, LGPL and MPL licenses.
 */
CKEDITOR.plugins.add("textsignature", {
    init	: 	function(){},

	/*
	 * Set the signature at the top or bottom
	 * editor: CKEDITOR Instance
	 * s: (string) Signature text or empty
	 * pos: (string) top or bottom
	 * id: (string) id for the signature node
	 */
	set		: 	function(editor, s, pos, id){

					/* Focus CKEditor Instance and save snapshot for redo/undo */
					editor.focus();
					editor.fire("saveSnapshot");

					/* Get nodes */
					var doc = null, body = null, node = null;
					try {
						doc = editor.document.$;
						body = editor.document.getBody().$;
					} catch(e) { doc = body = null; }
					if(!doc || !body) return false;

					/* Signature at the bottom will be removed */
					if(!pos || pos == "bottom") {
						node = doc.getElementById(id);
						if(node && node.parentNode && node.parentNode.removeChild) node.parentNode.removeChild(node);
						node = null;
					}

					/* Get signature node */
					node = doc.getElementById(id);
					if(node) {

						/* Signature node found. Set the innerHTML or empty */
						var cknode = new CKEDITOR.dom.element(node);
						if(cknode) {
							cknode.setHtml(s);
							if(s == "") cknode.addClass(id+"-empty"); else cknode.removeClass(id+"-empty");
							if(body.firstChild === node) this.prependHTML(doc, body, "<br/>");
						}

					} else {

						/* No signature node. Create new signature node */

						/* Delete empty rows */
						if(!pos || pos == "bottom") var neighborFn = "previousSibling", startNodeFn = "lastChild", insertFn = "append"; else var neighborFn = "nextSibling", startNodeFn = "firstChild", insertFn = "prepend";
						var node = body[startNodeFn], neighbor = null, deletedBr = 0;
						while(node && deletedBr < 3) {
							neighbor = node[neighborFn];
							if(node.nodeType == 1 && node.nodeName && node.nodeName.toLowerCase() == "br") {
								body.removeChild(node);
								deletedBr++;
							}
							else if(this.isEmptyNode(node)) body.removeChild(node);
							else break;
							node = neighbor;
						}

						/* Insert signature */
						if(s == "") s = '<div id="'+id+'" class="'+id+'-empty"></div>'; else s = '<div id="'+id+'">'+s+'</div>';
						if((pos && pos == "top") || this.isEmptyNode(body)) s = "<br/>"+s;
						if(insertFn == "prepend") this.prependHTML(doc, body, s);
						else {
							var ckbody = new CKEDITOR.dom.element(body);
							if(ckbody) ckbody.appendHtml(s);
						}

					}

					/* Scroll to focused point */
					editor.getSelection().scrollIntoView();

					/* Save Snapshot for Redo/Undo */
					editor.fire("saveSnapshot");

					return true;
				},

	/* Check if node contains visible text or images */
	isEmptyNode	: function(node) {
		if(node) {
			if(node.nodeType == 3) {
				var text = node.nodeValue;
				text = text.replace(/\u200B|&#8203;|\s/g, "");
				if(text.length == 0) return true;
			} else {
				if(node.nodeType == 1) {
					if(node.nodeName.toLowerCase() == "img") return false;
					var cknode = new CKEDITOR.dom.element(node);
					if(cknode && cknode.find("img").length > 0) return false;
				}
				var text = "";
				try { if("textContent" in node) text = String(node.textContent); else text = String(node.innerText); } catch(e) { text = ""; }
				text = text.replace(/\u200B|&#8203;|\s/g, "");
				if(text.length == 0) return true;
			}
		}
		return false;
	},

	/* Add HTML at the beginning of a node */
	prependHTML : function(doc, n, html){
		if(n) {
			if(n.insertAdjacentHTML) {
				try { n.insertAdjacentHTML("afterBegin", html); } catch(e) {}
			} else {
				var range = null;
				if(doc && doc.createRange) range = doc.createRange();
				if(range && range.createContextualFragment) {
					if(n.firstChild) n.insertBefore(range.createContextualFragment(html), n.firstChild);
					else n.appendChild(range.createContextualFragment(html));
				}
			}
		}
	}
});
