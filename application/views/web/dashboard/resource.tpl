{include file="web/includes/header.tpl"}
<main id="content" role="main">

    <script type="text/javascript">
        var configs = {$configs|@json_encode};
        var items = {$items|@json_encode};
        var attributes = {$attributes|@json_encode};
        var resource = {$resource|@json_encode};
        var userSettings = {$userSettings|@json_encode};
    </script>

    <div class="container container-full">
        <h1>
            Edit {$type.name} - {$resource.name}
        </h1>
            
        <div class="upload-settings">
            <a href="javascript:" id="packfilesbtn" class="btn btn-success" style="{if !$pack_needed}display:none{/if}"><span class="glyphicon glyphicon-lock"></span> Pack files</a>
        </div>
            
        <div class="col-lg-6">
            
            <div class="alert alert-danger" style="display:none" id="main-alert-box">Test</div>

            <p>Here you can add/remove files for the current resource.</p>

            <!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
                <li class="dropdown">
                    <a href="#" id="addConfig" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-plus"></span> Add Config</a>
                    <ul class="dropdown-menu" role="menu" aria-labelledby="addConfig">

                    </ul>
                </li>
            </ul>

            <div class="tab-content" id="mainTabs">
                

            </div>

        </div>
            
        <div class="col-lg-6">
            <div class="panel panel-default settings">
                <div class="panel-heading panel-title">Customize preview item</div>
                <div class="panel-body">
                    <form action="/resources/saveResourceAttributes/{$resource.id}" class="col-lg-9"> 
                        <table class="table" id="attributes-table" style="margin-top: 0px;">
                            <thead>
                                <tr>
                                    <th class="col-sm-2">Identifier</th>
                                    <th class="col-sm-8">Value</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>

                        <div class="alert fade in" style="display:none"></div>

                        <div style="clear:both"></div>

                        <button type="submit" class="btn btn-primary">Save Attributes</button>
                    </form>
                </div>
            </div>
                    
            <div class="panel panel-default">
                <div class="panel-heading panel-title">API example</div>
                <div class="panel-body">
                    <p>Resource Url</p>
                    <pre>/api/resource/&lt;id&gt;</pre>
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
                            <td>config_id</td>
                            <td>
                                Specify the Id for the config you require.
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th width="20">ID</th>
                                        <th>Name</th>
                                    </tr>
                                    </thead>
                                    {foreach from=$configs item=cfg}
                                    <tr>
                                        <td>{$cfg.id}</td>
                                        <td>{$cfg.name}</td>
                                    </tr>
                                    {/foreach}
                                </table>
                            </td>
                            <td>No</td>
                            <td>1</td>
                        </tr>
                    </table>

                    <div class="api-auto-call">
                        <p>Request example:</p>
                        <pre class="url">/api/resource/{$resource.id}?hash={$app.hash}</pre>
                        <pre class="result"></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
                
{literal}
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td style="width:80px">
            {% if (!o.files.error) { %}
                <div class="progress progress-bar progress-bar-success progress-bar-striped active pull-right" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="width: 100px; height:20px; margin-bottom:0px;"></div>
            {% } %}
            <span class="preview"></span>
        </td>
        <td>
            <input type="hidden" name="path[]" />
            <input type="text" style="display:none" name="identifier[]" value="" class="form-control" />
            <span class="filename">{%=file.name%}</span>
            {% if (file.error) { %}
                <div><span class="label label-important">Error</span> {%=file.error%}</div>
            {% } %}
        </td>
        <td>
            <span class="size pull-left">{%=o.formatFileSize(file.size)%}</span>
        </td>
        <td>
            <a href="javascript:" class="btn btn-danger delete"><span class="glyphicon glyphicon-remove"></span> Delete</a>
        </td>
    </tr>
{% } %}
</script>
<script id="template-download" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-download fade">
        {% if (file.error) { %}
            <td></td>
            <td class="name"><span>{%=file.name%}</span></td>
            <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
            <td class="error" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>
        {% } else { %}
            <td class="preview">{% if (file.thumbnail_url) { %}
                <a href="{%=file.url%}" title="{%=file.name%}" data-gallery="gallery" download="{%=file.name%}"><img src="{%=file.thumbnail_url%}"></a>
            {% } %}</td>
            <td class="name">
                <a href="{%=file.url%}" title="{%=file.name%}" data-gallery="{%=file.thumbnail_url&&'gallery'%}" download="{%=file.name%}">{%=file.name%}</a>
            </td>
            <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
            <td colspan="2"></td>
        {% } %}
        <td class="delete">
            <button class="btn btn-danger" data-type="{%=file.delete_type%}" data-url="{%=file.delete_url%}"{% if (file.delete_with_credentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
                <i class="icon-trash icon-white"></i>
                <span>Delete</span>
            </button>
            <input type="checkbox" name="delete" value="1">
        </td>
    </tr>
{% } %}
</script>
{/literal}

<script type="backbone/template" id="tab-pane-clone">
    <p>Here are all items available for <%= config.name %>. You can upload an archive or upload items manually.</p>
    
    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist">
        <li class="active"><a href="#config-<%= config.id %>-files" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-file"></span> Files</a></li>
        <li><a href="#config-<%= config.id %>-colors" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-tint"></span> Colors</a></li>
        <li><a href="#config-<%= config.id %>-strings" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-font"></span> Strings</a></li>
    </ul>

    <div class="tab-content">
        <div class="tab-pane active" id="config-<%= config.id %>-files">
            <form id="fileupload-<%= config.id %>" action="/resources/upload/{$resource.id}/<%= config.id %>" method="POST" enctype="multipart/form-data">
        
                <div class="row-fluid fileupload-buttonbar">
                    <div class="span7">
                        <!-- The fileinput-button span is used to style the file input field as button -->

                        <span class="btn btn-success fileinput-button">
                            <i class="icon-plus icon-white"></i>
                            <span>Add files...</span>
                            <input type="file" name="files[]" multiple>
                        </span>

                        <br />

                        <!-- The loading indicator is shown during file processing -->
                        <span class="fileupload-loading"></span>
                    </div>
                    <!-- The global progress information -->
                    <div class="span5 fileupload-progress fade">
                        <!-- The global progress bar -->
                        <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                            <div class="bar" style="width:0%;"></div>
                        </div>
                        <!-- The extended global progress information -->
                        <div class="progress-extended">&nbsp;</div>
                    </div>


                </div>

                <div class="upload-preview" style="display:none">
                    <input type="hidden" name="config_id" value="<%= config.id %>" />
                    <!-- The table listing the files available for upload/download -->
                    <table role="presentation" class="table" >
                        <thead>
                            <th style="width: 80px">Preview</th>
                            <th>Identifier</th>
                            <th>File size</th>
                            <th style="width: 80px;">Action</th>
                        </thead>
                        <tbody class="files"></tbody>
                    </table>

                    <a href="javascript:" class="btn btn-primary upload-items">Save Items</a>
                    <hr />
                </div>
            </form>

            <table class="table db-file">
                <thead>
                    <tr>
                        <th width="20">&nbsp;</th>
                        <th>Identifier</th>
                        <th width="100">Type</th>
                        <th width="130">Uploaded</th>
                        <th width="100">Size</th>
                        <th width="20">&nbsp;</th>
                    </tr>
                </thead>
            </table>
        </div>

        <div class="tab-pane" id="config-<%= config.id %>-colors">
        
            <div class="panel">
                <form class="panel-body addColorForm" action="/resources/addCustomItem/color/{$resource.id}/<%= config.id %>" method="POST">
                    <div class="form-group col-lg-4">
                        <label>Identifier</label>
                        <input type="text" class="form-control" name="item[item]" />
                    </div>

                    <div class="form-group col-lg-2" style="padding:0px;">
                        <label>Color</label>
                        <input type="text" class="form-control" name="item[value]" />
                    </div>

                    <div class="col-lg-2">
                        <button type="submit" style="margin-top: 25px" class="btn btn-success">Add Color</button>
                    </div>

                </form>
            </div>
            
    
            <table class="table db-color">
                <thead>
                    <tr>
                        <th width="30">&nbsp;</th>
                        <th width="240">Identifier</th>
                        <th>Color</th>
                        <th width="20">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>

        <div class="tab-pane" id="config-<%= config.id %>-strings">
        
            <div class="panel">
                <form class="panel-body addStringForm" action="/resources/addCustomItem/string/{$resource.id}/<%= config.id %>" method="POST">
                    <div class="form-group col-lg-4">
                        <label>Identifier</label>
                        <input type="text" class="form-control" name="item[item]" />
                    </div>

                    <div class="form-group col-lg-6 style="padding:0px;">
                        <label>String</label>
                        <input type="text" class="form-control" name="item[value]" />
                    </div>

                    <div class="col-lg-2">
                        <button type="submit" style="margin-top: 25px" class="btn btn-success">Add String</button>
                    </div>

                </form>
            </div>
    
            <table class="table db-string">
                <thead>
                    <tr>
                        <th width="20">&nbsp;</th>
                        <th>Identifier</th>
                        <th>String</th>
                        <th width="20">&nbsp;</th>
                    </tr>
                </thead>
            </table>
        </div>

    </div>
    
    
</script>

<script type="backbone/template" id="attribute-item">
    <td><%= item.item %></td>
    <td>
        <% if (item.type == 'text') { %>
            <input type="text" name="attributes[<%= item.item %>]" class="form-control" value="<%= item.value %>" />
        <% } else { %>
            <textarea name="attributes[<%= item.item %>]" class="form-control"><%= item.value %></textarea>
        <% } %>
    </td>
</script>

<script type="backbone/template" id="uploading-item-hidden">
    <input type="hidden" name="path[]" value="<%= file.path %>" />
    <input type="hidden" name="identifier[]" value="<%= file.identifier %>" />
</script>

<script type="backbone/template" id="uploading-item">
    <td style="width:80px">
        <% if (file.url) { %>
            <span class="preview"><img src="<%= file.url %>" style="max-with:72px; max-height:34px;" /></span>
        <% } %>
    </td>
    <td>
        <input type="hidden" name="path[]" value="<%= file.path %>" />
        <input type="text" name="identifier[]" value="<%= file.identifier %>" class="form-control" />
        <% if (file.error) { %>
            <div><span class="label label-important">Error</span> <%=file.error %></div>
        <% } %>
    </td>
    <td>
        <span class="size pull-left"><%= file.size %></span>
    </td>
    <td>
        <a href="javascript:" class="btn btn-danger delete"><span class="glyphicon glyphicon-remove"></span> Delete</a>
    </td>
</script>

<script type="backbone/template" id="settings-button">
    <a href="javascript:" class="btn <%= item.value == 0 ? 'btn-info' : 'btn-primary' %>" data-container="body" data-toggle="popover" data-placement="left" title="<%= item.title %> [ <%= item.value != 0 ? 'ON' : 'OFF' %> ]" data-content="<%= item.description %>. Click to <%= item.value != 0 ? 'dis' : 'en' %>able.">
        <span class="glyphicon glyphicon-<%= item.icon %>"></span>
    </a>
</script>

<script type="backbone/template" id="tab-item">
    <a href="#config-<%= config.id %>" role="tab" data-toggle="tab"><%= config.name %></a>
</script>

<script type="backbone/template" id="dropdown-item">
    <a href="javascript:" data-config-id="<%= config.id %>"><%= config.name %></a>
</script>

<script type="backbone/template" id="resource_status">
    <a href="javascript:" style="font-size:14px; " class="label label-<%= resource.status > 0 ? 'success' : 'danger' %>"><%= resource.status > 0 ? 'ONLINE' : 'OFFLINE' %></a>
</script>

<script type="backbone/template" id="resource-file">
    <td>
        <a href="<%= resource.store_dir + '/' + item.config_id + '/' + item.value %>" target="_new" title="Download file"><span class="glyphicon glyphicon glyphicon-file"></span></a>
    </td>
    <td><%= item.item %></td>
    <td><%= item.type %> <%= item.type == 'file' ? '<i>('+item.ext+')</i>' : '' %></td>
    <td><%= item.last_updated %></td>
    <td><%= item.filesize %></td>
    <td>
        <a href="javascript:" title="Remove item" data-item-id="<%= item.id %>"><span style="color:red;" class="glyphicon glyphicon-remove"></span></a>
    </td>
</script>

<script type="backbone/template" id="resource-color">
    <td><div class="color-container"><div style="background:#<%= item.value %>;">&nbsp;</div></div></td>
    <td><%= item.item %></td>
    <td>#<%= item.value %></td>
    <td>
        <a href="javascript:" title="Remove item" data-item-id="<%= item.id %>"><span style="color:red;" class="glyphicon glyphicon-remove"></span></a>
    </td>
</script>

<script type="backbone/template" id="resource-string">
    <td>&nbsp;</td>
    <td><%= item.item %></td>
    <td><%= item.value %></td>
    <td>
        <a href="javascript:" title="Remove item" data-item-id="<%= item.id %>"><span style="color:red;" class="glyphicon glyphicon-remove"></span></a>
    </td>
</script>

{include file="web/includes/footer.tpl"}