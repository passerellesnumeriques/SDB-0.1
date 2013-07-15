function excel(container) {
	if (typeof container == 'string') container = document.getElementById(container);
	var t=this;
	
	t.onload = null;
	t.load = function(storage_id, extend_time) {
		locale.load('/locale/data_import/','data_import');
		while(container.childNodes.length > 0) container.removeChild(container.childNodes[0]);
		container.innerHTML = "<img src='/static/common/images/loading.gif' style='vertical-align:bottom'/> "+locale.get_string("data_import:Loading data")+"...";
		ajax.call("GET","/dynamic/data_import/service/excel?id="+storage_id+(extend_time ? "&extend_time="+extend_time : ""), null, null,
			function(error){
				container.innerHTML = "<img src='/static/common/images/error.png' style='vertical-align:bottom'/> "+error;
			},function(xhr){
				var s = xhr.responseText;
				var scripts = [];
				var i;
				while ((i = s.indexOf('<script')) >= 0) {
					var j = s.indexOf('>', i);
					var k = s.indexOf('</script>', j);
					if (j < 0 || k < 0) break;
					scripts.push(s.substring(j+1,k));
					s = s.substring(0,i)+s.substring(k+9);
				}
				container.innerHTML = s;
				for (var i = 0; i < scripts.length; ++i)
					eval(scripts[i]);
				var check = function() {
					var tabs = document.getElementById('excel_file').tabs;
					if (tabs) {
						if (t.onload) t.onload();
						return;
					}
					setTimeout(function(){check();},10);
				};
				check();
			},false
		);
	};
	
	t.allow_select_range = function() {
		var tabs = document.getElementById('excel_file').tabs;
		for (var i = 0; i < tabs.tabs.length; ++i) {
			var sheet = tabs.tabs[i].title;
			var table = tabs.tabs[i].content.childNodes[0];
			var tbody = table.childNodes[0];
			for (var row = 0; row < tbody.childNodes.length; ++row) {
				var tr = tbody.childNodes[row];
				for (var col = 0; col < tr.childNodes.length; ++col) {
					var td = tr.childNodes[col];
					td.sheet = sheet;
					td.row = row;
					td.col = col;
					td.onmousedown = function(e) { t.start_selection(this.sheet, this.row, this.col); stopEventPropagation(e); return false; };
					td.style.cursor = "pointer";
				}
			}
		}
		t._select_key_listener = function(e){t._select_key(e); stopEventPropagation(e); return false; };
		listenEvent(window,'keydown',t._select_key_listener);
	};
	t._select_key = function(e) {
		var event = window.event ? window.event : e;
		var key = event.keyCode;
		if (key >= 37 && key <= 40) {
			var tabs = document.getElementById('excel_file').tabs;
			var tab = tabs.tabs[tabs.selected];
			if (t.selection == null) {
				t.set_selection(tab.title, 0, 0, 0, 0);
				return;
			}
			if (event.ctrlKey) {
				switch (key) {
				case 37: // left
					if (t.selection[4] > t.selection[2])
						t.set_selection(tab.title, t.selection[1], t.selection[2], t.selection[3], t.selection[4]-1);
					break;
				case 38: // up
					if (t.selection[3] > t.selection[1])
						t.set_selection(tab.title, t.selection[1], t.selection[2], t.selection[3]-1, t.selection[4]);
					break;
				case 39: // right
					var row = t.selection[3];
					var col = t.selection[4];
					var cell = t.get_cell(tab.title, row, col);
					if (cell == null || cell.nextSibling == null) break;
					t.set_selection(tab.title, t.selection[1], t.selection[2], row, col+1);
					break;
				case 40: // down
					var row = t.selection[3];
					var col = t.selection[4];
					var cell = t.get_cell(tab.title, row, col);
					if (cell == null || cell.parentNode.nextSibling == null) break;
					t.set_selection(tab.title, t.selection[1], t.selection[2], row+1, col);
					break;
				}
				var cell = t.get_cell(tab.title, t.selection[3], t.selection[4]);
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
			} else {
				switch (key) {
				case 37: // left
					if (t.selection[2] > 0)
						t.set_selection(tab.title, t.selection[1], t.selection[2]-1, t.selection[1], t.selection[2]-1);
					else
						t.set_selection(tab.title, t.selection[1], 0, t.selection[1], 0);
					break;
				case 38: // up
					if (t.selection[1] > 0)
						t.set_selection(tab.title, t.selection[1]-1, t.selection[2], t.selection[1]-1, t.selection[2]);
					else
						t.set_selection(tab.title, 0, t.selection[2], 0, t.selection[2]);
					break;
				case 39: // right
					var row = t.selection[1];
					var col = t.selection[2];
					var cell = t.get_cell(tab.title, row, col);
					if (cell == null || cell.nextSibling == null) break;
					t.set_selection(tab.title, row, col+1, row, col+1);
					break;
				case 40: // down
					var row = t.selection[1];
					var col = t.selection[2];
					var cell = t.get_cell(tab.title, row, col);
					if (cell == null || cell.parentNode.nextSibling == null) break;
					t.set_selection(tab.title, row+1, col, row+1, col);
					break;
				}
				var cell = t.get_cell(tab.title, t.selection[1], t.selection[2]);
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
			}
		}
	};
	t.get_cell = function(sheet, row, col) {
		var tabs = document.getElementById('excel_file').tabs;
		for (var i = 0; i < tabs.tabs.length; ++i) {
			if (sheet != tabs.tabs[i].title) continue;
			var table = tabs.tabs[i].content.childNodes[0];
			var tbody = table.childNodes[0];
			if (row >= tbody.childNodes.length) return null;
			var tr = tbody.childNodes[row];
			if (col >= tr.childNodes.length) return null;
			var td = tr.childNodes[col];
			return td;
		}
		return null;
	};
	t.get_sheet_container = function(sheet) {
		var tabs = document.getElementById('excel_file').tabs;
		for (var i = 0; i < tabs.tabs.length; ++i) {
			if (sheet != tabs.tabs[i].title) continue;
			return tabs.tabs[i].content;
		}
		return null;
	};
	t.disable_select = function() {
		t.set_selection(null);
		var tabs = document.getElementById('excel_file').tabs;
		for (var i = 0; i < tabs.tabs.length; ++i) {
			var sheet = tabs.tabs[i].title;
			var table = tabs.tabs[i].content.childNodes[0];
			var tbody = table.childNodes[0];
			for (var row = 0; row < tbody.childNodes.length; ++row) {
				var tr = tbody.childNodes[row];
				for (var col = 0; col < tr.childNodes.length; ++col) {
					var td = tr.childNodes[col];
					td.onmousedown = null;
					td.style.cursor = "";
				}
			}
		}
		unlistenEvent(window,'keydown',t._select_key_listener);
		t._select_key_listener = null;
	};
	t.selection = null;
	t.selection_div = null;
	t.onselectionchange = null;
	t.start_selection = function(sheet, row, col) {
		t.set_selection(sheet,row,col,row,col);
		var listener = function(e) {
			var ev = getCompatibleMouseEvent(e);
			var list = getElementsAt(ev.x,ev.y);
			for (var i = 0; i < list.length; ++i) {
				if (list[i].sheet) {
					if (list[i].sheet != t.selection[0]) continue;
					var sheet = t.selection[0];
					var row1 = t.selection[1];
					var col1 = t.selection[2];
					var row2 = list[i].row;
					var col2 = list[i].col;
					if (row2 < row1) {
						var r = row1;
						row1 = row2;
						row2 = r;
					}
					if (col2 < col1) {
						var c = col1;
						col1 = col2;
						col2 = c;
					}
					t.set_selection(sheet, row1, col1, row2, col2);
					break;
				}
			}
		};
		var listener2 = function() {
			unlistenEvent(window,'mousemove',listener);
			unlistenEvent(window,'mouseup',listener2);
			// TODO end of selection
		};
		listenEvent(window,'mousemove',listener);
		listenEvent(window,'mouseup',listener2)
	};
	t.set_selection = function(sheet, row1, col1, row2, col2) {
		if (sheet == null) {
			t.selection = null;
			if (t.selection_div) {
				t.selection_div.parentNode.removeChild(t.selection_div);
				t.selection_div = null;
			}
		} else {
			t.selection = [sheet,row1,col1,row2,col2];
			if (t.selection_div)
				t.selection_div.parentNode.removeChild(t.selection_div);
			var area = t._create_area(sheet,row1,col1,row2,col2,null,"rgba(128,128,255,0.5)",2,"#0000FF");
			t.selection_div = area.div;
		}
		if (t.onselectionchange) t.onselectionchange(t);
	};
	t.areas = [];
	t.add_area = function(id,sheet, row1, col1, row2, col2, text, r,g,b) {
		var border_color = "rgb("+r+","+g+","+b+")";
		var bgcolor = "rgba("+(r<128 ? r+128 : 255)+","+(g<128 ? g+128 : 255)+","+(b<128 ? b+128 : 255)+",0.5)";
		var area = t._create_area(sheet, row1, col1, row2, col2, text, bgcolor,1,border_color);
		area.id = id;
		t.areas.push(area);
	};
	t.remove_area = function(id) {
		for (var i = 0; i < t.areas.length; ++i)
			if (t.areas[i].id == id) {
				t.areas[i].div.parentNode.removeChild(t.areas[i].div);
				t.areas.splice(i,1);
				return;
			}
	};
	t.removeAllAreas = function() {
		for (var i = 0; i < t.areas.length; ++i)
			t.areas[i].div.parentNode.removeChild(t.areas[i].div);
		t.areas = [];
	};
	t._create_area = function(sheet, row1, col1, row2, col2, text,bgcolor,border_size,border_color) {
		var area = {sheet:sheet,row1:row1,col1:col1,row2:row2,col2:col2,text:text};
		area.div = document.createElement("DIV");
		area.div.style.border = border_size+"px solid "+border_color;
		area.div.style.backgroundColor = bgcolor;
		area.div.style.position = "absolute";
		var cell1 = t.get_cell(sheet, row1, col1);
		var cell2 = t.get_cell(sheet, row2, col2);
		var container = t.get_sheet_container(sheet);
		var x = absoluteLeft(cell1,container)-2;
		var y = absoluteTop(cell1,container)-2;
		var w = absoluteLeft(cell2,container)+cell2.offsetWidth-x-2;
		var h = absoluteTop(cell2,container)+cell2.offsetHeight-y-2;
		area.div.style.left = x+"px";
		area.div.style.top = y+"px";
		area.div.style.width = w+"px";
		area.div.style.height = h+"px";
		area.div.style.verticalAlign = "middle";
		area.div.style.textAlign = "center";
		if (text) area.div.innerHTML = text;
		container.appendChild(area.div);
		return area;
	};
}