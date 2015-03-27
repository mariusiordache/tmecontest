$(document).ready(function() {
	
	var UploadBox = Backbone.View.extend({
		el: 'body',
		showUploadScreenshots: function(theme_id) {
			this.theme_id = theme_id;
			$('#screenshotUploadModal').modal('show');
		},
		screenshotUploadComplete: function(files) {
			this.trigger('screenshotUploadComplete', {
				theme_id: this.theme_id,
				files: files
			});
		}
	});
	
	uploadbox = new UploadBox();
	
	$('#screenshotupload').fileupload({
		//xhrFields: {withCredentials: true},
		url: PAGE_DATA.base_url + '/app/upload_screenshots',
		autoUpload: true,
		disableImageResize: true,
		maxFileSize: 5000000,
		acceptFileTypes: /(\.|\/)(jpe?g|png|zip)$/i,
		done: function(e, data) {
			var that = $(this).data('blueimp-fileupload') || $(this).data('fileupload');					
			
			if (data.result && $.isArray(data.result.files)) {
				files = data.result.files;
			} else {
				files = [];
			}
			
			var final_files = [];
			for(var index=0; index<files.length; index++) {
				var file = files[index] || {error: 'Empty file upload result'};
				final_files.push(file);
			}
			uploadbox.screenshotUploadComplete(final_files);
			data.context.each(function (index) {								   
				var node = $(this);
				$(this).removeClass('in');
				
				if ($.support.transition && node.is(':visible')) {
					node.bind(
						$.support.transition.end,
						function (e) {
							// Make sure we don't respond to other transitions events
							// in the container element, e.g. from button elements:
							if (e.target === node[0]) {
								node.unbind($.support.transition.end).remove();
							}
						}
					).addClass('out');
				}						
			});
		}
	});
        
        
        $('#apkupload').fileupload({
		//xhrFields: {withCredentials: true},
		url: PAGE_DATA.base_url + '/dashboard/upload_apk',
		autoUpload: true,
		disableImageResize: true,
		maxFileSize: 5000000,
		acceptFileTypes: /apk$/i,
		done: function(e, data) {
			var that = $(this).data('blueimp-fileupload') || $(this).data('fileupload');					
			
			if (data.result && $.isArray(data.result.files)) {
                            files = data.result.files;
			} else {
                            files = [];
			}
                        
                        $('#apkUploadModal').modal('hide');
                        window.location.reload();
		}
	});

	// Enable iframe cross-domain access via redirect option:
	$('#screenshotupload').fileupload(
		'option',
		'redirect',
		window.location.href.replace(
			/\/[^\/]*$/,
			'jqueryfileupload/cors/result.html?%s'
		)
	);
	
	$('#screenshotupload').bind('fileuploadsubmit', function (e, data) {				
		data.formData = {theme_id: uploadbox.theme_id};
	});

});