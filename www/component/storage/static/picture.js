function picture(container,url,max_width,max_height,title) {
	if (typeof container == 'string') container = document.getElementById(container);
	var img = document.createElement("IMG");
	img.src = url+"&max_width="+max_width+"&max_height="+max_height;
	img.style.cursor = "pointer";
	img.onclick = function() {
		add_stylesheet("/static/common/js/popup_window/popup_window.css");
		add_javascript("/static/common/js/popup_window/popup_window.js",function() {
			var i = document.createElement("IMG");
			var p = new popup_window(title,null,i);
			i.src = url;
			p.show();
			i.onload = function() {
				p.resize();
			}
		});
	};
	container.appendChild(img);
}