{include file="web/includes/barebones-header.tpl"}

<script type="text/javascript">
    backend_story_id = "{$story_id}";
</script>


<div class="container-fluid">
    <h1>Once upon a type</h1>
	<div class="row" id="main">
         <div class="col-lg-4" id="editor">
            <ul id="slide-editors">
            </ul>         
            <button id="add-slide" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>
            <button id="show-story" class="btn btn-default">show story</button>
         </div>
         <div class="col-lg-8" class="scrollable">
            <ul id="slides">
            </ul>       
            
            <div id="slideCanvasHolder">
                
            </div>
         </div>
    </div>
</div>

<div id="tagImageSelector" class="panel panel-default">
    <div class="panel-body">
        <ul class="items"></ul>
        <button id="moreResults" class="btn btn-default">next</button>
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
        <textarea class="form-control" rows="1" placeholder="Type your story"><%= slide.paragraph %></textarea>
        <ul class="tags">
        
        </ul>
        <img class="loader" src="/assets/tiny-loader.gif" />
    </div>
</script>

<script type="text/backbone-template" id="image-selector-item-template">
    <img src="<%= data.image.thumbnailLink %>" />
</script>

{include file="web/includes/footer.tpl"}