ajax = {
	_interceptors: [],
	addInterceptor: function(interceptor) {
		ajax._interceptors.push(interceptor);
	},
	process_url: function(url) {
		var u;
		if (typeof url == 'string') u = new URL(url); else u = url;
		for (var i = 0; i < ajax._interceptors.length; ++i)
			ajax._interceptors[i](u);
		if (typeof url == 'string') return u.toString();
		return u;
	},
	call: function(method, url, content_type, content_data, error_handler, success_handler, foreground) {
		if (typeof url == 'string')
			url = new URL(url);
		url = ajax.process_url(url);
		var xhr = new XMLHttpRequest();
		xhr.open(method, url.toString(), !foreground);
		if (content_type != null)
			xhr.setRequestHeader('Content-type', content_type);
		var sent = function() {
	        if (xhr.status != 200) { error_handler("Error "+xhr.status+": "+xhr.statusText); return; }
	        success_handler(xhr);
		};
		xhr.onreadystatechange = function() {
	        if (this.readyState != 4) return;
	        sent();
	    };
	    try {
	    	xhr.send(content_data);
	    } catch (e) {
	    	error_handler(e);
	    }
	},
	post: function(url, data, error_handler, success_handler, foreground) {
	    if (typeof data == 'object') {
	    	var s = "";
	    	for (var name in data) {
	    		if (s.length > 0) s += "&";
	    		s += encodeURIComponent(name);
	    		s += "=";
	    		s += encodeURIComponent(data[name]);
	    	}
	    	data = s;
	    }
		ajax.call("POST", url, "application/x-www-form-urlencoded", data, error_handler, success_handler, foreground);
	},
	post_parse_result: function(url, data, handler, foreground, error_handler) {
		var eh = function(error) {
			if (error_handler)
				error_handler(error);
			else
				error_dialog(error);
			handler(null);
		};
		ajax.post(url, data, eh, function(xhr) {
			var ct = xhr.getResponseHeader("Content-Type");
			if (ct) {
				var i = ct.indexOf(';');
				if (i > 0) ct = ct.substring(0, i);
			}
			if (ct == "text/xml" || (!ct && xhr.responseXML)) {
				// XML
		        if (xhr.responseXML && xhr.responseXML.childNodes.length > 0) {
		            if (xhr.responseXML.childNodes[0].nodeName == "ok") {
		            	handler(xhr.responseXML.childNodes[0]);
		            	return;
		            }
	                if (xhr.responseXML.childNodes[0].nodeName == "error")
	                	eh(xhr.responseXML.childNodes[0].getAttribute("message"));
	                else
	                	eh(xhr.responseText);
		        } else
		        	eh(xhr.responseText);
		        handler(null);
			} else if (ct == "text/json") {
				// JSON
				if (xhr.responseText.length == 0) {
					eh("Empty response from the server");
					return;
				}
				var output;
		        try {
		        	output = eval("("+xhr.responseText+")");
		        } catch (e) {
		        	eh("Invalid json output:<br/>Error: "+e+"<br/>Output:<br/>"+xhr.responseText);
		        	return;
		        }
	        	if (output.errors) {
	        		if (output.errors.length == 1)
	        			eh(output.errors[0]);
	        		else {
	        			var s = "Errors:<ul style='margin:0px'>";
	        			for (var i = 0; i < output.errors.length; ++i)
	        				s += "<li>"+output.errors[i]+"</li>";
	        			s += "</ul>";
		        		eh(s);
	        		}
	        		return;
	        	}
	        	if (typeof output.result == 'undefined') {
	        		eh("Error: No result from JSON service");
	        		return;
	        	}
	        	handler(output.result);
			} else {
				// considered as free text...
				handler(xhr.responseText);
			}
		}, foreground);
	}
};