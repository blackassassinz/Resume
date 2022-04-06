!function(a,b){"use strict";function c(a,d){var e=this;return d=d||{},d=b.extend({readOnly:!1,chooseNodeInForm:!1,onSelect:!1,treeID:!1,onClick:!1,allowFolderSelection:!0,selectNodesByKey:[],removeNodesByKey:[],removeNodesByCallback:!1,ajaxData:{}},d),e.options=d,e.$element=a,e.setupTree(),d.chooseNodeInForm||d.onClick||c.setupTreeEvents(e),e.$element}c.prototype={dragRequest:function(a,c,d,e){var f=c.parent.data.treeNodeID;"over"==d&&(f=c.data.treeNodeID),jQuery.fn.dialog.showLoader();var g=[{name:"sourceTreeNodeID",value:a.data.treeNodeID},{name:"treeNodeParentID",value:f}];b.concreteAjax({data:g,url:CCM_DISPATCHER_FILENAME+"/ccm/system/tree/node/drag_request",success:function(a){e&&e()}})},setupTree:function(){var a=this,c=a.options,d={},e=!1,f={};0!=a.options.ajaxData&&(f=a.options.ajaxData),c.treeNodeParentID?f.treeNodeParentID=c.treeNodeParentID:f.treeID=c.treeID,c.allowFolderSelection&&(f.allowFolderSelection=1);var g=!0;c.chooseNodeInForm&&(e=!0,g=!1,d={checkbox:"fancytree-radio"},c.selectNodesByKey.length&&(f.treeNodeSelectedIDs=c.selectNodesByKey)),"multiple"===c.chooseNodeInForm&&(e=!0,g=!1,d={checkbox:"fancytree-checkbox"},c.selectNodesByKey.length&&(f.treeNodeSelectedIDs=c.selectNodesByKey));var h=1;c.selectMode&&(h=c.selectMode);var i=2;c.minExpandLevel&&(i=c.minExpandLevel);var j;j=c.treeNodeParentID?CCM_DISPATCHER_FILENAME+"/ccm/system/tree/node/load_starting":CCM_DISPATCHER_FILENAME+"/ccm/system/tree/load",b(a.$element).fancytree({tabindex:null,titlesTabbable:!1,extensions:["glyph","dnd"],glyph:{map:{doc:"fa fa-file-o",docOpen:"fa fa-file-o",checkbox:"fa fa-square-o",checkboxSelected:"fa fa-check-square-o",checkboxUnknown:"fa fa-share-square",dragHelper:"fa fa-share",dropMarker:"fa fa-angle-right",error:"fa fa-warning",expanderClosed:"fa fa-plus-square-o",expanderLazy:"fa fa-plus-square-o",expanderOpen:"fa fa-minus-square-o",loading:"fa fa-spin fa-refresh"}},source:{url:j,type:"post",data:f},lazyLoad:function(b,c){c.result=a.getLoadNodePromise(c.node)},select:function(a,d){if(c.chooseNodeInForm){var e=b.map(d.tree.getSelectedNodes(),function(a){return a.key});c.onSelect(e)}},selectMode:h,checkbox:e,minExpandLevel:i,clickFolderMode:1,init:function(){var d=a.$element;if(c.removeNodesByKey.length)for(var e=0;e<c.removeNodesByKey.length;e++){var f=c.removeNodesByKey[e],g=d.fancytree("getTree").getNodeByKey(String(f));g&&g.remove()}c.readOnly&&d.fancytree("disable");var h;if(c.chooseNodeInForm&&(h=d.fancytree("getTree"),h=h.getSelectedNodes(),h.length)){var i=b.map(h,function(a){return a.key});c.onSelect(i)}h&&b.map(h,function(a){a.makeVisible()})},click:function(a,d){if("expander"==d.targetType)return!0;if("icon"==d.targetType)return!1;if(c.onClick)return c.onClick(d.node,a);if(c.chooseNodeInForm&&"checkbox"!=d.targetType)return!1;if(!d.targetType)return!1;if(!c.chooseNodeInForm&&a.originalEvent.target&&b(a.originalEvent.target).hasClass("fancytree-title")){var e=d.node.data.treeNodeMenu;if(e){var f=new ConcreteMenu(b(d.node.span),{menu:e,handle:"none"});f.show(a)}}return!0},dnd:{preventRecursiveMoves:!0,focusOnClick:!0,preventVoidMoves:!0,dragStart:function(a,b){return!c.chooseNodeInForm},dragStop:function(a,b){return!0},dragEnter:function(a,b){var c=b.otherNode,d=b.hitMode;return!(!a.parent.data.treeNodeID&&"1"!==a.data.treeNodeID)&&(("over"==d||1!=a.data.treeNodeID)&&(c.data.treeNodeID!=a.data.treeNodeID&&(!(!a.data.treeNodeID&&"after"==d)&&!a.isDescendantOf(c))))},dragDrop:function(c,d){a.dragRequest(d.otherNode,c,d.hitMode,function(){d.otherNode.moveTo(c,d.hitMode);var a=d.otherNode.parent.data.treeNodeID;"over"==d.hitMode&&(a=c.data.treeNodeID);var e=[{name:"sourceTreeNodeID",value:d.otherNode.data.treeNodeID},{name:"treeNodeParentID",value:a}],f=c.parent.getChildren();if(f)for(var g=0;g<f.length;g++){var h=f[g];e.push({name:"treeNodeID[]",value:h.data.treeNodeID})}b.concreteAjax({data:e,url:CCM_DISPATCHER_FILENAME+"/ccm/system/tree/node/update_order"})})}}})},getLoadNodePromise:function(a){var c=this,d=0!=c.options.ajaxData?c.options.ajaxData:{};return d.treeNodeParentID=a.data.treeNodeID,b.when(b.getJSON(CCM_DISPATCHER_FILENAME+"/ccm/system/tree/node/load",d))},reloadNode:function(a,b){this.getLoadNodePromise(a).done(function(c){a.removeChildren(),a.addChildren(c),a.setExpanded(!0,{noAnimation:!0}),b&&b()})},cloneNode:function(a){var c=this,d=b("[data-tree="+c.options.treeID+"]");return b.ajax({dataType:"json",type:"post",data:{treeNodeID:a,token:CCM_SECURITY_TOKEN},url:CCM_DISPATCHER_FILENAME+"/ccm/system/tree/node/duplicate",success:function(a){if(1==a.error)ConcreteAlert.dialog(ccmi18n.error,a.errors.join("<br>"));else{jQuery.fn.dialog.closeTop();var b=d.fancytree("getTree").getNodeByKey(String(a.treeNodeParentID));jQuery.fn.dialog.showLoader(),c.reloadNode(b,function(){jQuery.fn.dialog.hideLoader()})}},error:function(a){ConcreteAlert.dialog(ccmi18n.error,'<div class="alert alert-danger">'+a.responseText+"</div>")},complete:function(){jQuery.fn.dialog.hideLoader()}}),!1}},c.setupTreeEvents=function(a){ConcreteEvent.unsubscribe("ConcreteMenuShow"),ConcreteEvent.subscribe("ConcreteMenuShow",function(c,d){var e=d.menuElement;e.find("a[data-tree-action]").on("click.concreteMenu",function(c){c.preventDefault();var d=b(this).attr("data-tree-action-url"),e=b(this).attr("data-tree-action"),f=b(this).attr("dialog-title"),g=b(this).attr("dialog-width"),h=b(this).attr("dialog-height");switch(e){case"clone-node":a.cloneNode(b(this).attr("data-tree-node-id"));break;default:if(!f)switch(e){case"add-node":f=ccmi18n_tree.add;break;case"edit-node":f=ccmi18n_tree.edit;break;case"delete-node":f=ccmi18n_tree.delete}g||(g=550),h||(h="auto"),jQuery.fn.dialog.open({title:f,href:d,width:g,modal:!0,height:h})}})}),ConcreteEvent.subscribe("ConcreteTreeAddTreeNode.concreteTree",function(c,d){var e,f=b("[data-tree="+a.options.treeID+"]"),g=d.node;if(g.length)for(var h=0;h<g.length;h++)e=f.fancytree("getTree").getNodeByKey(String(g[h].treeNodeParentID)),e.addChildren(g);else e=f.fancytree("getTree").getNodeByKey(String(g.treeNodeParentID)),e.addChildren(g)}),ConcreteEvent.subscribe("ConcreteTreeUpdateTreeNode.concreteTree",function(c,d){var e=b("[data-tree="+a.options.treeID+"]"),f=e.fancytree("getTree").getNodeByKey(String(d.node.key));f.fromDict(d.node),f.render()}),ConcreteEvent.subscribe("ConcreteTreeDeleteTreeNode.concreteTree",function(c,d){var e=b("[data-tree="+a.options.treeID+"]"),f=e.fancytree("getTree").getNodeByKey(String(d.node.treeNodeID));f.remove()})},b.fn.concreteTree=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteTree=c}(this,jQuery);