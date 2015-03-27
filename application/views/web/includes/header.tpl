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
                (function(i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function() {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                            m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

                ga('create', 'UA-40125707-2', 'androidmakeup.com');
                ga('send', 'pageview');

            </script>
        {/literal}

        {$meta}
    </head>
    <body> 
        <header class="navbar navbar-default navbar-fixed-top" role="banner">
            <div class="container container-full">
                <nav class="collapse navbar-collapse am-navbar-collapse" role="navigation">
                    <ul class="nav navbar-nav">
                        <li><a href="{$config.base_url}"><span class="glyphicon glyphicon-home"></span> T-me</a></li>
                        {if isset($topnav)}
                            {foreach from=$topnav item=item}
                                <li {if !empty($item.active)}class="active"{/if}><a href="{$item.url}">{$item.label}</a></li>
                            {/foreach}
                        {/if}

                    </ul>

                    <a href="/user/logout" class="pull-right btn btn-danger" style="margin-top: 8px;">Logout</a>
                </nav>
            </div>
        </header>
                        
        <div class="container">