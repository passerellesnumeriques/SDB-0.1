<?php
require_once("common/PHPExcel.php");
/**
 * @param PHPExcel $excel
 */
function display_excel_file($excel) {
	echo "<div id='excel_file'>";
	for ($sheet_i = 0; $sheet_i < $excel->getSheetCount(); $sheet_i++) {
		$sheet = $excel->getSheet($sheet_i);
		echo "<div title=\"".htmlspecialchars($sheet->getTitle(), ENT_QUOTES, "UTF-8")."\" style='overflow:auto;width:100%;height:100%;position:relative'>";
		echo "<table style='border-collapse:collapse;";
		echo "'>";
		foreach ($sheet->getRowIterator() as $row) {
			$height = $sheet->getRowDimension($row->getRowIndex())->getRowHeight();
			if ($height == -1) $height = $sheet->getDefaultRowDimension()->getRowHeight();
			echo "<tr".($height <> -1 ? " height='".$height."px'" : "").">";
			$it = $row->getCellIterator();
			$it->setIterateOnlyExistingCells(false);
			foreach ($it as $cell) {
				$colspan = 1;
				$rowspan = 1;
				foreach ($sheet->getMergeCells() as $merge) {
					if ($cell->isInRange($merge)) {
						// check if this is the first one
						$range = PHPExcel_cell::rangeBoundaries($merge);
						if ($range[0][0] == PHPExcel_Cell::columnIndexFromString($cell->getColumn()) && $range[0][1] == $cell->getRow()) {
							$colspan = $range[1][0]-$range[0][0]+1;
							$rowspan = $range[1][1]-$range[0][1]+1;
							break;
						} else {
							$rowspan = 0;
							break;
						}
					}
				}
				if ($rowspan == 0) continue; // merged cell
				echo "<td colspan=".$colspan." rowspan=".$rowspan;
				$style = $sheet->getStyle($cell->getCoordinate());
				echo " style='";
				echo "font-family:".$style->getFont()->getName().";";
				echo "font-size:".$style->getFont()->getSize()."pt;";
				if ($style->getFont()->getItalic())
					echo "font-style:italic;";
				if ($style->getFont()->getBold())
					echo "font-weight:bold;";
				echo "color:#".$style->getFont()->getColor()->getRGB().";";
				$border = excel_get_border($style->getBorders()->getTop(), $sheet->getShowGridlines());
				if ($border <> null) echo "border-top:".$border.";";
				$border = excel_get_border($style->getBorders()->getBottom(), $sheet->getShowGridlines());
				if ($border <> null) echo "border-bottom:".$border.";";
				$border = excel_get_border($style->getBorders()->getLeft(), $sheet->getShowGridlines());
				if ($border <> null) echo "border-left:".$border.";";
				$border = excel_get_border($style->getBorders()->getRight(), $sheet->getShowGridlines());
				if ($border <> null) echo "border-right:".$border.";";
				switch ($style->getAlignment()->getHorizontal()) {
					case PHPExcel_Style_Alignment::HORIZONTAL_CENTER: echo "text-align:center;"; break;
					case PHPExcel_Style_Alignment::HORIZONTAL_LEFT: echo "text-align:left;"; break;
					case PHPExcel_Style_Alignment::HORIZONTAL_RIGHT: echo "text-align:right;"; break;
				}
				switch ($style->getAlignment()->getVertical()) {
					case PHPExcel_Style_Alignment::VERTICAL_BOTTOM: echo "vertical-align:bottom;"; break;
					case PHPExcel_Style_Alignment::VERTICAL_CENTER: echo "vertical-align:middle;"; break;
					case PHPExcel_Style_Alignment::VERTICAL_TOP: echo "vertical-align:top;"; break;
				}
				echo "'";
				//echo " width='".round($sheet->getColumnDimension()->getWidth())."pt'";
				echo ">";
				echo $cell->getValue();
				echo "</td>";
			}
			echo "</tr>";
		}
		echo "</table>";
		echo "</div>";
	}
	echo "</div>";
	?>
<script type='text/javascript'>
add_javascript('/static/common/js/tabs/tabs.js',function(){
	new tabs('excel_file');
});
</script>
	<?php
}

function excel_get_border($style, $grid) {
	$border = null;
	switch ($style->getBorderStyle()) {
		case PHPExcel_Style_Border::BORDER_NONE: $border = null; break;
		case PHPExcel_Style_Border::BORDER_DASHDOT: $border = "1px dashed"; break;
		case PHPExcel_Style_Border::BORDER_DASHDOTDOT: $border = "1px dotted"; break;
		case PHPExcel_Style_Border::BORDER_DASHED: $border = "1px dashed"; break;
		case PHPExcel_Style_Border::BORDER_DOTTED: $border = "1px dotted"; break;
		case PHPExcel_Style_Border::BORDER_DOUBLE: $border = "2px solid"; break;
		case PHPExcel_Style_Border::BORDER_MEDIUM: $border = "2px solid"; break;
		case PHPExcel_Style_Border::BORDER_MEDIUMDASHDOT: $border = "2px dotted"; break;
		case PHPExcel_Style_Border::BORDER_MEDIUMDASHDOTDOT: $border = "2px dotted"; break;
		case PHPExcel_Style_Border::BORDER_MEDIUMDASHED: $border = "2px dashed"; break;
		case PHPExcel_Style_Border::BORDER_SLANTDASHDOT: $border = "1px dotted"; break;
		case PHPExcel_Style_Border::BORDER_THICK: $border = "1px solid"; break;
		case PHPExcel_Style_Border::BORDER_THIN: $border = "1px solid"; break;
	}
	if ($border <> null)
		$border .= " #".$style->getColor()->getRGB();
	return $border <> null ? $border : ($grid ? "1px dotted #8080F0" : "none");
}

?>