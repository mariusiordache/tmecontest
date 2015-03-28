{include file="web/includes/barebones-header.tpl"}

<div class="container">
	<div class="row">
        <h1>This is where you begin</h1>
        <form action="new_story_submit" method="post">
            <input type="text" name="name" placeholder="The name of your story?" class="form-control"/>
            <div class="pull-left" style="margin-top: 10px">
                <input class="btn btn-lg btn-success" type="submit" value="Create" id="submit">
            </div>
            <div class="alert" role="alert" style="display: none">Please wait ... </div>
        </form>
    </div>
</div>

{include file="web/includes/footer.tpl"}