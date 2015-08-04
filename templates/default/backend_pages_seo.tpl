{include('backend_pages_header.tpl')}
<div id="fc_main_content">
	<div class="fc_modified_header">
		<div class="fc_current_page">
			{translate('Current page')}: <strong>{$PAGE_TITLE}</strong> (<strong>ID: {$PAGE_ID}</strong>)
		</div>
		<div class="clear"></div>
	</div>

    <div class="ui-corner-top" id="fc_seo_form_content">
    {$form}
    </div>

</div>