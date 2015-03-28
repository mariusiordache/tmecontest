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
		<h1 style="margin-bottom: 20px;">slide</h1>
		<?php echo form_open_multipart(current_url()); ?>		

		<!-- field: id -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">id</label>
		<?php echo form_error('id', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('id', set_value('id', $item['id']), ' id="field_id" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_id']) ? true : false, ' class="toggler" data-field="field_id" '); ?> Ignore</label>

		<!-- field: story_id -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">story_id</label>
		<?php echo form_error('story_id', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_dropdown('story_id', isset($story_id_options) ? $story_id_options : $fields['story_id']['options'], set_value('story_id', $item['story_id']), ' id="field_story_id" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_story_id']) ? true : false, ' class="toggler" data-field="field_story_id" '); ?> Ignore</label>

		<!-- field: position -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">position</label>
		<?php echo form_error('position', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('position', set_value('position', $item['position']), ' id="field_position" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_position']) ? true : false, ' class="toggler" data-field="field_position" '); ?> Ignore</label>

		<!-- field: paragraph -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">paragraph</label>
		<?php echo form_error('paragraph', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('paragraph', set_value('paragraph', $item['paragraph']), ' id="field_paragraph" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_paragraph']) ? true : false, ' class="toggler" data-field="field_paragraph" '); ?> Ignore</label>

		<!-- field: date_created -->
		<label style="font-weight: bold; color: #555; margin-top: 10px;">date_created</label>
		<?php echo form_error('date_created', '<div class="alert alert-error">', '</div>'); ?>
		<?php echo form_input('date_created', set_value('date_created', $item['date_created']), ' id="field_date_created"  data-plugin="datetimepicker" '); ?>
		<label class="checkbox inline" style="margin-left: 10px; margin-top: -15px;"><?php echo form_checkbox('','', isset($_POST['ignore_field_date_created']) ? true : false, ' class="toggler" data-field="field_date_created" '); ?> Ignore</label>

<div style="margin-top: 10px; padding-top: 10px; border-top: 1px; solid #DDD;">
	<button type="submit" class="btn">Save</button>
</div>

<?php echo form_close(); ?>
<?php include($crud_ignition_views_path . 'footer.php'); ?>