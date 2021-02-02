function view_sale_details(type){

}

function checkbox_add(){
	// if($(".checkbox_payment").prop("checked")){
	// 	alert($(".checkbox_payment").val());
	// }
	// else{
	// 	alert("NO");
	// }

	var id;
	var total = 0;
	for(var i = 0; i < $(".checkbox_payment").length; i++){
		id = "#" + i.toString();
		if($(id).prop("checked")){
			var temp = $(id).val().replace(/,/g , '');
			total = total + parseFloat(temp);
		}
	}

	$("#amountPaid").val(total);
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


function sales_review_fields(){
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

	return status;
}

function next_press(){
	var submit;
		submit = document.createElement('button');
		submit.setAttribute("class", "btn btn-primary active text-center float-right d-xl-flex justify-content-xl-end align-items-xl-start");
		submit.setAttribute('form', "salesForm");
		submit.setAttribute('id', "submit");
		submit.setAttribute('type', "submit");
		submit.innerHTML = "Create";


		var back;
		back = document.createElement("button");
		back.setAttribute("class", "btn btn-primary active text-center float-left d-xl-flex justify-content-xl-end align-items-xl-start");
		back.setAttribute("id", "back");
		back.setAttribute("onclick", "s_back()");
		back.setAttribute("style", "background-color:grey;");
		back.innerHTML = "Back";


		if(sales_review_fields()){
			sales_review();
			$("#s_next").remove();
			$(".card-body").append(submit);
			$(".card-body").append(back);
		}
		else{
			alert("Please fill up fields");
		}
}


function s_back(){
	$("#dateScheduled").show();
	$("#dateScheduled_review").hide();

	$("#customerName").show();
	$("#customerName_review").hide();

	$("#saleAddress").show();
	$("#saleAddress_review").hide();

	$("#paymentTerms").show();
	$("#paymentTerms_review").hide();

	$("#product").show();
	$("#product_review").hide();

	$("#qty").show();
	$("#qty_review").hide();

	$("#total").show();
	$("#total_review").hide();

	$("#back").remove();
	$("#submit").remove();

	var submit;
	submit = document.createElement('button');
	submit.setAttribute("class", "btn btn-primary active text-center float-right d-xl-flex justify-content-xl-end align-items-xl-start");
	submit.setAttribute('id', "s_next");
	submit.setAttribute('onclick', "next_press()");
	submit.innerHTML = "Next";
	$(".card-body").append(submit);

}


$(document).ready(function() {
	$(".custom-radio").change(function(){
		if($("#customRadio2").is(":checked")){
			$(".pickup").removeAttr("hidden");
		}
		else{
			$(".pickup").attr("hidden", "");
		}
	});

	$(".s_next").on("click",function(){
		
	});




	$("#unpaidCustomer").on("change",function(){
		$("#amountPaid").val(0);
	});
});