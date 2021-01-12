$(document).ready(function() {
	$(document).on('click', function(e) {
		if (e.target.matches('#togglediv')) {
			$('#myDropdown').toggleClass('show');
		}
		else if (e.target.matches('#toggleicon')) {
			$('#myDropdown').toggleClass('show');
		}
		else {
			if ($('#myDropdown').hasClass('show')) {
				$('#myDropdown').removeClass('show');
			}
		}
		var dialog = $('.popup-dialog-msg');
		if (dialog.length)
			$(dialog).remove();
	});
});