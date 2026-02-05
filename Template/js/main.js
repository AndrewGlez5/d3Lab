var svg = d3.select("#chart-area").append("svg")
    .attr("width", 600)
    .attr("height", 600);

// Circle
var circle = svg.append("circle")
    .attr("cx", 100)
    .attr("cy", 250)
    .attr("r", 100)
    .attr("fill", "blue");

// Rectangle
var rect = svg.append("rect")
    .attr("x", 20)
    .attr("y", 20)
    .attr("width", 50)
    .attr("height", 70)
    .attr("fill", "orange");
