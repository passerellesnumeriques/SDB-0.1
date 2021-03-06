/* Add some useful functions to basic classes */
String.prototype.startsWith=function(s){return this.length<s.length?false:this.substring(0,s.length)==s;};
String.prototype.trim=function() {
	if (this.length == 0) return "";
	var start, end;
	for (start = 0; start < this.length; start++)
		if (!isSpace(this.charAt(start))) break;
	for (end = this.length; end > 0; end--)
		if (!isSpace(this.charAt(end-1))) break;
	return this.substring(start, end);
};
function isSpace(c) { return (c == ' ' || c == '\t' || c == '\r' || c == '\n'); }
function isLetter(c) {
	var ord = c.charCodeAt(0);
	if (ord >= 'a'.charCodeAt(0) && ord <= 'z'.charCodeAt(0)) return true;
	if (ord >= 'A'.charCodeAt(0) && ord <= 'Z'.charCodeAt(0)) return true;
	return false;
}
Array.prototype.contains=function(e){for(var i=0;i<this.length;++i)if(this[i]==e)return true;return false;};
Array.prototype.remove=function(e){for(var i=0;i<this.length;++i)if(this[i]==e){this.splice(i,1);i--;};};

function object_copy(o, recursive_depth) {
	var c = new Object();
	for (var attr in o) {
		var value = o[attr];
		if (!recursive_depth) { c[attr] = value; continue; }
		if (typeof value == 'object') {
			if (value instanceof Date)
				c[attr] = new Date(value.getTime());
			else {
				c[attr] = object_copy(value, recursive_depth-1);
			}
		} else
			c[attr] = value;
	}
	return c;
}

/* Made some function cross-browser compatible */
lc_browser = {
	agent_infos: [],
	IE: 0,
	Chrome: 0,
	WebKit: 0,
	Safari: 0, SafariBrowser: 0,
	FireFox: 0,
	Opera: 0, OperaBrowser: 0,
	Presto: 0,
	Version: 0,
	detect: function() {
		var s = navigator.userAgent;
		do {
			var i = s.indexOf('/');
			if (i < 0) break;
			var name = s.substring(0, i).trim();
			s = s.substring(i+1);
			i = s.indexOf(' ');
			if (i < 0) i = s.length;
			var version = s.substring(0, i).trim();
			s = s.substring(i+1);
			var infos = [];
			if (s.length > 0 && s.charAt(0) == '(') {
				i = s.indexOf(')', 1);
				if (i > 0) {
					var ss = s.substring(1, i).trim();
					s = s.substring(i+1);
					while (ss.length > 0) {
						i = ss.indexOf(';');
						if (i < 0) i = ss.length;
						infos.push(ss.substring(0, i).trim());
						ss = ss.substring(i+1).trim();
					}
				}
			}
			this.agent_infos.push({
				name: name,
				version: version,
				infos: infos
			});
		} while (s.length > 0)
		this.fill();
	},
	fill: function() {
		for (var i = 0; i < this.agent_infos.length; ++i) {
			var a = this.agent_infos[i];
			switch (a.name.toLowerCase()) {
			case "mozilla":
				for (var j = 0; j < a.infos.length; ++j) {
					var s = a.infos[j];
					if (s.substr(0,5).toLowerCase() != "msie ") continue;
					this.IE = parseFloat(s.substring(5));
				}
				break;
			case "chrome": this.Chrome = parseFloat(a.version); break;
			case "applewebkit": this.WebKit = parseFloat(a.version); break;
			case "safari": this.Safari = parseFloat(a.version); break;
			case "firefox": this.FireFox = parseFloat(a.version); break;
			case "opera": this.Opera = parseFloat(a.version); break;
			case "presto": this.Presto = parseFloat(a.version); break;
			case "version": this.Version = parseFloat(a.version); break;
			}
		}
		if (this.Safari > 0 && this.Version > 0) this.SafariBrowser = this.Version;
		if (this.Opera > 0) { if (this.Version > 0) this.OperaBrowser = this.Version; else this.OperaBrowser = this.Opera; }
	}
};
lc_browser.detect();

if (typeof document.getElementById != "function")
	document.getElementById = function(id) { return document.all[id]; }
if (typeof document.getElementsByClassName!='function') {
    document.getElementsByClassName = function() {
        var elms = document.getElementsByTagName('*');
        var ei = new Array();
        for (i=0;i<elms.length;i++) {
            if (elms[i].getAttribute('class')) {
                ecl = elms[i].getAttribute('class').split(' ');
                for (j=0;j<ecl.length;j++) {
                    if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
                        ei.push(elms[i]);
                    }
                }
            } else if (elms[i].className) {
                ecl = elms[i].className.split(' ');
                for (j=0;j<ecl.length;j++) {
                    if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
                        ei.push(elms[i]);
                    }
                }
            }
        }
        return ei;
    }
}
getIFrameDocument = function(frame) {
	if (frame.contentDocument) return frame.contentDocument;
	if (frame.document) return frame.document;
	return frame.contentWindow.document;
}
getIFrameWindow = function(frame) {
	if (frame.contentWindow) return frame.contentWindow;
	return frame.contentDocument.window;
}

if (typeof getComputedStyle == "undefined") {
	getComputedStyle = function(e,n) {
		return e.currentStyle;
	};
}
if (typeof XMLHttpRequest == "undefined")
	XMLHttpRequest = function () {
	    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
	      catch (e) {}
	    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
	      catch (e) {}
	    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
	      catch (e) {}
	    //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
	    throw new Error("This browser does not support XMLHttpRequest.");
	};

function setOpacity(element, opacity) {
	element.style.opacity = opacity;
	element.style.MozOpacity = opacity;
	element.style.KhtmlOpacity = opacity;
	opacity = Math.round(opacity*100);
	element.style.filter = "alpha(opacity="+opacity+");"
	element.style.MsFilter = "progid:DXImageTransform.Microsoft.Alpha(Opacity="+opacity+")";	
}
function setBoxShadow(elem,a,b,c,d,color) { 
	elem.style.boxShadow = a+"px "+b+"px "+c+"px "+d+"px "+color;
	elem.style.MozBoxShadow = a+"px "+b+"px "+c+"px "+d+"px "+color;
	elem.style.WebkitBoxShadow = a+"px "+b+"px "+c+"px "+d+"px "+color;
}
function setBorderRadius(elem, 
		topleft_width, topleft_height, 
		topright_width, topright_height, 
		bottomleft_width, bottomleft_height, 
		bottomright_width, bottomright_height
		) {
	elem.style.borderTopLeftRadius = topleft_width+"px "+topleft_height+"px"; 
	elem.style.borderTopRightRadius = topright_width+"px "+topright_height+"px"; 
	elem.style.borderBottomLeftRadius = bottomleft_width+"px "+bottomleft_height+"px"; 
	elem.style.borderBottomRightRadius = bottomright_width+"px "+bottomright_height+"px"; 
	elem.style.MozBorderRadiusTopleft = topleft_width+"px "+topleft_height+"px"; 
	elem.style.MozBorderRadiusTopright = topright_width+"px "+topright_height+"px"; 
	elem.style.MozBorderRadiusBottomleft = bottomleft_width+"px "+bottomleft_height+"px"; 
	elem.style.MozBorderRadiusBottomright = bottomright_width+"px "+bottomright_height+"px"; 
	elem.style.WebkitBorderTopLeftRadius = topleft_width+"px "+topleft_height+"px"; 
	elem.style.WebkitBorderTopRightRadius = topright_width+"px "+topright_height+"px"; 
	elem.style.WebkitBorderBottomLeftRadius = bottomleft_width+"px "+bottomleft_height+"px"; 
	elem.style.WebkitBorderBottomRightRadius = bottomright_width+"px "+bottomright_height+"px"; 
}
function setBackgroundGradient(element, orientation, stops) {
	var start_pos;
	switch (orientation) {
	case "horizontal": start_pos = "left"; break;
	case "vertical": start_pos = "top"; break;
	case "diagonal-topleft": start_pos = "-45deg"; break;
	case "diagonal-bottomleft": start_pos = "45deg"; break;
	case "radial": start_pos = "center"; break;
	}
	if (lc_browser.IE >= 6 && lc_browser.IE <= 9) {
		var gt = orientation == "vertical" ? 0 : 1; // fallback to horizontal if diagonal or radial
		element.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr='"+stops[0].color+"',endColorstr='"+stops[stops.length-1].color+"',GradientType="+gt+")";
	} else if (lc_browser.IE >= 10) {
		var b = "-ms-"+(orientation == "radial" ? "radial" : "linear")+"-gradient("+start_pos;
		for (var i = 0; i < stops.length; ++i)
			b += ","+stops[i].color+" "+stops[i].pos+"%";
		b += ")";
		element.style.background = b;
	} else if (lc_browser.Chrome >= 10 || lc_browser.SafariBrowser >= 5.1) {
		var b = "-webkit-"+(orientation == "radial" ? "radial" : "linear")+"-gradient("+start_pos;
		for (var i = 0; i < stops.length; ++i)
			b += ","+stops[i].color+" "+stops[i].pos+"%";
		b += ")";
		element.style.background = b;
	} else if (lc_browser.Chrome > 0 || lc_browser.SafariBrowser >= 4) {
		if (orientation == "radial") {
			var b = "-webkit-gradient(radial, center center, 0px, center center, 100%";
			for (var i = 0; i < stops.length; ++i)
				b += ",color-stop("+stops[i].pos+"%,"+stops[i].color+")";
			b += ")";
			element.style.background = b;
		} else {
			var b = "-webkit-gradient(linear,";
			switch (orientation) {
			case "horizontal": b += "left top, right top"; break;
			case "vertical": b += "left top, left bottom"; break;
			case "diagonal-topleft": b += "left top, right bottom"; break;
			case "diagonal-bottomleft": b += "left bottom, right top"; break;
			}
			for (var i = 0; i < stops.length; ++i)
				b += ",color-stop("+stops[i].pos+"%,"+stops[i].color+")";
			b += ")";
			element.style.background = b;
		}
	} else if (lc_browser.FireFox >= 3.6) {
		var b;
		if (orientation == "radial")
			b = "-moz-radial-gradient(center, ellipse cover";
		else
			b = "-moz-linear-gradient("+start_pos;
		for (var i = 0; i < stops.length; ++i)
			b += ","+stops[i].color+" "+stops[i].pos+"%";
		b += ")";
		element.style.background = b;
	} else if (lc_browser.Opera >= 10) {
		var b;
		if (orientation == "radial")
			b = "-o-radial-gradient(center, ellipse cover";
		else
			b = "-o-linear-gradient("+start_pos;
		for (var i = 0; i < stops.length; ++i)
			b += ","+stops[i].color+" "+stops[i].pos+"%";
		b += ")";
		element.style.background = b;
	} else {
		// default
		element.style.background = stops[0].color;
	}
	// TODO W3C ???
}
	
getCompatibleMouseEvent = function(e) {
	ev = {};
	if (lc_browser.IE == 0 || lc_browser.IE >= 9) { ev.x = e.clientX; ev.y = e.clientY; }
	else { ev.x = window.event.clientX+document.documentElement.scrollLeft; ev.y = window.event.clientY+document.documentElement.scrollTop; }
	if (lc_browser.IE == 0) ev.button = e.button;
	else switch (window.event.button) { case 1: ev.button = 0; break; case 4: ev.button = 1; break; case 2: ev.button = 2; break; } 
	return ev;
};
getCompatibleKeyEvent = function(e) {
	if (lc_browser.IE == 0 || lc_browser.IE >= 9) return e;
	return window.event;
};
if (!lc_browser.IE >= 9) {
	getWindowHeight = function() { return window.innerHeight; };
	getWindowWidth = function() { return window.innerWidth; };
} else if (lc_browser.IE >= 7) {
	getWindowHeight = function() { return document.documentElement.scrollHeight; };
	getWindowWidth = function() { return document.documentElement.scrollWidth; };
} else {
	getWindowHeight = function() { return document.body.clientHeight; };
	getWindowWidth = function() { return document.body.clientWidth; };
}
if (lc_browser.IE == 0) {
	stopEventPropagation = function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		return false;
	};
} else {
	stopEventPropagation = function(evt) {
		window.event.cancelBubble = true;
		window.event.returnValue = false;
		return false;
	};
}


/* Some useful functions */
function absoluteLeft(e,relative) {
	var left = e.offsetLeft;
	try { if (e.offsetParent && e.offsetParent != relative) left += absoluteLeft(e.offsetParent,relative); } catch (ex) {}
	return left;
}
function absoluteTop(e,relative) {
	var top = e.offsetTop;
	try { if (e.offsetParent && e.offsetParent != relative) top += absoluteTop(e.offsetParent,relative); } catch (ex) {}
	return top;
}
function getAbsoluteParent(e) {
	var p = e.parentNode;
	do {
		if (getComputedStyle(p).position == 'relative')
			return p;
		p = p.parentNode;
	} while(p != null && p.nodeType == 1);
	return document.body;
}
function getElementsAt(x,y) {
	var list = [];
	var disp = [];
	do {
		var e = document.elementFromPoint(x,y);
		if (e == document || e == document.body || e == window || e.nodeName == "HTML" || e.nodeName == "BODY") break;
		if (e == null) break;
		list.push(e);
		disp.push(e.style.display);
		e.style.display = "none";
	} while (true);
	for (var i = 0; i < list.length; ++i)
		list[i].style.display = disp[i];
	return list;
}

function scrollUp(element, scroll) {
	// try to set scrollTop
	var s = element.scrollTop;
	element.scrollTop = s - scroll;
	if (element.scrollTop != s) return; // it changed, so it worked
	// TODO
}
function scrollDown(element, scroll) {
	scrollUp(element, -scroll);
}
function scrollLeft(element, scroll) {
	// try to set scrollTop
	var s = element.scrollLeft;
	element.scrollLeft = s - scroll;
	if (element.scrollLeft != s) return; // it changed, so it worked
	// TODO
}
function scrollRight(element, scroll) {
	scrollLeft(element, -scroll);
}

function getScrollableContainer(element) {
	var parent = element.parentNode;
	do {
		if (parent == document.body) return parent;
		if (parent.scrollHeight != parent.clientHeight) return parent;
		if (parent.scrollWidth != parent.clientWidth) return parent;
		parent = parent.parentNode;
	} while (parent != null);
	return document.body;
}

function scrollToSee(element) {
	var parent = getScrollableContainer(element);
	var x1 = absoluteLeft(element, parent);
	var y1 = absoluteTop(element, parent);
	var x2 = x1+element.offsetWidth;
	var y2 = y1+element.offsetHeight;
	if (y1 < parent.scrollTop) {
		// the element is before, we need to scroll up
		scrollUp(parent, parent.scrollTop-y1);
	} else if (y2 > parent.scrollTop+parent.clientHeight) {
		// the element is after, we need to scroll down
		scrollDown(parent, y2-(parent.scrollTop+parent.clientHeight));
	}
	if (x1 < parent.scrollLeft) {
		// the element is before, we need to scroll left
		scrollLeft(parent, parent.scrollLeft-x1);
	} else if (x2 > parent.scrollLeft+parent.clientWidth) {
		// the element is after, we need to scroll down
		scrollRight(parent, x2-(parent.scrollLeft+parent.clientWidth));
	}
	// TODO same with parent, which may not be visible...
/*
				var x = absoluteLeft(cell, container);
				if (x < container.scrollLeft)
					container.scrollLeft = x;
				else if (container.scrollLeft+container.clientWidth < x+cell.offsetWidth)
					container.scrollLeft = x+cell.offsetWidth-container.clientWidth;
				var y = absoluteTop(cell, container);
				if (y < container.scrollTop)
					container.scrollTop = y;
				else if (container.scrollTop+container.clientHeight < y+cell.offsetHeight)
					container.scrollTop = y+cell.offsetHeight-container.clientHeight;
 */	
}

function URL(s) {
	var i = s.indexOf("://");
	if (i > 0) {
		this.protocol = s.substr(0, i).toLowerCase();
		s = s.substr(i+3);
		i = s.indexOf("/");
		this.host = s.substr(0,i);
		s = s.substr(i);
		i = this.host.indexOf(":");
		if (i > 0) {
			this.port = this.host.substr(i+1);
			this.host = this.host.substr(0,i);
		} else
			this.port = null;
	} else {
		this.protocol = window.location.protocol.substr(0,window.location.protocol.length-1);
		this.host = window.location.hostname;
		this.port = window.location.port;
	}
	i = s.indexOf('#');
	if (i > 0) {
		this.hash = s.substr(i+1);
		s = s.substr(0,i);
	}
	i = s.indexOf('?');
	this.params = new Object();
	if (i > 0) {
		this.path = s.substr(0,i);
		s = s.substr(i+1);
		while (s.length > 0 && (i = s.indexOf('&')) >= 0) {
			var p = s.substr(0, i);
			s = s.substr(i+1);
			i = p.indexOf('=');
			if (i > 0)
				this.params[decodeURIComponent(p.substr(0,i))] = decodeURIComponent(p.substr(i+1));
			else
				this.params[decodeURIComponent(p)] = "";
		}
		if (s.length > 0) {
			i = s.indexOf('=');
			if (i > 0)
				this.params[decodeURIComponent(s.substr(0,i))] = decodeURIComponent(s.substr(i+1));
			else
				this.params[decodeURIComponent(s)] = "";
		}
	} else
		this.path = s;
	
	// resolve .. in path
	if (this.path.substr(0,1) != "/" && window.location.pathname) {
		s = window.location.pathname;
		i = s.lastIndexOf('/');
		s = s.substr(0,i+1);
		this.path = s + this.path;
	}
	while ((i = this.path.indexOf('/../')) > 0) {
		var j = this.path.substr(0,i).lastIndexOf('/');
		if (j < 0) break;
		this.path = this.path.substr(0,j+1)+this.path.substr(i+4);
	}
	
	this.toString = function() {
		var s;
		if (this.protocol) {
			s = this.protocol+"://"+this.host;
			if (this.port) s += ":"+this.port;
		} else
			s = "";
		s += this.path;
		var first = true;
		for (var name in this.params) {
			if (first) { s += "?"; first = false; } else s += "&";
			s += encodeURIComponent(name) + "=" + encodeURIComponent(this.params[name]);
		}
		if (this.hash)
			s += "#"+this.hash;
		return s;
	};
}

function CustomEvent() {
	this.listeners = [];
	this.add_listener = function(listener) { this.listeners.push(listener); };
	this.fire = function(data) { for (var i = 0; i < this.listeners.length; ++i) this.listeners[i](data); };
} 

function listenEvent(elem, type, handler) {
	if (elem == window && !document.createEvent) elem = document;
	if (elem.addEventListener)
	     elem.addEventListener(type,handler,false);
	 else if (elem.attachEvent)
	     elem.attachEvent('on'+type,handler); 
}
function unlistenEvent(elem, type, handler) {
	if (elem == window && !document.createEvent) elem = document;
	if (elem.removeEventListener)
		elem.removeEventListener(type,handler,false);
	else
	     elem.detachEvent('on'+type,handler); 
}
function triggerEvent(elem, type, attributes) {
	var event;
	if (document.createEvent) {
		event = document.createEvent("HTMLEvents");
		event.initEvent(type, true, true);
	} else {
		event = document.createEventObject();
		event.eventType = type;
	}
	event.eventName = type;
	if (attributes) for (var attr in attributes) event[attr] = attributes[attr];
	if (document.createEvent) {
		elem.dispatchEvent(event);
	} else {
		if (elem == window) elem = document;
		elem.fireEvent("on" + type, event);
	}
}

// dynamically add scripts and styles
var _scripts_loaded = [];
function add_javascript(url, onload) {
	var p = new URL(url).path;
	if (_scripts_loaded.contains(p)) {
		if (onload) onload();
		return;
	}
	if (document.readyState != "complete") {
		// delay the load, as we may not have yet all the scripts in the head
		setTimeout(function(){add_javascript(url,onload);},1);
		return;
	}
	var head = document.getElementsByTagName("HEAD")[0];
	for (var i = 0; i < head.childNodes.length; ++i) {
		var e = head.childNodes[i];
		if (e.nodeName != "SCRIPT") continue;
		var u = new URL(e.src);
		if (u.path == p) {
			// we found a script there
			if (e.data) {
				if (onload)
					e.data.add_listener(onload)
				return;
			}
			// didn't use this way...
			if (e._loaded) {
				// but marked as already loaded
				_scripts_loaded.push(p);
				if (onload) onload();
				return;
			}
			e.data = new CustomEvent();
			if (onload) e.data.add_listener(onload);
			if (e.onload) e.data.add_listener(e.onload);
			e.onload = function() { _scripts_loaded.push(p); this.data.fire(); };
			return;
		}
	}
	// this is a new script
	var s = document.createElement("SCRIPT");
	s.data = new CustomEvent();
	if (onload) s.data.add_listener(onload);
	s.type = "text/javascript";
	s.onload = function() { _scripts_loaded.push(p); this._loaded = true; this.data.fire(); };
	s.onreadystatechange = function() { if (this.readyState == 'loaded' || this.readyState == 'complete') { _scripts_loaded.push(p); this._loaded = true; this.data.fire(); this.onreadystatechange = null; } };
	head.appendChild(s);
	s.src = new URL(url).toString();
}
function javascript_loaded(url) {
	url = new URL(url);
	if (!_scripts_loaded.contains(url.path))
		_scripts_loaded.push(url.path);
}

function add_stylesheet(url) {
	if (typeof url == 'string') url = new URL(url);
	if (document.readyState != "complete") {
		// delay the load, as we may not have yet all the css in the head
		setTimeout(function(){add_stylesheet(url);},1);
		return;
	}
	var head = document.getElementsByTagName("HEAD")[0];
	for (var i = 0; i < head.childNodes.length; ++i) {
		var e = head.childNodes[i];
		if (e.nodeName != "LINK") continue;
		var u = new URL(e.href);
		if (u.path == url.path) {
			// we found it
			return;
		}
	}
	var s = document.createElement("LINK");
	s.rel = "stylesheet";
	s.type = "text/css";
	s.href = url.toString();
	s.onload = function() { triggerEvent(window,'resize'); };
	document.getElementsByTagName("HEAD")[0].appendChild(s);
}

function get_script_path(script_filename) {
	var head = document.getElementsByTagName("HEAD")[0];
	for (var i = 0; i < head.childNodes.length; ++i) {
		var e = head.childNodes[i];
		if (e.nodeName != "SCRIPT") continue;
		var u = new URL(e.src);
		if (u.path.length > script_filename.length && u.path.substring(u.path.length-script_filename.length) == script_filename) {
			u.path = u.path.substring(0, u.path.length-script_filename.length);
			return u.toString();
		}
	}
	return null;
}

function lock_screen(onclick, content) {
	var div = document.getElementById('lock_screen');
	if (div) return;
	div = document.createElement('DIV');
	div.id = "lock_screen";
	div.style.backgroundColor = "#808080";
	setOpacity(div, 0.5);
	div.style.position = "fixed";
	div.style.top = "0px";
	div.style.left = "0px";
	div.style.width = getWindowWidth()+"px";
	div.style.height = getWindowHeight()+"px";
	if (onclick)
		div.onclick = onclick;
	if (content) {
		var table = document.createElement("TABLE"); div.appendChild(table);
		table.style.width = "100%";
		table.style.height = "100%";
		var tr = document.createElement("TR"); table.appendChild(tr);
		var td = document.createElement("TD"); tr.appendChild(td);
		td.style.verticalAlign = 'middle';
		td.style.textAlign = 'center';
		if (typeof content == 'string')
			td.innerHTML = content;
		else
			td.appendChild(content);
	}
	if (typeof animation != 'undefined')
		div.anim = animation.fadeIn(div,200,null,10,50);
	return document.body.appendChild(div);
}
function unlock_screen(div) {
	if (!div) div = document.getElementById('lock_screen');
	if (!div) return;
	if (typeof animation != 'undefined') {
		if (div.anim) animation.stop(div.anim);
		animation.fadeOut(div,200,function(){
			if (div.parentNode == document.body)
				document.body.removeChild(div);				
		},50,0);
	} else if (div.parentNode == document.body)
		document.body.removeChild(div);
}


// call onresize of window when all images are loaded, to trigger re-layout if needed
function _all_images_loaded() {
	var img = document.getElementsByTagName("IMG");
	for (var i = 0; i < img.length; ++i) {
		if (img[i].complete || img[i].height != 0) continue;
		return;
	}
	triggerEvent(window, 'resize');
}
function _init_images() {
	var img = document.getElementsByTagName("IMG");
	for (var i = 0; i < img.length; ++i) {
		listenEvent(img[i],'load',_all_images_loaded);
	}
}
listenEvent(window, 'load', _all_images_loaded);
_init_images();

// handle resize event for layout, in hierarchy order
var _layout_events = [];
function addLayoutEvent(element, handler) {
	_layout_events.push({element:element,handler:handler});
}
function _fire_layout_events() {
	// order elements
	var list = [];
	for (var i = 0; i < _layout_events.length; ++i) {
		var e = _layout_events[i];
		var found = false;
		for (var j = 0; j < list.length; ++j) {
			if (list[j].element == document.body) continue;
			var p = list[j].element.parentNode;
			while (p && p != document.body) {
				if (p == e.element) {
					// list[j] is a child of e => insert e before
					list.splice(j,0,e);
					found = true;
					break;
				}
				p = p.parentNode;
			}
			if (found) break;
		}
		if (!found) list.push(e);
	}
	var changed;
	var count = 0;
	do {
		changed = false;
		for (var i = 0; i < list.length; ++i) {
			var w = list[i].element.offsetWidth;
			var h = list[i].element.offsetHeight;
			list[i].handler(list[i].element);
			changed |= w != list[i].element.offsetWidth || h != list[i].element.offsetHeight;
		}
	} while (changed && ++count < 5);
}
function fireLayoutEventFor(element) {
	if (element == document.body) { _fire_layout_events(); return; }
	// order elements
	var list = [];
	for (var i = 0; i < _layout_events.length; ++i) {
		var e = _layout_events[i];
		if (e.element == document.body) continue;
		var p = e.element;
		var found = false;
		while (p && p != document.body) {
			if (p == element) { found = true; break; }
			p = p.parentNode;
		}
		if (!found) continue; // not a child of given element
		found = false;
		for (var j = 0; j < list.length; ++j) {
			if (list[j].element == document.body) continue;
			var p = list[j].element.parentNode;
			while (p && p != document.body) {
				if (p == e.element) {
					// list[j] is a child of e => insert e before
					list.splice(j,0,e);
					found = true;
					break;
				}
				p = p.parentNode;
			}
			if (found) break;
		}
		if (!found) list.push(e);
	}
	var changed;
	do {
		changed = false;
		for (var i = 0; i < list.length; ++i) {
			var w = list[i].element.offsetWidth;
			var h = list[i].element.offsetHeight;
			list[i].handler(list[i].element);
			changed |= w != list[i].element.offsetWidth || h != list[i].element.offsetHeight;
		}
	} while (changed);
}
listenEvent(window, 'resize', _fire_layout_events);

var _generate_id_counter = 0;
function generate_id() {
	return "id"+(_generate_id_counter++);
}