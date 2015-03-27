{assign var="bodyclass" value="login"}
{include file="web/includes/barebones-header.tpl"}
<div class="container">
    
    <div class="row">
        <div class="left-box logo-box">
            <a href="{$config.base_url}" class="logo-link pull-left">
                <img src="{$config.assets.img_url}/img/logo.png" alt="T-Me Studios" />			
            </a>
            
            <h1>Timmy.SDK Manager</h1>
        </div>
    </div>

    <div class="row">
        
        <div class="col-lg-6">
            <form id="register-form" class="fade in" method="POST" action="/user/register">
                <input type="hidden" name="goback" value="{if isset($goback)}{$goback|form_prep}{/if}" />
                <fieldset>
                    <legend>Register</legend>
                    <p>Register to this awesome app</p>
                    <div class="form-group">
                        <label for="username">Email</label>
                        <input class="form-control" type="text" name="email" id="email" placeholder=""/>
                    </div>
                    <div class="form-group">
                        <label for="app_name">Application name</label>
                        <input class="form-control" type="text" name="app_name" id="app_name" placeholder=""/>
                    </div>
                    <div class="ajax-report text-danger"></div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary">Register</button>
                    </div>
                </fieldset>
            </form>

        </div>

        <div class="col-lg-6">
            <form id="login-form" class="fade in" method="POST" action="/user/post_login">
                <input type="hidden" name="goback" value="{if isset($goback)}{$goback|form_prep}{/if}" />
                <fieldset>
                    <legend>Log in</legend>
                    <p>Login if you already have an account</p>

                    <div class="form-group">
                        <label for="login">Email</label>
                        <input class="form-control" type="text" name="username" id="login_email" placeholder=""/>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input class="form-control" type="password" name="password" id="password" placeholder=""/>
                    </div>
                    <div class="ajax-report text-danger"></div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </fieldset>
            </form>
        </div>

        <div id="thanks" class="text-success">Please wait, we're redirecting you to your dashboard...</div>
        
    </div>
</div>
<div id="background_overlay"></div>
{include file="web/includes/footer.tpl"}