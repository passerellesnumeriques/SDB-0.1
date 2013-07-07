<?php
class MainSectionPage {

	public function __construct(&$page, $icon_32px_url, $title, $default_sub_page_url) {
		$this->page = &$page;
		$this->icon_32px_url = $icon_32px_url;
		$this->title = $title;
		$this->default_sub_page_url = $default_sub_page_url;
		$this->id = $this->page->component."__".$this->page->path;
		$this->id = str_replace("/","_", str_replace(".", "_", $this->id));
		$page->add_javascript("/static/common/js/horizontal_menu/horizontal_menu.js");
		$page->add_stylesheet("/static/common/js/horizontal_menu/horizontal_menu.css");
		$page->onload("new horizontal_menu('".$this->id."_horizontal_menu');");
	}

	private $page;
	private $icon_32px_url;
	private $title;
	private $default_sub_page_url;
	private $id;
	private $menu_items = array();
	private $menu_items_left = array();
	private $menu_items_left_add = array();
	
	public function add_menu_link($icon, $text, $url) {
		$html = "<span class='page_header_item' onclick=\"document.getElementById('".$this->id."_content').src='".$url."';\">";
		if ($icon <> null)
			$html .= "<img src='".$icon."'/> ";
		$html .= $text;
		$html .= "</span> ";
		array_push($this->menu_items, $html);
		if ($icon <> null) {
			$html = "<div style='padding:5px;cursor:pointer' onclick=\"document.getElementById('".$this->id."_content').src='".$url."';\" title=\"".$text."\">";
			$html .= "<img src='".$icon."'/>";
			$html .= "</div>";
		} else {
			$html = "<div style='padding:5px;cursor:pointer;transform:rotate(-90deg);-ms-transform:rotate(-90deg);-webkit-transform:rotate(-90deg)' onclick=\"document.getElementById('".$this->id."_content').src='".$url."';\">";
			$html .= $text;
			$html .= "</div> ";
		}
		array_push($this->menu_items_left, $html);
	}

	public function add_menu_content($html) {
		array_push($this->menu_items, $html);
		array_push($this->menu_items_left_add, $html);
	}

	public function generate() {
?>
<div class='page_header' id='<?php echo $this->id?>_header_top'>
	<table><tr>
	<td>
		<div class='page_header_title' style='position:relative'>
			<img src='/static/common/images/arrow_left_10.gif' style='position:absolute;top:0px;right:0px;cursor:pointer' onclick="<?php echo $this->id?>_page_toleft();"/>
			<img src='<?php echo $this->icon_32px_url?>'/>
			<?php echo $this->title?>
		</div>
	</td><td>
		<div class='page_header_content' id='<?php echo $this->id?>_horizontal_menu_container_top'>
			<div class='horizontal_menu' id='<?php echo $this->id?>_horizontal_menu'>
				<?php
				foreach ($this->menu_items as $item) {
					echo "<div>";
					echo $item;
					echo "</div>";
				}
				?>
				<div style='cursor:pointer'><img src='/static/application/more.png'/><?php locale("application","More")?></div>
			</div>
		</div>
	</td>
	</tr></table>
</div>
<div class='page_header_left' style='visibility:hidden;position:absolute;top:-10000px' id='<?php echo $this->id?>_header_left'>
	<div class='page_header_title_left' style='position:relative'>
		<img src='/static/common/images/arrow_up_10.gif' style='position:absolute;top:0px;right:0px;cursor:pointer' onclick="<?php echo $this->id?>_page_totop();"/>
		<img src='<?php echo $this->icon_32px_url?>' title="<?php echo $this->title?>"/>
	</div>
	<div class='page_header_content' id='<?php echo $this->id?>_horizontal_menu_container_left'>
		<?php
		if (count($this->menu_items_left_add) > 0) {
		?>
		<div style='cursor:pointer;padding:5px' onclick='<?php echo $this->id?>_left_more(this)'><img src='/static/application/more.png' title="<?php locale("application","More")?>"/></div>
		<div id='<?php echo $this->id?>_page_header_left_more' style='visibility:hidden;position:absolute;top:-10000px'>
		<?php
		foreach ($this->menu_items_left_add as $item) {
			echo $item;
		}
		?>
		</div>
		<?php
		}
		foreach ($this->menu_items_left as $item) {
			echo $item;
		}
		?>
	</div>
</div>
<iframe class='page_content' frameBorder=0 src="<?php echo $this->default_sub_page_url?>" style='width:100%;margin:0px;padding:0px;border:0px' id='<?php echo $this->id?>_content' name='<?php echo $this->id?>_content'></iframe>
<script type='text/javascript'>
function <?php echo $this->id?>_resize_frame_vertical() {
	var frame = document.getElementById('<?php echo $this->id?>_content');
	var header = document.getElementById('<?php echo $this->id?>_header_top');
	frame.style.position = "absolute";
	frame.style.left = "0px";
	frame.style.top = header.offsetHeight+"px";
	frame.style.width = "100%";
	frame.style.height = (getWindowHeight()-header.offsetHeight)+"px";
}
function <?php echo $this->id?>_resize_frame_horizontal() {
	var frame = document.getElementById('<?php echo $this->id?>_content');
	var header = document.getElementById('<?php echo $this->id?>_header_left');
	frame.style.position = "absolute";
	frame.style.top = "0px";
	frame.style.left = header.offsetWidth+"px";
	frame.style.height = "100%";
	frame.style.width = (getWindowWidth()-header.offsetWidth)+"px";
}
<?php echo $this->id?>_resize_frame = <?php echo $this->id?>_resize_frame_vertical;
<?php echo $this->id?>_resize_frame();
addLayoutEvent(document.body,function(){<?php echo $this->id?>_resize_frame();});

function <?php echo $this->id?>_page_toleft() {
	var header = document.getElementById('<?php echo $this->id?>_header_top');
	header.style.visibility = 'hidden';
	header.style.position = 'absolute';
	header.style.top = "-10000px";
	header = document.getElementById('<?php echo $this->id?>_header_left');
	header.style.visibility = 'visible';
	header.style.position = 'static';
	<?php echo $this->id?>_resize_frame = <?php echo $this->id?>_resize_frame_horizontal;
	<?php echo $this->id?>_resize_frame();
	fireLayoutEventFor(document.body);
}
function <?php echo $this->id?>_page_totop() {
	var header = document.getElementById('<?php echo $this->id?>_header_left');
	header.style.visibility = 'hidden';
	header.style.position = 'absolute';
	header.style.top = "-10000px";
	header = document.getElementById('<?php echo $this->id?>_header_top');
	header.style.visibility = 'visible';
	header.style.position = 'static';
	<?php echo $this->id?>_resize_frame = <?php echo $this->id?>_resize_frame_vertical;
	<?php echo $this->id?>_resize_frame();
	fireLayoutEventFor(document.body);
}

function <?php echo $this->id?>_left_more(button) {
	add_stylesheet("/static/common/js/context_menu/context_menu.css");
	add_javascript("/static/common/js/context_menu/context_menu.js",function(){
		var content = document.getElementById('<?php echo $this->id?>_page_header_left_more');
		var next = content.nextSibling;
		var parent = content.parentNode;
		parent.removeChild(content);
		content.style.visibility = "visible";
		var menu = new context_menu();
		menu.addItem(content, true);
		menu.onclose = function() {
			content.style.visibility = "hidden";
			content.style.position = "absolute";
			parent.insertBefore(content,next);
		};
		menu.showBelowElement(button);
	});
}
</script>
<?php
	}

}
?>