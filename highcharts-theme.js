/**
 * Grid-light theme for Highcharts JS
 * @author Torstein Honsi
 */

// Load the fonts
Highcharts.createElement('link', {
	href: '//fonts.googleapis.com/css?family=Dosis:400,600',
	rel: 'stylesheet',
	type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
	colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
		"#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
	chart: {
		backgroundColor: null,
		color: "#FFFFFF",
		font: "Helvetica,Arial,sans-serif"
	},
	title: {
		style: {
			fontSize: '16px',
			fontWeight: 'bold'
		}
	},
	tooltip: {
		borderWidth: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.92)',
		shadow: false,
		headerFormat: "",
		style: {
			color: "#FFFFFF"
		}
	},
	legend: {
		itemStyle: {
			fontWeight: 'bold',
			fontSize: '13px',
			color: "#FFFFFF",
			font: "Helvetica,Arial,sans-serif "
		}
	},
	xAxis: {
		gridLineWidth: 1,
		labels: {
			style: {
				fontSize: '12px',
				color: "#FFFFFF"
			}
		}
	},
	yAxis: {
		minorTickInterval: 'auto',
		title: {
			style: {
				textTransform: 'uppercase',
				color: "#FFFFFF"
			}
		},
		labels: {
			style: {
				fontSize: '12px',
				color: "#FFFFFF"
			}
		}
	},
	plotOptions: {
		candlestick: {
			lineColor: '#404048'
		}
	}

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
