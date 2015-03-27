<div id="list-settings">
	<div id="list-settings-top">
		{"homepage.before_adults"|kms_lang}
		<a class="list-settings-link" id="adults_link" data-single-label="{"adults_option_single"|kms_lang}" data-label="{"adults_option"|kms_lang:"###"}">
			<span class="tabLabel">
				{if $js_page_data.user_settings.kids_count==1}
					{"adults_option_single"}
				{else}
					{"adults_option"|kms_lang:$js_page_data.user_settings.adults}						
				{/if}
			</span>
			<span data-icon="&#xe009;"></span>
		</a>				
		{"homepage.between_adults_and_kids"|kms_lang}				
		<a class="list-settings-link" id="kids_link" data-single-label="{"kids_option_single"|kms_lang}" data-label="{"kids_option"|kms_lang:"###"}">
			<span class="tabLabel">
			{if $js_page_data.user_settings.kids_count==1}
				{"kids_option_single"|kms_lang}
			{else}						
				{"kids_option"|kms_lang:$js_page_data.user_settings.kids_count}
			{/if}
			</span>
			<span data-icon="&#xe009;"></span>
		</a>
		{"homepage.between_kids_and_departure"|kms_lang}
		<a class="list-settings-link" id="departure_link">
			<span class="tabLabel">{$js_page_data.user_settings.departure.label}</span>
			<span data-icon="&#xe009;"></span>
		</a> 				 
		{"homepage.after_departure"|kms_lang}
	</div>
	<div id="list-settings-bottom" role="navigation">
		<label class="list-settings-lable uppercase">room arrangements:</label>
		<a href="#roomSetupModal" id="roomSetup">launch</a>
		<label class="list-settings-label uppercase">currency:</label>				
		{include file="web/includes/dropdown.tpl" class="selectbox-white selectbox-small" id="currencySelect" selected=$js_page_data.user_settings.currency options=$currencies}								
	</div>
</div>