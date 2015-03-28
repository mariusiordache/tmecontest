{include file="web/includes/barebones-header.tpl"}

<div class="container">
	<div class="row">
         <h1>Once upon a type</h1>
         <div class="col-lg-4" id="editor">
            <ul id="slide-editors">
            </ul>         
            <button id="add-slide" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>
         </div>
         <div class="col-lg-8">
            <ul id="slides">
            </ul>       
            
            <div id="slideCanvasHolder">
                <div id="slideCanvas"></div>
            </div>
         </div>
    </div>
</div>

<div id="tagImageSelector" class="panel panel-default">
    <div class="panel-body">
        <ul class="items"></ul>
    </div>
</div>

<script type="text/backbone-template" id="slide-thumb-template">
    <a href="#">
        <img src="<%= data.url %>" />
    </a>
</script>

<script type="text/backbone-template" id="tag-template">
    <a href="#"><%= tag.label %></a>
</script>

<script type="text/backbone-template" id="slide-editor-template">  
    <div class="panel-body">
        <textarea class="form-control" rows="1" placeholder="Type your story"><%= slide.text %></textarea>
        <ul class="tags">
        
        </ul>
    </div>
</script>

<script type="text/backbone-template" id="image-selector-item-template">
    <img src="<%= data.link %>" />
</script>

{include file="web/includes/footer.tpl"}