/*
*    main.js
*/

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Time parser
var parseTime = d3.timeParse("%d-%b-%y");

// Scales
var x = d3.scaleTime().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom();
var yAxisCall = d3.axisLeft();

// 🔥 AREA GENERATOR
var area = d3.area()
    .x(function(d){ return x(d.date); })
    .y0(height)                  // base (abajo)
    .y1(function(d){ return y(d.close); });

// Axis groups
var xAxis = g.append("g")
	.attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

var yAxis =  g.append("g")
	.attr("class", "y axis");
        
// Y label
yAxis.append("text")
	.attr("class", "axis-title")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");

d3.tsv("data/area.tsv").then((data) => {

	data.forEach((d) => {
	    d.date = parseTime(d.date);
	    d.close = +d.close;
	}); 

    // Domains
    x.domain(d3.extent(data, function(d){ return d.date; }));
    y.domain([0, d3.max(data, function(d){ return d.close; })]);

    // Axes
    xAxis.call(xAxisCall.scale(x));
    yAxis.call(yAxisCall.scale(y));

    // 🔥 AREA PATH
    g.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("d", area);

}).catch((error) => {
    console.log(error);
});