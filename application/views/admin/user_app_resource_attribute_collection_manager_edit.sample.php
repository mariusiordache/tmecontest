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
		<h1 style="margin-bottom: 20px;">user_app_resource_attribute</h1>
		<?php echo form_open_multipart(current_url()); ?>		

		<!-- field: id -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">id</label>
		<?php echo form_error('id', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('id', set_value('id', $item['id']), ' id="field_id" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_id']) ? true : false, ' class="toggler" data-field="field_id" '); ?> Ignore</label>

		<!-- field: app_id -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">app_id</label>
		<?php echo form_error('app_id', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('app_id', set_value('app_id', $item['app_id']), ' id="field_app_id" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_app_id']) ? true : false, ' class="toggler" data-field="field_app_id" '); ?> Ignore</label>

		<!-- field: item -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">item</label>
		<?php echo form_error('item', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('item', set_value('item', $item['item']), ' id="field_item" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_item']) ? true : false, ' class="toggler" data-field="field_item" '); ?> Ignore</label>

		<!-- field: value -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">value</label>
		<?php echo form_error('value', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_textarea('value', set_value('value', $item['value']), ' id="field_value" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_value']) ? true : false, ' class="toggler" data-field="field_value" '); ?> Ignore</label>

<div style="margin-top: 10px; padding-top: 10px; border-top: 1px; solid #DDD;">
	<button type="submit" class="btn">Save</button>
</div>

<?php echo form_close(); ?>
<?php include($crud_ignition_views_path . 'footer.php'); ?>