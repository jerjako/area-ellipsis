function lastChild(child) {
	
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
}

function ellipsis(reset) {
	
	var ellipsisList = document.getElementsByClassName('ellipsis');
	
	for (var i = 0; i < ellipsisList.length; i++) {
		
		var ellipsis	= ellipsisList[i];
		
		if (reset) {
			ellipsis.innerHTML = ellipsis.dataset.ellipsis;
		}
		
		var lastchild	= lastChild(ellipsis),
			innerHTML,
			j = 0;
		
		while(lastchild.offsetHeight+lastchild.offsetTop > ellipsis.offsetHeight || lastchild.offsetTop <= 0) {
			
			if (j == 0) {
				var reg = new RegExp("\n|	", 'g');
				ellipsis.dataset.ellipsis = ellipsis.innerHTML.trim().replace(reg, '');
			}
			
			innerHTML = lastchild.innerHTML.trim();
			
			if (innerHTML.length > 50 && lastchild.offsetTop > 0) {
				lastchild.innerHTML = innerHTML.substr(0, innerHTML.length-7)+'...';
			} else if(lastchild.nodeName != '#text') {
				lastchild.parentNode.removeChild(lastchild);
			}
			
			if (j++ > 50) break;
			
			lastchild = lastChild(ellipsis);
			
		}
		
	}
	
}

var resizeTimeout = 0;
window.addEventListener('resize', function() {
	
	if (resizeTimeout) {
		clearTimeout(resizeTimeout);
		resizeTimeout = 0;
	}
	
	resizeTimeout = setTimeout(function() {
		
		ellipsis(true);
		
	}, 300);
	
});

setTimeout(function() {
	ellipsis();
}, 500);