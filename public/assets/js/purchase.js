
function purchase_review(){

	$("#date_review").text($("#date").val());
	$("#date").hide();
	$("#date_review").show();

	$("#purchase_lo_review").text($("#purchase_lo").val());
	$("#purchase_lo").hide();
	$("#purchase_lo_review").show();

	$("#purchase_so_review").text($("#purchase_so").val());
	$("#purchase_so").hide();
	$("#purchase_so_review").show();

	$("#purchase_product_review").text($("#purchase_product option:selected").text());
	$("#purchase_product").hide();
	$("#purchase_product_review").show();

	$("#p_qty_review").text($("#p_qty").val());
	$("#p_qty").hide();
	$("#p_qty_review").show();

	$("#total_amt_review").text($("#total_amt").val());
	$("#total_amt").hide();
	$("#total_amt_review").show();
}


function review_fields(){
	var status = true;
	if(!$("#date").val()){
		$("#date").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#date").css("border-color", "");


	if(!$("#purchase_lo").val()){
		$("#purchase_lo").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#purchase_lo").css("border-color", "");

	if(!$("#purchase_so").val()){
		$("#purchase_so").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#purchase_so").css("border-color", "");

	if(!$("#total_amt").val()){
		$("#total_amt").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#total_amt").css("border-color", "");

	if(!$("#p_qty").val()){
		$("#p_qty").css("border-color", "rgb(235, 64, 54)");
		status = false;
	}
	else
		$("#p_qty").css("border-color", "");

	return status;
}

function next(){
	var submit;
		submit = document.createElement("button");
		submit.setAttribute("class", "btn btn-primary active text-center float-right d-xl-flex justify-content-xl-end align-items-xl-start");
		submit.setAttribute("id", "submit");
		submit.setAttribute("type", "submit");
		submit.setAttribute("form", "purchaseForm");
		submit.innerHTML = "Create";

		var back;
		back = document.createElement("button");
		back.setAttribute("class", "btn btn-primary active text-center float-left d-xl-flex justify-content-xl-end align-items-xl-start");
		back.setAttribute("id", "back");
		back.setAttribute("onclick", "back()");
		back.setAttribute("style", "background-color:grey;");
		back.innerHTML = "Back";
		
		if(review_fields()){
			purchase_review();
			$("#p_next").remove();
			$(".card-body").append(submit);
			$(".card-body").append(back);
		}
		else{
			alert("Please fill up fields");
		}
}



function back(){
	$("#date").show();
	$("#date_review").hide();

	$("#purchase_lo").show();
	$("#purchase_lo_review").hide();

	$("#purchase_so").show();
	$("#purchase_so_review").hide();

	$("#purchase_product").show();
	$("#purchase_product_review").hide();

	$("#p_qty").show();
	$("#p_qty_review").hide();

	$("#total_amt").show();
	$("#total_amt_review").hide();

	$("#back").remove();
	$("#submit").remove();

	var back;
		back = document.createElement("button");
		back.setAttribute("class", "btn btn-primary active text-center float-right d-xl-flex justify-content-xl-end align-items-xl-start");
		back.setAttribute("id", "p_next");
		back.setAttribute("onclick", "next()");
		back.innerHTML = "Next";
	$(".card-body").append(back);

}

$(document).ready(function() {
	$("#date").change(function(){
		$.get("/get_price", {product : $("#purchase_product").val(), date : $("#date").val()}, function(result){
			//update price in hbs
			$("#product_price").html(result.price);
		});
	});

	$("#p_qty").keyup(function(){
		//update total
		if($("#date").val())
			$.get("/get_price", {product : $("#purchase_product").val(), date : $("#date").val()}, function(result){
				var total = result.price * $("#p_qty").val();
				$("#total_amt").val(total);
			});
	});

	$("#purchase_product").change(function(){
		//update total
		if($("#date").val())
			$.get("/get_price", {product : $("#purchase_product").val(), date : $("#date").val()}, function(result){
				$("#product_price").html(result.price);
				var total = result.price * $("#p_qty").val();
				$("#total_amt").val(total);
			});
	});




	$("#p_next").on("click", function(){
		

		var submit;
		submit = document.createElement("button");
		submit.setAttribute("class", "btn btn-primary active text-center float-right d-xl-flex justify-content-xl-end align-items-xl-start");
		submit.setAttribute("id", "submit");
		submit.setAttribute("type", "submit");
		submit.setAttribute("form", "purchaseForm");
		submit.innerHTML = "Create";

		var back;
		back = document.createElement("button");
		back.setAttribute("class", "btn btn-primary active text-center float-left d-xl-flex justify-content-xl-end align-items-xl-start");
		back.setAttribute("id", "back");
		back.setAttribute("onclick", "back()");
		back.setAttribute("style", "background-color:grey;");
		back.innerHTML = "Back";
		
		if(review_fields()){
			purchase_review();
			$("#p_next").remove();
			$(".card-body").append(submit);
			$(".card-body").append(back);
		}
		else{
			alert("Please fill up fields");
		}
		



	});


	
});