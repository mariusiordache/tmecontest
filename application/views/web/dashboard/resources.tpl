{include file="web/includes/header.tpl"}
<main id="content" role="main">

    <script type="text/javascript">
        var resources = {$resources|@json_encode};
        var configs = {$configs|@json_encode};
    </script>
    
    <div class="container container-full">
        <div class="col-lg-6">
            <h1>
                {$app.name} - {$type.name}
                <a href="javascript:" class="pull-right btn btn-primary"><span class="glyphicon glyphicon-cog"></span></a>
            </h1>

            <p>Here are all resources of type <i>{$type.name}</i> for your app <b>#{$app.name}</b></p>

            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th style="width:100px;">Status</th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr class="last">
                        <td colspan="3">
                            <button data-toggle="modal" data-target="#add-resource-form" class="btn btn-primary pull-left" ><span class="glyphicon glyphicon-plus"></span> Add resource</button>   
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
            
        <div class="col-lg-6 configure">
            <div class="panel panel-default settings" style="display:none;">
                <div class="panel-heading panel-title">Configuration</div>
                <div class="panel-body">
                    <form action="/resources/saveConfiguration/{$app.id}/{$type.id}" class="form-horizontal">
                        <h4>Preview Item</h4>
                        <p><i>File</i> type must be uploaded with the specified identifier ( You can upload one file for each configuration ). 
                            For <i>Text</i> and <i>Textarea</i> types you will have to edit each resource. 
                            <i>Resource</i> type represents the Resource Name and it can't be changed.<br />
                            Set <b>Required</b> <i>ON</i> to prevent users from publishing resources without configuring the specified identifier.
                        </p>
                        <table class="table" id="configItems">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Identifier</th>
                                    <th>Required</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                        </table>
                        <div class="alert fade in col-sm-9" style="display:none"></div>
                        
                        <div style="clear:both"></div>
                        
                        <button type="submit" class="btn btn-primary">Save Configuration</button>
                    </form>
                </div>
            </div>
                        
            <div class="panel panel-default">
                <div class="panel-heading panel-title">API example</div>
                <div class="panel-body">
                    <p>Base Url {$type.name}</p>
                    <pre>/api/resource/{$type.identifier}</pre>
                    <p>Parameters</p>
                    <table class="table">
                        <thead>
                            <tr>
                                <th width="100">parameter</th>
                                <th>description</th>
                                <th width="80">Required</th>
                                <th width="80">Default</th>
                            </tr>
                        </thead>
                        <tr>
                            <td>page</td>
                            <td>Specify the page number when using limit to narrow the results.</td>
                            <td>No</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>limit</td>
                            <td>Limit the number of {$type.name} per page.</td>
                            <td>No</td>
                            <td>10</td>
                        </tr>
                    </table>
                    
                    <div class="api-auto-call">
                        <p>Request example:</p>
                        <pre class="url">/api/resource/{$type.identifier}?hash={$app.hash}&page=1&limit=2</pre>
                        <pre class="result"></pre>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
            
    <div id="add-resource-form" class="modal fade in" style="display: none;">
        <div class="modal-dialog">
            <form name="app" class="modal-content" action="/resources/add">
                <input type="hidden" name="app_id" value="{$app.id}" />
                <input type="hidden" name="type_id" value="{$type.id}" />
                
                <div class="modal-header">
                    <a class="close" data-dismiss="modal">×</a>
                    <h4>Create a new <b>{$type.name}</b> resource for <b>{$app.name}</b></h4>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <label for="name">Resource Name</label><br>
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
   
<script type="backbone/template" id="config-item">
    <td class="col-sm-2">
        <input type="hidden" name="config[id][<%= resource_id %>]" value="<%= item.id %>" />
        <select class="form-control" name="config[type][<%= resource_id %>]">
            {foreach from=$config_types item=ctype}
                <option value="{$ctype}">{$ctype|@ucfirst}</option>
            {/foreach}
        </select>
    </td>
    <td class="col-sm-6">
        <input type="text" name="config[item][<%= resource_id %>]" class="form-control" value="<%= item.item %>" />
    </td>
    <td>
        <input type="checkbox" class="switch" name="config[required][<%= resource_id %>]" <%= item.required === '1' ? 'checked="checked"' : '' %> />
    </td>
    <td class="inline actions">
        <a href="javascript:" class="btn btn-danger" title="Delete item"><span class="glyphicon glyphicon-remove"></span></a>
        <a href="javascript:" class="btn btn-primary" title="Add new item"><span class="glyphicon glyphicon glyphicon-plus"></span></a>
    </td>
</script>

<script type="backbone/template" id="resource_item">
    <td><a href="/resources/edit/<%= resource.id %>"><%= resource.name %></a></td>
    <td>
        <span class="label label-<%= resource.status > 0 ? 'success' : 'danger' %>"><%= resource.status > 0 ? 'ONLINE' : 'OFFLINE' %></span>
    </td>
</script>

{include file="web/includes/footer.tpl"}