<?php echo '<?php'; ?>

class <?php echo $model; ?>_collection extends kms_item_collection {
	
	public function __construct() {
		parent::__construct();
		$this -> _load_crud_data('<? echo $model; ?>');
	}
	
}

<?php echo '?>'; ?>