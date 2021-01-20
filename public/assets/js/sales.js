function view_sale_details(type){

}

$(document).ready(function() {
	$(".custom-radio").change(function(){
		if($("#customRadio2").is(":checked")){
			$(".pickup").removeAttr("hidden");
		}
		else{
			$(".pickup").hide();
		}
	});
});