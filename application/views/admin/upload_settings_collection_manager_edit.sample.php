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
		<h1 style="margin-bottom: 20px;">upload_settings</h1>
		<?php echo form_open_multipart(current_url()); ?>		

		<!-- field: id -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">id</label>
		<?php echo form_error('id', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('id', set_value('id', $item['id']), ' id="field_id" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_id']) ? true : false, ' class="toggler" data-field="field_id" '); ?> Ignore</label>

		<!-- field: item -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">item</label>
		<?php echo form_error('item', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('item', set_value('item', $item['item']), ' id="field_item" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_item']) ? true : false, ' class="toggler" data-field="field_item" '); ?> Ignore</label>

		<!-- field: title -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">title</label>
		<?php echo form_error('title', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('title', set_value('title', $item['title']), ' id="field_title" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_title']) ? true : false, ' class="toggler" data-field="field_title" '); ?> Ignore</label>

		<!-- field: description -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">description</label>
		<?php echo form_error('description', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('description', set_value('description', $item['description']), ' id="field_description" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_description']) ? true : false, ' class="toggler" data-field="field_description" '); ?> Ignore</label>

		<!-- field: icon -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">icon</label>
		<?php echo form_error('icon', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('icon', set_value('icon', $item['icon']), ' id="field_icon" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_icon']) ? true : false, ' class="toggler" data-field="field_icon" '); ?> Ignore</label>

		<!-- field: default_value -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">default_value</label>
		<?php echo form_error('default_value', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('default_value', set_value('default_value', $item['default_value']), ' id="field_default_value" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_default_value']) ? true : false, ' class="toggler" data-field="field_default_value" '); ?> Ignore</label>

<div style="margin-top: 10px; padding-top: 10px; border-top: 1px; solid #DDD;">
	<button type="submit" class="btn">Save</button>
</div>

<?php echo form_close(); ?>
<?php include($crud_ignition_views_path . 'footer.php'); ?>