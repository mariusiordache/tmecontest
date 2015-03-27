{include file="web/includes/header.tpl"}
<main id="content" role="main">

    <script type="text/javascript">
        var app_types = {$app_types|@json_encode};
        var app = {$app|@json_encode};
    </script>

    <div class="container container-full">
        <div class="col-lg-6">
            <h1>
                {$app.name}
            </h1>

            <p>This is your application overview. You can define storage items</p>

            <table class="table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Identifier</th>
                        <th>Quota</th>
                        <th style="width:100px;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="last">
                        <td colspan="3">
                            <button data-toggle="modal" data-target="#add-type-form" class="btn btn-primary pull-left" ><span class="glyphicon glyphicon-plus"></span> New Category</button>   
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div id="add-type-form" class="modal fade" style="display: none;">
        <div class="modal-dialog">
            <form name="apptype" class="modal-content" action="/apptype/add">
                <div class="modal-header">
                    <a class="close" data-dismiss="modal">×</a>
                    <h3>Create new category</h3>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label for="name">Category Name</label><br>
                        <input type="text" name="name" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="name">Identifier ( allowed alpha-numeric-dash ) </label><br>
                        <input type="text" name="identifier" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="name">Restrict type to {$app.name} only</label>
                        <input type="checkbox" name="app_id" value="{$app.id}" class="switch" />
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
            
<script type="backbone/template" id="app_status">
    <a href="javascript:" style="font-size:14px; " class="label label-<%= app.status > 0 ? 'success' : 'danger' %>"><%= app.status > 0 ? 'ONLINE' : 'OFFLINE' %></a>
</script>

<script type="backbone/template" id="app_type">
    <td><a href="/resources/view/{$app.id}/<%= type.id %>"><%= type.name %> (<%= type.count %>)</a></td>
    <td><%= type.identifier %></td>
    <td><%= (type.quota > 0) ? type.quota + "/day" : "unlimited" %></td>
    <td>
        <span class="label label-<%= type.count > 0 ? 'success' : 'danger' %>" style="width: 50px; float: left;"><%= type.count > 0 ? 'ON' : 'OFF' %></span>
    </td>
</script>
{include file="web/includes/footer.tpl"}