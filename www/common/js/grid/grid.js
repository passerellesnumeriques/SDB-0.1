function grid(element) {
	if (typeof element == 'string') element = document.getElementById(element);
	var t = this;
	t.element = element;
	t.columns = [];
	t.selectable = false;
	
	t.addColumn = function(title, width, field_type, attached_data, onclick, sort, filter) {
		var th = document.createElement('TH');
		th.sort_order = sort ? 3 : null;
		th.filtered = false;
		th.set_title = function() {
			var s = title;
			if (th.sort_order == 1 || th.sort_order == 2) {
				s += " <img src='/static/common/images/";
				if (th.sort_order == 1)
					s += "arrow_up_10.gif";
				else
					s += "arrow_down_10.gif";
				s += "' style='vertical-align:middle'/>";
			}
			th.innerHTML = s;
			if (onclick || sort) {
				th.style.cursor = 'pointer';
				th.onclick = function() {
					var index = 0;
					var ptr = this;
					while (ptr.previousSibling) { index++; ptr = ptr.previousSibling; };
					if (onclick) {
						if (t.selectable) index--;
						onclick(index, attached_data);
					} else {
						for (var i = 0; i < this.parentNode.childNodes.length; ++i) {
							var col = this.parentNode.childNodes[i];
							if (col == this) continue;
							if (col.sort_order) {
								col.sort_order = 3;
								col.set_title();
							}
						}
						var rows = [];
						while (t.table.childNodes.length > 0) {
							rows.push(t.table.childNodes[0]);
							t.table.removeChild(t.table.childNodes[0]);
						}
						if (th.sort_order == 1)
							th.sort_order = 2;
						else
							th.sort_order = 1;
						th.set_title();
						rows.sort(function(r1,r2){
							var f1 = r1.childNodes[index].field;
							var f2 = r2.childNodes[index].field;
							var v1 = field_type.getValue(f1);
							var v2 = field_type.getValue(f2);
							var res = sort(v1,v2);
							if (th.sort_order == 2)
								res = -res;
							return res;
						});
						for (var i = 0; i < rows.length; ++i)
							t.table.appendChild(rows[i]);
					}
				};
			}
			if (filter) {
				var img = document.createElement("IMG");
				img.src = "/static/common/images/"+(th.filtered ? "remove_filter.gif" : "filter.gif");
				img.style.paddingLeft = "3px";
				img.style.cursor = 'pointer';
				img.onclick = function(ev) {
					if (th.filtered) {
						th.filtered = false;
						th.set_title();
						t.apply_filters();
					} else {
						if (t.table.childNodes.length == 0) return;
						add_javascript(get_script_path("grid.js")+"../context_menu/context_menu.js", function() {
							var values = [];
							var index = 0;
							var ptr = th;
							while (ptr.previousSibling) { index++; ptr = ptr.previousSibling; };
							for (var i = 0; i < t.table.childNodes.length; ++i) {
								var row = t.table.childNodes[i];
								if (row.style.visibility == "hidden") continue;
								var cell = row.childNodes[index];
								var value = field_type.getValue(cell.field);
								var found = false;
								for (var j = 0; j < values.length; ++j)
									if (values[j] == value) { found = true; break; }
								if (!found) values.push(value);
							}
							var menu = new context_menu();
							var checkboxes = [];
							for (var i = 0; i < values.length; ++i) {
								var item = document.createElement("DIV");
								var cb = document.createElement("INPUT");
								cb.type = 'checkbox';
								cb.checked = 'checked';
								item.appendChild(cb);
								checkboxes.push(cb);
								var input = field_type.create(item,values[i]);
								input.disabled = 'disabled';
								item.style.paddingRight = "2px";
								menu.addItem(item);
								item.onclick = null;
							}
							menu.removeOnClose = true;
							menu.onclose = function() {
								th.filtered = true;
								th.set_title();
								th.filter_values = [];
								for (var i = 0; i < checkboxes.length; ++i)
									if (checkboxes[i].checked)
										th.filter_values.push(values[i]);
								if (th.filter_values.length == checkboxes.length) {
									th.filter_values = null;
									th.filtered = false;
									th.set_title();
								}
								t.apply_filters();
							};
							menu.showBelowElement(img);
						});
					}
					stopEventPropagation(ev);
					return false;
				};
				th.appendChild(img);
			}
		};
		th.set_title();
		if (!field_type) field_type = new field_text();
		t.header.appendChild(th);
		var col = document.createElement('COL');
		if (width) col.width = width;
		t.colgroup.appendChild(col);
		t.columns.push(field_type);
	};
	t.getNbColumns = function() { return t.columns.length; };
	t.getColumnField = function(index) { return t.columns[index]; };
	t.setColumnTitle = function(index, title) {
		var th = t.header.childNodes[index+(t.selectable ? 1 : 0)];
		th.innerHTML = title;
	};
	
	t.setSelectable = function(selectable) {
		if (t.selectable == selectable) return;
		t.selectable = selectable;
		if (selectable) {
			var th = document.createElement('TH');
			var cb = document.createElement("INPUT");
			cb.type = 'checkbox';
			cb.onchange = function() { if (this.checked) t.selectAll(); else t.unselectAll(); }
			th.appendChild(cb);
			var col = document.createElement('COL');
			col.width = 20;
			if (t.header.childNodes.length == 0) {
				t.header.appendChild(th);
				t.colgroup.appendChild(col);
			} else {
				t.header.insertBefore(th, t.header.childNodes[0]);
				t.colgroup.insertBefore(col, t.colgroup.childNodes[0]);
			}
		} else if (t.header.childNodes.length > 0) {
			t.header.removeChild(t.header.childNodes[0]);
			t.colgroup.removeChild(t.colgroup.childNodes[0]);
		}
	};
	t.selectAll = function() {
		for (var i = 0; i < t.table.childNodes.length; ++i) {
			var tr = t.table.childNodes[i];
			var td = tr.childNodes[0];
			var cb = td.childNodes[0];
			cb.checked = 'checked';
			cb.onchange();
		}
		t._selection_changed();
		// TODO if filtered, do not select non-filtered
	};
	t.unselectAll = function() {
		for (var i = 0; i < t.table.childNodes.length; ++i) {
			var tr = t.table.childNodes[i];
			var td = tr.childNodes[0];
			var cb = td.childNodes[0];
			cb.checked = '';
			cb.onchange();
		}
		t._selection_changed();
	};
	t._selection_changed = function() {
		if (t.onselect) {
			t.onselect(t.getSelection());
		}
	};
	t.onselect = null;
	t.getSelection = function() {
		var selection = [];
		for (var i = 0; i < t.table.childNodes.length; ++i) {
			var tr = t.table.childNodes[i];
			var td = tr.childNodes[0];
			var cb = td.childNodes[0];
			if (cb.checked)
				selection.push(i);
		}
		return selection;
	};
	
	t.setData = function(data) {
		// empty table
		while (t.table.childNodes.length > 0) t.table.removeChild(t.table.childNodes[0]);
		// create rows
		for (var i = 0; i < data.length; ++i) {
			var tr = document.createElement("TR");
			if (t.selectable) {
				var td = document.createElement("TD");
				tr.appendChild(td);
				var cb = document.createElement("INPUT");
				cb.type = 'checkbox';
				cb.onchange = function() {
					this.parentNode.parentNode.className = this.checked ? "selected" : "";
					t._selection_changed();
				};
				td.appendChild(cb);
			}
			for (var j = 0; j < t.columns.length; ++j) {
				var td = document.createElement("TD");
				tr.appendChild(td);
				if (data[i].length <= j) continue;
				td.field = t.columns[j].create(td, data[i][j]);
			}
			t.table.appendChild(tr);
		}
	};
	
	t.getCellContent = function(row,col) {
		if (t.selectable) col++;
		var tr = t.table.childNodes[row];
		var td = tr.childNodes[col];
		return td.childNodes[0];
	};
	
	t.reset = function() {
		// remove data rows
		while (t.table.childNodes.length > 0) t.table.removeChild(t.table.childNodes[0]);		
		// remove columns
		while (t.header.childNodes.length > 0) t.header.removeChild(t.header.childNodes[0]);		
		while (t.colgroup.childNodes.length > 0) t.colgroup.removeChild(t.colgroup.childNodes[0]);
		t.columns = [];
		t.setSelectable(!t.selectable);
		t.setSelectable(!t.selectable);
	};
	
	t.startLoading = function() {
		if (t.loading_back) return;
		t.loading_back = document.createElement("DIV");
		t.loading_back.style.backgroundColor = "#A0A0A0";
		setOpacity(t.loading_back, 0.35);
		t.loading_back.style.position = "absolute";
		t.loading_back.style.top = absoluteTop(t.element)+"px";
		t.loading_back.style.left = absoluteLeft(t.element)+"px";
		t.loading_back.style.width = t.element.offsetWidth+"px";
		t.loading_back.style.height = t.element.offsetHeight+"px";
		document.body.appendChild(t.loading_back);
		t.loading_icon = document.createElement("IMG");
		t.loading_icon.src = common_images_url+"loading.gif";
		t.loading_icon.style.position = "absolute";
		t.loading_icon.style.top = (absoluteTop(t.element)+t.element.offsetHeight/2-8)+"px";
		t.loading_icon.style.left = (absoluteLeft(t.element)+t.element.offsetWidth/2-8)+"px";
		document.body.appendChild(t.loading_icon);
	};
	t.endLoading = function() {
		if (!t.loading_back) return;
		document.body.removeChild(t.loading_back);
		document.body.removeChild(t.loading_icon);
		t.loading_back = null;
		t.loading_icon = null;
	};
	
	t.apply_filters = function() {
		for (var i = 0; i < t.table.childNodes.length; ++i) {
			var row = t.table.childNodes[i];
			var hidden = false;
			for (var j = 0; j < t.header.childNodes.length; ++j) {
				var th = t.header.childNodes[j];
				if (!th.filtered) continue;
				var cell = row.childNodes[j];
				var value = t.columns[j-(t.selectable ? 1 : 0)].getValue(cell.field);
				var found = false;
				for (var k = 0; k < th.filter_values.length; ++k)
					if (th.filter_values[k] == value) { found = true; break; }
				if (!found) { hidden = true; break; }
			}
			row.style.visibility = hidden ? "hidden" : "visible";
			row.style.position = hidden ? "absolute" : "static";
			row.style.top = "-10000px";
			// TODO color?
		}
	};
	
	/* --- internal functions --- */
	t._createTable = function() {
		t.form = document.createElement('FORM');
		var table = document.createElement('TABLE');
		t.form.appendChild(table);
		table.style.width = "100%";
		t.colgroup = document.createElement('COLGROUP');
		table.appendChild(t.colgroup);
		var thead = document.createElement('THEAD');
		t.header = document.createElement('TR');
		thead.appendChild(t.header);
		table.appendChild(thead);
		t.table = document.createElement('TBODY');
		table.appendChild(t.table);
		t.element.appendChild(t.form);
		table.className = "grid";
	};
	
	/* initialization */
	t._createTable();
}
