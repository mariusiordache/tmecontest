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
		<h1 style="margin-bottom: 20px;">image</h1>
		<?php echo form_open_multipart(current_url()); ?>		

		<!-- field: id -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">id</label>
		<?php echo form_error('id', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('id', set_value('id', $item['id']), ' id="field_id" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_id']) ? true : false, ' class="toggler" data-field="field_id" '); ?> Ignore</label>

		<!-- field: item_id -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">item_id</label>
		<?php echo form_error('item_id', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('item_id', set_value('item_id', $item['item_id']), ' id="field_item_id" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_item_id']) ? true : false, ' class="toggler" data-field="field_item_id" '); ?> Ignore</label>

		<!-- field: path -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">path</label>
		<?php echo form_error('path', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('path', set_value('path', $item['path']), ' id="field_path" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_path']) ? true : false, ' class="toggler" data-field="field_path" '); ?> Ignore</label>

		<!-- field: is_selected -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">is_selected</label>
		<?php echo form_error('is_selected', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('is_selected', set_value('is_selected', $item['is_selected']), ' id="field_is_selected" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_is_selected']) ? true : false, ' class="toggler" data-field="field_is_selected" '); ?> Ignore</label>

<div style="margin-top: 10px; padding-top: 10px; border-top: 1px; solid #DDD;">
	<button type="submit" class="btn">Save</button>
</div>

<?php echo form_close(); ?>
<?php include($crud_ignition_views_path . 'footer.php'); ?>