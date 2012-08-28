/**
 *  SBETabs - S.imple B.its E.nhanced Tabs    
 *  Description: Manage your own tabs (very simply)
 *
 *  Notes: Originally I found the code in Simple Bits CSS Tabs located at 
 *      http://www.simplebits.com/bits/css_tabs.html , hence the class name, but I wrote this javascript 
 *      class code from scratch to make it easier to do tab-switching, create dynamic tabs, etc. 
 *    
 *  Author: Jim Kinsman
 *  Version: 0.987
 *  Copyright (C) 2012
 **/
SBETabs = function(opts){
   if (!opts || typeof(opts) != 'object' || opts.length == 0){
      opts = {};
   }
   if (!opts.ul || opts.ul.tagName != 'UL'){
	  if (!opts.container){
	     throw ('UL is invalid and no container specified, so cannot create');
	  }else{
	     opts.ul = document.createElement('ul');
		 opts.ul.className = 'sbetabs';
		 opts.container.appendChild(opts.ul);
	  }
   }
   if (typeof(opts.startSelected) == 'undefined'){
      opts.startSelected = 0;
   }
   
   if (typeof(opts.OnSelect) == 'function'){
      this.OnSelect = opts.OnSelect;
   }
   if (typeof(opts.OnRemove) == 'function'){
      this.OnRemove = opts.OnRemove;
   }
   
   this.__opts = opts;
   this.__ul = opts.ul;
   this.__lastSelected = 0;  
   
   if (typeof(opts.tabs) == 'object' && opts.tabs.length > 0){
       for (var i = 0; i < opts.tabs.length; ++i){
	      this.addTab(opts.tabs[i]);
	   }
   }
   this.__init();
};

SBETabs.prototype.getSelectedTab = function(){
    var anchors = this.__ul.getElementsByTagName('A');
    for (var i = 0; i < anchors.length; ++i){
		if (anchors[i].className == 'active'){
		   return anchors[i];
		}
	}
	return false; //no active tabs (this isn't really possible)
}

SBETabs.prototype.getTab = function(tab_index){
    var anchors = this.__ul.getElementsByTagName('A');
    if (typeof(anchors[tab_index])=='undefined'){ return false; }
	else {
	   return anchors[tab_index];
	}
}

SBETabs.prototype.getTabCount = function(){
   var anchors = this.__ul.getElementsByTagName('A');
   return anchors.length;
}

SBETabs.prototype.removeTab = function(tab_index){
   var a = this.getTab(tab_index);
   if (a && a.tagName == 'A'){
      var tab_name = a.innerHTML;
	  a.parentNode.parentNode.removeChild(a.parentNode);
	  this.OnRemove(tab_name, tab_index);
   }
}

SBETabs.prototype.addTab = function(tab_name){
	var li = document.createElement('li');
	var a = document.createElement('a');
	a.href = '#' + tab_name.replace(/\s*/g,'');
	a.innerHTML = tab_name;
	var self = this;
	a.onclick = function(){
		  self.clickTab(this);
		  return false; //do not go to href
	}
	li.appendChild(a);
	this.__ul.appendChild(li);
	return a;
}
SBETabs.prototype.addButton = function(tab_name, onclick){
   var a = this.addTab(tab_name);
   a.onclick = onclick;
   //a.style.padding = '2px 5px 2px 5px';
   return a;
}
SBETabs.prototype.__init = function(){
	  var anchors = this.__ul.getElementsByTagName('A');
	  var self = this;
	  for (var i = 0; i < anchors.length; ++i){
	    anchors[i].onclick = function(){
		  self.clickTab(this);
		  return false; //do not go to href
		}
		anchors[i].href = '#' + anchors[i].innerHTML.replace(/\s*/g,'');
	    if (i === this.__opts.startSelected){
		   anchors[i].className = 'active';
		   anchors[i].onclick();
		}else{
	       anchors[i].className = '';
		}
	  }
}
SBETabs.prototype.OnSelect = function(tab_name, tab_index){
      //do nothing -- user should override this function to acutally make tab switching do something
	  //alert('SBETabs.OnSelect("' + tab_name + '", ' + tab_index + ');');
}

SBETabs.prototype.OnRemove = function(tab_name, tab_index){
      //do nothing -- user should override this function to acutally make tab removing do something
}

SBETabs.prototype.visuallySelect = function(a_tag, unselect){
	  //visual effect - make tab look selected, all others unselected
	  if (typeof(unselect) == 'undefined'){ unselect = true; }
	  var anchors = this.__ul.getElementsByTagName('A');
	  for (var i = 0; i < anchors.length; ++i){
	     if (anchors[i] != a_tag){
		    if (unselect){ anchors[i].className = ''; }
		 }else{
		   this.__lastSelected = i;
		 }
	  }
	  a_tag.className = 'active';
	  return this.__lastSelected;
}
SBETabs.prototype.clickTab = function(a_tag){
  if (!isNaN(a_tag)){
      var i = a_tag;
      //a_tag is actually a number (pretend it is the index of the tab we want
	  var anchors = this.__ul.getElementsByTagName('A');
	  if (anchors[i]){
	      a_tag = anchors[i];
	  }else{
	     return false;
	  }
  }
  if (a_tag && a_tag.innerHTML){
     this.OnSelect(a_tag.innerHTML, this.visuallySelect(a_tag), a_tag);
  }
};
