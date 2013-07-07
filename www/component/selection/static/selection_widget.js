var _selection_widgets = [];
function selection_widget(name) {
	var t=this;
	t.name = name;
	_selection_widgets.push(t);
	t.container = document.getElementById(name+'_content');
	t.scripts = [];
	t.refresh = function() {
		for (var i = 0; i < t.scripts.length; ++i)
			t.scripts[i].parentNode.removeChild(t.scripts[i]);
		t.scripts = [];
		ajax.call("GET","/dynamic/selection/page/widget_"+name,null,null,
			function(error){
				t.container.innerHTML = "<span style='color:red'>"+error+"</span>";
			},function(xhr){
				var s = xhr.responseText;
				var i = s.indexOf("<body");
				if (i < 0) {
					t.container.innerHTML = s;
					return;
				}
				var j = s.indexOf(">",i);
				var k = s.indexOf("</body>");
				var html = s.substring(j+1,k);
				var h = document.getElementsByTagName("HEAD")[0];
				i = s.indexOf("<head>");
				if (i > 0) {
					j = s.indexOf("</head>");
					var head = s.substring(i+6,j);
					var tmp = document.createElement("DIV");
					tmp.innerHTML = head;
					for (i = 0; i < tmp.childNodes.length; ++i) {
						var n = tmp.childNodes[i];
						if (n.nodeName == "SCRIPT")
							add_javascript(n.src);
						else if (n.nodeName == "LINK" && n.rel == "stylesheet")
							add_stylesheet(n.href);
					}
				}
				var i = 0;
				while ((i = html.indexOf("<script")) >= 0) {
					var k = html.indexOf(">",i);
					var j = html.indexOf("</script>", k+1);
					var script = document.createElement("SCRIPT");
					script.type = "text/javascript";
					script.text = html.substring(k+1,j);
					html = html.substring(0,i)+html.substring(j+9);
					h.appendChild(script);
					t.scripts.push(script);
				}
				t.container.innerHTML = html;
			}
		);
	}
	t.refresh();
}
function get_selection_widget(name) {
	for (var i = 0; i < _selection_widgets.length; ++i)
		if (_selection_widgets[i].name == name)
			return _selection_widgets[i];
	return null;
}