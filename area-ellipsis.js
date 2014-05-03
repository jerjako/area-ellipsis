if(typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, ''); 
	};
}

if (!window.getComputedStyle) {
	window.getComputedStyle = function(el, pseudo) {
		this.el = el;
		this.getPropertyValue = function(prop) {
			var re = /(\-([a-z]){1})/g;
			if (prop == 'float') prop = 'styleFloat';
			if (re.test(prop)) {
				prop = prop.replace(re, function () {
					return arguments[2].toUpperCase();
				});
			}
			return el.currentStyle[prop] ? el.currentStyle[prop] : null;
		}
		return this;
	}
}

window.areaEllipsis = {
	
	responsive: true,
	resizeTimeout: 0,
	data: [],
	
	init: function(params) {
		
		window.areaEllipsis.responsive = !!((params && params.responsive) || true);
		
		setTimeout(function() {
			window.areaEllipsis.ellipsis();
		}, 500);
		
		if (window.areaEllipsis.responsive) {
			window.areaEllipsis.initEvent();
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
		
		var ellipsisList = document.querySelectorAll('.ellipsis');
		
		for (var i = 0; i < ellipsisList.length; i++) {
			
			var ellipsis = ellipsisList[i];
			
			if (reset && ellipsis.getAttribute('ellipsis')) {
				ellipsis.innerHTML = window.areaEllipsis.data[ellipsis.getAttribute('ellipsis')];
			}
			
			var lastchild	= window.areaEllipsis.lastChild(ellipsis),
				innerHTML,
				secure = 0,
				force = false,
				diff,
				diffHTML,
				padding = parseInt(window.getComputedStyle(ellipsis, null).getPropertyValue('padding-top'), 10) + parseInt(window.getComputedStyle(ellipsis, null).getPropertyValue('padding-bottom'), 10);

			while((diff = (window.areaEllipsis.childLength(ellipsis)-(ellipsis.offsetHeight-padding))) > 0 || force) {
				
				if (secure === 0) {
					ellipsis.setAttribute('ellipsis', window.areaEllipsis.data.length);
					window.areaEllipsis.data.push(ellipsis.innerHTML.trim());
				}
				
				innerHTML = lastchild.innerHTML.trim();
				diffHTML = (innerHTML.length-(innerHTML.length*0.1));
				
				if ((innerHTML.length > 50 && lastchild.offsetTop > 0 || force) && diffHTML > 0) {
					lastchild.innerHTML = innerHTML.substr(0, diffHTML)+'...';
					force = false;
				} else if(lastchild != ellipsis && lastchild.nodeName != '#text') {
					lastchild.parentNode.removeChild(lastchild);
					force = true;
				}
				
				if (secure++ > 5000) {
					break;
				}
				
				lastchild = window.areaEllipsis.lastChild(ellipsis);
				
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
			
			if (window.areaEllipsis.resizeTimeout) {
				clearTimeout(window.areaEllipsis.resizeTimeout);
				window.areaEllipsis.resizeTimeout = 0;
			}
			
			window.areaEllipsis.resizeTimeout = setTimeout(function() {
				
				window.areaEllipsis.ellipsis(true);
				
			}, 100);
			
		};
		
		window.areaEllipsis.addEventListener(window, 'resize', funcResize);
		
	}
	
};

window.areaEllipsis.init();