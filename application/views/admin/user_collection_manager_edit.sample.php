<!-- header -->
<?php include($crud_ignition_views_path . 'header.php'); ?><!-- END header -->
		<ul class="breadcrumb">
			<li>
				<a href="<?php echo $crud_ignition_url; ?>">CrudIgnition</a> <span class="divider">/</span>
			</li>
			<li>
				<a href="<?php echo $list_url; ?>"><?php echo $model; ?></a> <span class="divider">/</span>
			</li>
			<li class="active">
				edit
			</li>
		</ul>
		<h1 style="margin-bottom: 20px;">user</h1>
		<?php echo form_open_multipart(current_url()); ?>		

		<!-- field: id -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">id</label>
		<?php echo form_error('id', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('id', set_value('id', $item['id']), ' id="field_id" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_id']) ? true : false, ' class="toggler" data-field="field_id" '); ?> Ignore</label>

		<!-- field: date_created -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">date_created</label>
		<?php echo form_error('date_created', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('date_created', set_value('date_created', $item['date_created']), ' id="field_date_created"  data-plugin="datetimepicker" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_date_created']) ? true : false, ' class="toggler" data-field="field_date_created" '); ?> Ignore</label>

		<!-- field: email -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">email</label>
		<?php echo form_error('email', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('email', set_value('email', $item['email']), ' id="field_email" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_email']) ? true : false, ' class="toggler" data-field="field_email" '); ?> Ignore</label>

		<!-- field: username -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">username</label>
		<?php echo form_error('username', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('username', set_value('username', $item['username']), ' id="field_username" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_username']) ? true : false, ' class="toggler" data-field="field_username" '); ?> Ignore</label>

		<!-- field: password -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">password</label>
		<?php echo form_error('password', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('password', set_value('password', $item['password']), ' id="field_password" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_password']) ? true : false, ' class="toggler" data-field="field_password" '); ?> Ignore</label>

		<!-- field: name -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">name</label>
		<?php echo form_error('name', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('name', set_value('name', $item['name']), ' id="field_name" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_name']) ? true : false, ' class="toggler" data-field="field_name" '); ?> Ignore</label>

<div style="margin-top: 10px; padding-top: 10px; border-top: 1px; solid #DDD;">
	<button type="submit" class="btn">Save</button>
</div>

<?php echo form_close(); ?>
<?php include($crud_ignition_views_path . 'footer.php'); ?>