function view_sale_details(type){

}

$(document).ready(function() {
	$(".custom-radio").change(function(){
		alert("Changed");
		if($("#customRadio2").is(":checked")){
			$(".pickup").removeAttr("hidden");
		}
		else{
			$(".pickup").hide();
		}
	});
});