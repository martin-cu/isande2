function view_sale_details(type){

}


function sales_review(){

	$("#dateScheduled_review").text($("#dateScheduled").val());
	$("#dateScheduled").hide();
	$("#dateScheduled_review").show();

	$("#customerName_review").text($("#customerName").val());
	$("#customerName").hide();
	$("#customerName_review").show();

	$("#saleAddress_review").text($("#saleAddress option:selected").text());
	$("#saleAddress").hide();
	$("#saleAddress_review").show();

	$("#paymentTerms_review").text($("#paymentTerms option:selected").text());
	$("#paymentTerms").hide();
	$("#paymentTerms_review").show();

	$("#product_review").text($("#product option:selected").text());
	$("#product").hide();
	$("#product_review").show();

	$("#qty_review").text($("#qty").val());
	$("#qty").hide();
	$("#qty_review").show();

	$("#total_review").text($("#total").val());
	$("#total").hide();
	$("#total_review").show();
}


function review_fields(){
	var status = true;
	if(!$("#dateScheduled").val()){
		$("#dateScheduled").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#dateScheduled").css("border-color", "");


	if(!$("#customerName").val()){
		$("#customerName").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#customerName").css("border-color", "");

	if(!$("#saleAddress").val()){
		$("#saleAddress").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#saleAddress").css("border-color", "");

	if(!$("#saleAddress").val()){
		$("#saleAddress").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#saleAddress").css("border-color", "");

	if(!$("#total").val()){
		$("#total").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#total").css("border-color", "");

	if(!$("#qty").val()){
		$("#qty").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#qty").css("border-color", "");


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

	$("#next").on("click",function(e){
		//alert("HIii");
		var submit;
		submit = document.createElement('button');
		submit.setAttribute("class", "btn btn-primary active text-center float-right d-xl-flex justify-content-xl-end align-items-xl-start");
		submit.setAttribute('form', "salesForm");
		submit.setAttribute('type', "submit");
		submit.innerHTML = "Create";

		if(review_fields()){
			sales_review();
			$(this).remove();
			$(".card-body").append(submit);
		}
		else{
			//Add error message
		}


		


	});




});