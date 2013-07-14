<?php 
global $app;
$app->user_management->logout();
?>
<script type='text/javascript'>
window.top.pn_loading_start();
window.location.href = "<?php echo "/dynamic/application/page/enter".(isset($_GET["from"]) ? "?from=".$_GET["from"] : "");?>";
</script>