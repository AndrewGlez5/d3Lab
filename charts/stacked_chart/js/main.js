/*
*    main.js
*/

var margin ={top: 20, right: 300, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    

var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Time parser
var parseDate = d3.timeParse('%Y');
var formatSi = d3.format(".3s");
var formatNumber = d3.format(".1f"),
formatBillion = (x) => { return formatNumber(x / 1e9); };

// Scales
var x = d3.scaleTime().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);
var color = d3.scaleOrdinal(d3.schemeSpectral[11]);

// Axes
var xAxisCall = d3.axisBottom();
var yAxisCall = d3.axisLeft().tickFormat(formatBillion);

// 🔥 AREA GENERATOR
var area = d3.area()
    .x(function(d){ return x(d.data.date); })
    .y0(function(d){ return y(d[0]); })
    .y1(function(d){ return y(d[1]); });

// 🔥 STACK GENERATOR
var stack = d3.stack();

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
    .text("Billions of liters");

// Legend group
var legend = g.append("g")
    .attr("transform", "translate(" + (width + 150) + "," + (height - 210) + ")");

d3.csv('data/stacked_area2.csv').then((data) => {

    // 🔥 KEYS
    var keys = data.columns.slice(1);

    color.domain(keys);
        
	data.forEach((d) => {
	    d.date = parseDate(d.date);

        keys.forEach(key => {
            d[key] = +d[key];
        });
	}); 

    var maxDateVal = d3.max(data, (d) => {
        return d3.sum(keys, key => d[key]);
    });

    x.domain(d3.extent(data, (d) => { return d.date; }));
    y.domain([0, maxDateVal]);

    // Axes
    xAxis.call(xAxisCall.scale(x))
    yAxis.call(yAxisCall.scale(y))

    // 🔥 CONFIG STACK
    stack
        .keys(keys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var stackedData = stack(data);

    // 🔥 DRAW AREAS
    g.selectAll(".area")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "area")
        .attr("fill", function(d){ return color(d.key); })
        .attr("d", area);

    // 🔥 LEGEND
    var legendRow = legend.selectAll(".legend-row")
        .data(keys)
        .enter()
        .append("g")
        .attr("class", "legend-row")
        .attr("transform", function(d, i){
            return "translate(0," + i * 20 + ")";
        });

    legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", function(d){ return color(d); });

    legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(function(d){ return d; });

}).catch((error) => {
    console.log(error);
});