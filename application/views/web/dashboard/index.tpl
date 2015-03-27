{include file="web/includes/header.tpl"}
<main id="content" role="main">

    <div class="container container-full">
        
        <div class="col-lg-6">

            <div class="row">
                <div class="col-lg-2"><h1>Apps</h1></div>
                <a data-toggle="modal" href="#add-app-form" class="btn btn-primary pull-right" style="margin: 20px 20px 0 0;"><span class="glyphicon glyphicon-plus"></span> Add App</a>   
            </div>

            <p>Here are all your defined applications</p>

            <table class="table">
                <thead>
                    <tr>
                        <th>App name</th>
                        <th>Hash</th>
                        <th>Date created</th>
                        <th>Status</th>
                    </tr>
                </thead>
                {foreach from=$apps item=app}
                    <tr>
                        <td onclick="document.location.href = '/app/edit/{$app.id}'" style="cursor: pointer">{$app.name}</td>
                        <td>{$app.hash}</td>
                        <td>{$app.date_created}</td>
                        <td>
                            <span class="label label-{if $app.status}success{else}danger{/if}">{if $app.status}ONLINE{else}OFFLINE{/if}</span>
                        </td>
                    </tr>  
                {/foreach}
            </table>

        </div>
    </div>

    <div id="add-app-form" class="modal fade in" style="display: none;">
        <div class="modal-dialog">
            <form name="app" class="modal-content" action="/app/add">
                <div class="modal-header">
                    <a class="close" data-dismiss="modal">×</a>
                    <h3>Create a new app</h3>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <label for="name">Application Name</label><br>
                        <input type="text" name="name" class="form-control" />
                    </div>
                    <div class="alert" role="alert" style="display: none">Please wait ... </div>
                </div>
                
                <div class="modal-footer">
                    <input class="btn btn-success" type="submit" value="Create" id="submit">
                </div>

            </form>
        </div>
    </div>
            
</main>
{include file="web/includes/footer.tpl"}