function createAreaChart(arr) {
	console.log(arr);
	var chartId, labels = [], data = [], seriesLabel, callback, datasetOpt;

	if (view == 'Sales Employee') {
		chartId = 'overviewSales';
		seriesLabel = 'Earnings';

		for (var i = 0; i < arr.length; i++) {
			labels.push(arr[i].month);
			data.push(arr[i].earnings);
		}

		dataOpt = {
	        labels: labels,
	        datasets: [{
	            label: seriesLabel,
	            data: data,
	            fill: true,
	            borderColor: 'rgba(78, 115, 223, 1)',
	            backgroundColor: 'rgb(231, 234, 247)',
	            borderWidth: 2
	        }]
	    };

	    chartOpt = {
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
					label: function(tooltipItem, data) {
						var dataLabel = data.labels[tooltipItem.index];
						var value = ': Php ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
						if (Chart.helpers.isArray(dataLabel)) {
							dataLabel = dataLabel.slice();
							dataLabel[0] += value;
						}
						else {
							dataLabel += value;
						}
						return dataLabel;
					}
				}
			},
	    }
	}
	else if (view == 'Purchasing Employee') {

	}
	else if (view == 'Logistics Employee') {
		chartId = 'overviewSales';
		seriesLabel = 'Perfect Order Rate';

		for (var i = 0; i < arr.length; i++) {
			labels.push(arr[i].month);
			data.push(arr[i].data);
		}

		dataOpt = {
	        labels: labels,
	        datasets: [{
	            label: seriesLabel,
	            data: data,
	            fill: false,
	            borderColor: 'rgba(78, 115, 223, 1)',
	            borderWidth: 2
	        }]
	    };

		chartOpt = {
	      responsive: true,
	      maintainAspectRatio: false,
	      legend: {
	        display: false
	      },
	      scales: {
	      	yAxes: [{
	      		ticks: {
	      			beginAtZero: false,
	      			min: Math.floor(Math.min.apply(this, data.filter(function(n) { return Number(n); }))/10)*10,
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
					label: function(tooltipItem, data) {
						var dataLabel = data.labels[tooltipItem.index];
						var value = ': Accuracy ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString()+'%';
						if (Chart.helpers.isArray(dataLabel)) {
							dataLabel = dataLabel.slice();
							dataLabel[0] += value;
						}
						else {
							dataLabel += value;
						}
						return dataLabel;
					}
				}
			},
	    }
	}
	var ctx = document.getElementById(chartId);

	var chart = new Chart(ctx, {
	    type: 'line',
	    data: dataOpt,
	    options: chartOpt
	});
	console.log(data);
	return chart;
}

function createBarChart(arr) {
	var chartId, labels = [], data = [], seriesLabel;
	chartId = 'overviewSales';
	var months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun',
	'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	var ctx = document.getElementById(chartId);
	var myChart = new Chart(ctx, {
	  type: 'bar',
	  data: {
	    labels: months,
	    datasets: [
	    {
	      label: 'RCC',
	      backgroundColor: "#8affce",
	      data: arr.rcc_series,
	    }, 
	    {
	      label: 'FCC',
	      backgroundColor: "#8abbff",
	      data: arr.fcc_series,
	    }
	    ]
	  },
	options: {
	    tooltips: {
	      displayColors: true,
	      callbacks:{
	        mode: 'x',
	      },
	    },
	    scales: {
	      xAxes: [{
	        stacked: true,
	        gridLines: {
	          display: false,
	        }
	      }],
	      yAxes: [{
	        stacked: true,
	        ticks: {
	          beginAtZero: true,
	        },
	        type: 'linear',
	      }]
	    },
	    responsive: true,
	    maintainAspectRatio: false,
	    legend: { position: 'bottom' },
	  }
	});
}

function createPieChart(arr) {
	new Chart(document.getElementById("deliveryByDestination"), {
	    type: 'pie',
	    data: {
	      labels: arr.labels,
	      datasets: [{
	        label: "Population (millions)",
	        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", 
	        '#A2F189', '#F9F871', '#A53774', '#E69C24', '#3A4856', '#007668', 
	        '#002B59'],
	        data: arr.data
	      }]
	    },
	    options: {
	    	responsive: true,
	    	maintainAspectRatio: false,
	    	legend: {
	    		position: 'bottom'
	    	}
	    }
	});
}