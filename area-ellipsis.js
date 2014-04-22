window.areaEllipsis = {
	
	responsive: true,
	resizeTimeout: 0,
	data: [],
	
	init: function(params) {
		
		areaEllipsis.responsive = !!((params && params.responsive) || true);
		
		setTimeout(function() {
			areaEllipsis.ellipsis();
		}, 500);
		
		if (areaEllipsis.responsive) {
			areaEllipsis.initEvent();
		}
		
	},
	
	lastChild: function(child) {
		
		var childs,
			childNodes,
			lastCarac,
			innerHTML;
		
		while (child.children.length) {
			
			childNodes	= child.childNodes;
			innerHTML	= child.innerHTML;
			
			innerHTML	= innerHTML.trim();
			lastCarac	= innerHTML.substr(innerHTML.length-1, innerHTML.length);
			
			if (lastCarac !== '>') {
				return child;
			}
			
			childs = child.children;
			child = childs[childs.length-1];
			
		}
		
		return child;
		
	},
	
	childLength: function(el) {
		
		var childs = el.children,
			length = 0;
		
		if (!childs) {
			return 0;
		}
		
		for(var i = 0; i < childs.length; i++) {
			length+= childs[i].offsetHeight;
		}
		
		return length;
		
	},
	
	ellipsis: function(reset) {
		
		var ellipsisList = document.getElementsByClassName('ellipsis');
		
		for (var i = 0; i < ellipsisList.length; i++) {
			
			var ellipsis = ellipsisList[i];
			
			if (reset && ellipsis.getAttribute('ellipsis')) {
				ellipsis.innerHTML = areaEllipsis.data[ellipsis.getAttribute('ellipsis')];
			}
			
			var lastchild	= areaEllipsis.lastChild(ellipsis),
				innerHTML,
				secure = 0,
				force = false,
				diff;
			
			while((diff = (areaEllipsis.childLength(ellipsis)-ellipsis.offsetHeight)) > 0 || force) {
				
				if (secure == 0) {
					var reg = new RegExp("\n|	", 'g');
					ellipsis.setAttribute('ellipsis', areaEllipsis.data.length);
					areaEllipsis.data.push(ellipsis.innerHTML.trim().replace(reg, ''));
				}
				
				innerHTML = lastchild.innerHTML.trim();
				
				if (innerHTML.length > 50 && lastchild.offsetTop > 0 || force) {
					lastchild.innerHTML = innerHTML.substr(0, innerHTML.length-diff)+'...';
					force = false;
				} else if(lastchild != ellipsis && lastchild.nodeName != '#text') {
					lastchild.parentNode.removeChild(lastchild);
					force = true;
				}
				
				if (secure++ > 5000) {
					break;
				}
				
				lastchild = areaEllipsis.lastChild(ellipsis);
				
			}
			
		}
		
	},
	
	addEventListener: function(el, eventName, handler) {
		if (el.addEventListener) {
			el.addEventListener(eventName, handler);
		} else {
			el.attachEvent('on' + eventName, function(){
				handler.call(el);
			});
		}
	},
		
	
	initEvent: function() {
		
		var funcResize = function() {
			
			if (areaEllipsis.resizeTimeout) {
				clearTimeout(areaEllipsis.resizeTimeout);
				areaEllipsis.resizeTimeout = 0;
			}
			
			areaEllipsis.resizeTimeout = setTimeout(function() {
				
				areaEllipsis.ellipsis(true);
				
			}, 300);
			
		};
		
		areaEllipsis.addEventListener(window, 'resize', funcResize);
		
	}
	
};

window.areaEllipsis.init();