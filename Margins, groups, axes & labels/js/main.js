const margin = { left: 100, right: 10, top: 10, bottom: 180 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", 600)
    .attr("height", 400);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("data/buildings.json").then(data => {

    data.forEach(d => d.height = +d.height);

    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([height, 0]); 

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => d + "m");

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("x", -5)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)"); 

    g.append("g")
        .call(yAxis);

    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.height))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.height)) 
        .attr("fill", "grey");

  g.append("text")
      .attr("class", "x axis-label")
      .attr("x", width / 2)
      .attr("y", height + 150)  
      .attr("font-size", "30px")
      .attr("text-anchor", "middle")
      .text("The world's tallest buildings");

    svg.append("text")
        .attr("x", -(height / 2) - margin.top)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("transform", "rotate(-90)")
        .text("Height (m)");

});
