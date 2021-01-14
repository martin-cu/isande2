function createAreaChart(arr) {
	var chartId, labels = [], data = [], seriesLabel;

	if (view == 'Sales Employee') {
		chartId = 'overviewSales';
		seriesLabel = 'Earnings';

		for (var i = 0; i < arr.length; i++) {
			labels.push(arr[i].month);
			data.push(arr[i].earnings);
		}
	}
	else if (view == 'Purchasing Employee') {

	}
	else if (view == 'Logistics Employee') {

	}
	var ctx = document.getElementById(chartId);
	console.log(data);
	var chart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: labels,
	        datasets: [{
	            label: seriesLabel,
	            data: data,
	            fill: true,
	            borderColor: 'rgba(78, 115, 223, 1)',
	            backgroundColor: 'rgb(231, 234, 247)',
	            borderWidth: 2
	        }]
	    },
	    options: {
	      responsive: true,
	      maintainAspectRatio: false,
	      legend: {
	        display: false
	      },
	      scales: {
	      	yAxes: [{
	      		ticks: {
	      			beginAtZero: true
	      		}
	      	}]
	      }
	    }
	});
	return chart;
}