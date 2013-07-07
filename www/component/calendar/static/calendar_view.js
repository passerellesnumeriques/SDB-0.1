function calendar_view(container, calendar, default_view) {
	if (typeof container == 'string') container = document.getElementById(container);
	var t=this;
	add_javascript("/static/common/js/Status.js",function() {
		add_javascript("/static/common/js/StatusUI_Top.js",function() {
			var status_mgr = new StatusManager();
			new StatusUI_Top(status_mgr, 0);
			locale.load("/locale/calendar/","calendar");
			var loading_status = new StatusMessage(Status_TYPE_PROCESSING, locale.get_string("calendar:Loading calendars"));
			loading_status.counter = 0;

			calendar.onloading = function(calendars, calendar) {
				loading_status.counter++;
				if (loading_status.counter == 1)
					status_mgr.add_status(loading_status);
			};
			calendar.onloaded = function(calendars, calendar) {
				loading_status.counter--;
				if (loading_status.counter == 0)
					status_mgr.remove_status(loading_status);
			};
			calendar.onerror = function(calendars, calendar, error) {
				loading_status.counter--;
				if (loading_status.counter == 0)
					status_mgr.remove_status(loading_status);
				status_mgr.add_status(new StatusMessageError(null, calendar.name+": "+error, 5000));
			};
			calendar.onaction = function(id, message) {
				var s = new StatusMessage(Status_TYPE_PROCESSING, message);
				s.calid = id;
				status_mgr.add_status(s);
			};
			calendar.onactiondone = function(id) {
				for (var i = 0; i < status_mgr.status.length; ++i)
					if (status_mgr.status[i].calid && status_mgr.status[i].calid == id) {
						status_mgr.remove_status(status_mgr.status[i]);
						return;
					}
			};
		});
	});
	
	t.calendar = calendar;
	t.header = document.createElement("DIV");
	t.header.className = "calendar_view_header";
	t.header.setAttribute("layout","fixed");
	t.content = document.createElement("DIV");
	t.content.setAttribute("layout","fill");
	container.appendChild(t.header);
	container.appendChild(t.content);
	add_javascript("/static/common/js/vertical_layout/vertical_layout.js",function() {
		new vertical_layout(container);
	});
	t.set_view = function(type) {
		t.view_type = type;
		t.content.innerHTML = "<img src='/static/common/images/loading.gif'/>";
		add_stylesheet("/static/calendar/calendar_view_"+type+".css");
		add_javascript("/static/calendar/calendar_view_"+type+".js",function() {
			var f = eval("calendar_view_"+type);
			new f(t.content, t.calendar);
		});
	}
	t.set_view(default_view ? default_view : "week");
	t.create_header = function() {
		add_stylesheet("/static/common/js/mac_tabs/mac_tabs.css");
		add_javascript("/static/common/js/mac_tabs/mac_tabs.js",function() {
			var tabs = new mac_tabs();
			tabs.addItem("Week","week");
			tabs.addItem("Agenda","agenda");
			tabs.select(t.view_type);
			t.header.appendChild(tabs.element);
			fireLayoutEventFor(container);
			tabs.onselect = function(id) {
				t.set_view(id);
			};
		});
	};
	t.create_header();
}