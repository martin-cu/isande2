function view_sale_details(type){

}

$(document).ready(function() {
	$("#date").change(function(){
		$.get("/get_price", {product : $("#purchase_product").val(), date : $("#date").val()}, function(result){
			//update price in hbs
			$("#product_price").html(result.price);
		});
	});

	$("#qty").keyup(function(){
		//update total
		$.get("/get_price", {product : $("#purchase_product").val(), date : $("#date").val()}, function(result){
			var total = result.price * $("#p_qty").val();
			$("#total_amt").val(total);
		});
	});

	$("#purchase_product").change(function(){
		//update total
		$.get("/get_price", {product : $("#purchase_product").val(), date : $("#date").val()}, function(result){
			$("#product_price").html(result.price);
			var total = result.price * $("#p_qty").val();
			$("#total_amt").val(total);
		});
	});
});