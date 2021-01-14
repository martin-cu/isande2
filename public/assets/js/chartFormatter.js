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
	      			beginAtZero: true,
	      			callback: function(value, index, values) {
                                  if(parseInt(value) >= 1000){
                                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                  } else {
                                    return value;
                                  }
                                }
	      		}
	      	}]
	      },
	      tooltips: {
			callbacks: {
				// this callback is used to create the tooltip label
				label: function(tooltipItem, data) {
						// get the data label and data value to display
						// convert the data value to local string so it uses a comma seperated number
						var dataLabel = data.labels[tooltipItem.index];
						// add the currency symbol $ to the label
						var value = ': Php ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
						// make sure this isn't a multi-line label (e.g. [["label 1 - line 1, "line 2, ], [etc...]])
						if (Chart.helpers.isArray(dataLabel)) {
						// show value on first line of multiline label
						// need to clone because we are changing the value
						dataLabel = dataLabel.slice();
						dataLabel[0] += value;
						} else {
						dataLabel += value;
						}
						// return the text to display on the tooltip
						return dataLabel;
					}
				}
			},
	    }
	});
	return chart;
}