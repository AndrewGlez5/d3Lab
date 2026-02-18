/// LOADING DATA ///
/*
d3.csv("data/ages.csv")
  .then(data => {
    console.log("CSV:", data);
  })
  .catch(error => {
    console.log("Error loading CSV:", error);
  });

d3.tsv("data/ages.tsv")
  .then(data => {
    console.log("TSV:", data);
  })
  .catch(error => {
    console.log("Error loading TSV:", error);
  });

d3.json("data/ages.json")
  .then(data => {

    data.forEach(d => {
      d.age = +d.age;
    });

    console.log("Parsed JSON:", data);

    let svg = d3.select("#chart-area")
      .append("svg")
      .attr("width", 400)
      .attr("height", 400);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => 50 + i * 70)
      .attr("cy", 200)
      .attr("r", d => d.age * 2)
      .attr("fill", d => d.age > 10 ? "red" : "blue");

  })
  .catch(error => {
    console.log("Error loading JSON:", error);
  });
*/



/// BUILDINGS & SCALES ///
const margin = { top: 50, right: 20, bottom: 100, left: 60 };
const width = 700 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// SVG setup
const svg = d3.select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("data/buildings.json").then(data => {

  data.forEach(d => {
    d.height = +d.height;
  });

  // SCALES
  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, width])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.height)])
    .range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeSet3);

  // AXES
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")
    .attr("dx", "-0.6em")
    .attr("dy", "0.1em");

  svg.append("g")
    .call(yAxis);

  // TITLE
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Building Heights");

  // BARS
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.height))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.height))
    .attr("fill", d => color(d.name))
    .style("stroke", "#333")
    .style("stroke-width", "1px");

});

