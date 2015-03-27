<!DOCTYPE html>
<html>
<head>
{$conditionalCSS}
{$css}
{$less}
{$conditionalJS}
{$js}

{if isset($js_page_data)}
<script type="text/javascript">
    PAGE_DATA = {$js_page_data|json_encode};
</script>
{/if}

{literal}
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-40125707-2', 'androidmakeup.com');
  ga('send', 'pageview');
</script>
{/literal}

{$meta}
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body {if !empty($bodyclass)}class="{$bodyclass}"{/if}> 
    <div class="wrapper">