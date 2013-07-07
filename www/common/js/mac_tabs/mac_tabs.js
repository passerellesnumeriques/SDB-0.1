function mac_tabs() {
	var t=this;
	t.element = document.createElement("DIV");
	t.element.className = "mac_tabs";
	setBorderRadius(t.element, 5, 5, 5, 5, 5, 5, 5, 5);
	t.addItem = function(content,id) {
		var div = document.createElement("DIV");
		div.className = "mac_tab";
		if (typeof content == "string")
			div.innerHTML = content;
		else
			div.appendChild(content);
		div.style.backgroundColor = "#D0D0D0";
		div.style.cursor = "pointer";
		setBackgroundGradient(div, "vertical", [{pos:0,color:"#F0F0F0"},{pos:100,color:"#D0D0D0"}]);
		div.data = id;
		t.element.appendChild(div);
		div.onclick = function() { t.select(this.data); };
		t.update_radius();
	};
	t.update_radius = function() {
		for (var i = 0; i < t.element.childNodes.length; ++i) {
			if (i > 0 && i < t.element.childNodes.length-1) continue;
			var tl = 5,tr = 5,bl = 5,br = 5;
			if (i == 0) { tr = 0; br = 0; }
			if (i == t.element.childNodes.length-1) { tl = 0; bl = 0; }
			setBorderRadius(t.element.childNodes[i], tl, tl, tr, tr, bl, bl, br, br);
		}
	};
	t.select = function(id) {
		for (var i = 0; i < t.element.childNodes.length; ++i) {
			var tab = t.element.childNodes[i];
			if (tab.data == id) {
				tab.style.backgroundColor = "#A0A0A0";
				setBackgroundGradient(tab, "vertical", [{pos:0,color:"#C0C0C0"},{pos:50,color:"#A0A0A0"},{pos:100,color:"#C0C0C0"}]);
			} else {
				tab.style.backgroundColor = "#D0D0D0";
				setBackgroundGradient(tab, "vertical", [{pos:0,color:"#F0F0F0"},{pos:100,color:"#D0D0D0"}]);
			}
		}
		if (t.onselect) t.onselect(id);
	};
}