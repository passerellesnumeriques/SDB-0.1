function upload_drop_supported() {
	if (window.File && window.FileList && window.FileReader) {
		var xhr = new XMLHttpRequest();
		if (xhr.upload)
			return true;
	}
	return false;
}

function upload(container, multiple, target, ondone, send_reset, popup) {
	locale.load("/locale/storage/","storage");
	if (typeof container == 'string') container = document.getElementById(container);
	var t=this;
	container.appendChild(t.form = document.createElement("FORM"));
	t.form.method = "POST";
	t.form.enctype = "multipart/form-data";
	t.form.action = target;
	t.form.appendChild(t.input = document.createElement("INPUT"));
	t.input.type = "file";
	t.input.name = "storage_upload";
	if (multiple)
		t.input.multiple = "multiple";
	t.droppable = upload_drop_supported();
	if (!t.droppable) {
		t.form.appendChild(t.button = document.createElement("BUTTON"));
		t.button.type = "submit";
		t.button.innerHTML = locale.get_string("storage:Upload");
		t.form.onsubmit = function() {
			var doit = function(popup) {
				var frame = document.createElement("IFRAME");
				frame.style.border = "0px";
				popup.setContent(frame);
				var doc = frame.contentWindow.document || frame.contentDocument;
				doc.body.appendChild(t.form);
				t.form.onsubmit = null;
				t.form.submit();
			};
			if (popup) {
				t.popup = popup;
				doit(popup.content);
			} else {
				add_stylesheet("/static/common/js/popup_window/popup_window.css");
				add_javascript("/static/common/js/popup_window/popup_window.js",function() {
					t.popup = new popup_window(locale.get_string("storage:Upload"),"/static/storage/upload.png","");
					t.popup.show();
					doit(t.popup);
				});
			}
			return false;
		};
	} else {
		t.input.addEventListener("change", function(e){t.FileSelectHandler(e);}, false);
	}
	
	t.appendDropArea = function() {
		if (!t.droppable) return;
		t.form.appendChild(t.area = document.createElement("DIV"));
		t.area.style.color = "#505050";
		t.area.style.border = "2px dashed #505050";
		setBorderRadius(t.area, 7, 7, 7, 7, 7, 7, 7, 7);
		t.area.style.textAlign = "center";
		t.area.style.verticalAlign = "middle";
		t.area.innerHTML = locale.get_string(multiple ? "storage:Drop files here" : "storage:Drop file here");
		t.area.addEventListener("dragover", function(e){t.FileDragHover(e);return false;}, false);
		t.area.addEventListener("dragleave", function(e){t.FileDragHover(e);return false;}, false);
		t.area.addEventListener("drop", function(e){t.FileSelectHandler(e);return false;}, false);
	};
	t.addHiddenDropArea = function(where) {
		if (!t.droppable) return;
		if (typeof where == 'string') where = document.getElementById(where);
		document.addEventListener("dragover", function(e){
			if (t.area) return;
			t.area = document.createElement("DIV");
			t.area.style.position = "absolute";
			t.area.style.top = absoluteTop(where)+"px";
			t.area.style.left = absoluteLeft(where)+"px";
			t.area.style.width = where.offsetWidth+"px";
			t.area.style.height = where.offsetHeight+"px";
			t.area.style.zIndex = 10;
			t.area.style.padding = "1em 0";
			t.area.style.color = "#505050";
			t.area.style.backgroundColor = "rgba(255,255,255,0.5)";
			t.area.style.border = "2px dashed #505050";
			setBorderRadius(t.area, 7, 7, 7, 7, 7, 7, 7, 7);
			t.area.style.textAlign = "center";
			t.area.style.verticalAlign = "middle";
			t.area.innerHTML = locale.get_string(multiple ? "storage:Drop files here" : "storage:Drop file here");
			document.body.appendChild(t.area);
			t.area.addEventListener("dragover", function(e){t.FileDragHover(e);}, false);
			t.area.addEventListener("dragleave", function(e){t.FileDragHover(e);}, false);
			t.area.addEventListener("drop", function(e){t.FileSelectHandler(e);}, false);
			t.area_hidden = true;
		},false);
		document.addEventListener("dragleave", function(e){
			t.area_hidden = false;
			if (t.area) {
				t.area.parentNode.removeChild(t.area);
				t.area = null;
			}
		},false);
		document.addEventListener("drop", function(e){
			t.area_hidden = false;
			if (t.area) {
				t.area.parentNode.removeChild(t.area);
				t.area = null;
			}
		},false);
	};
	
	t.FileDragHover = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if (t.area) {
			if (e.type == "dragover") {
				t.area.style.color = "#000000";
				t.area.style.border = "2px solid black";
			} else {
				t.area.style.color = "#505050";
				t.area.style.border = "2px dashed #505050";
			}
		}
		return false;
	}
	t.FileSelectHandler = function(e) {
		// cancel event and hover styling
		t.FileDragHover(e);
		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;
		// show popup
		add_stylesheet("/static/common/js/popup_window/popup_window.css");
		add_javascript("/static/common/js/popup_window/popup_window.js",function() {
			if (t.area_hidden) {
				t.area_hidden = false;
				if (t.area) {
					t.area.parentNode.removeChild(t.area);
					t.area = null;
				}
			}
			t.progress_table = document.createElement("TABLE");
			var tr = null;
			if (send_reset) {
				tr = document.createElement("TR"); t.progress_table.appendChild(tr);
				var td = document.createElement("TD");
				td.colSpan=2;
				td.innerHTML = locale.get_string("storage:Initializing upload")+"...";
				tr.appendChild(td);
			}
			if (popup) {
				t.popup = popup;
				t.popup.setContent(t.progress_table);
			} else {
				t.popup = new popup_window(locale.get_string("storage:Upload"),"/static/storage/upload.png",t.progress_table);
				t.popup.show();
			}
			var upload_files = function() {
				// process all File objects
				var nb = files.length;
				for (var i = 0, f; f = files[i]; i++) {
					if (t.CheckFile(f))
						t.UploadFile(f,function(){
							if (--nb == 0) {
								if (ondone) ondone(t.popup);
							}
						});
				}
			};
			if (send_reset) {
				var url = new URL(target);
				url.params["reset"] = "1";
				ajax.post_parse_result(url.toString(),null,function(result){
					if (result) {
						tr.parentNode.removeChild(tr);
						upload_files();
					}
				},true);
			} else
				upload_files();
		});
	};
	
	t.CheckFile = function(f) {
		// TODO check according to the restriction we may want
		return true;
	}

	t.UploadFile = function(file,ondone) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", target, true);
		xhr.setRequestHeader("X_FILENAME", file.name);
		xhr.setRequestHeader("X_FILETYPE", file.type);
		xhr.setRequestHeader("X_FILESIZE", file.size);
		var tr = document.createElement("TR"); t.progress_table.appendChild(tr);
		var td = document.createElement("TD");
		td.innerHTML = file.name;
		tr.appendChild(td);
		td = document.createElement("TD"); tr.appendChild(td);
		var progress = document.createElement("DIV");
		progress.style.width="200px";
		progress.style.height="15px";
		progress.style.border="1px solid black";
		progress.style.position="relative";
		var progress_bar = document.createElement("DIV");
		progress_bar.style.position="absolute";
		progress_bar.style.top="0px";
		progress_bar.style.left="0px";
		progress_bar.style.width="0px";
		progress_bar.style.height="15px";
		progress_bar.style.backgroundColor="#A0A0FF";
		progress.appendChild(progress_bar);
		td.appendChild(progress);
		t.popup.resize();
		xhr.upload.addEventListener("progress", function(e) {
			progress_bar.style.width = Math.round(e.loaded*200/e.total)+"px";
		}, false);
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
				td.innerHTML = (xhr.status == 200 ? "OK" : "ERROR"); // TODO
				t.popup.resize();
				if (ondone) ondone(xhr);
			}
		};
		xhr.send(file);
	}
	
}