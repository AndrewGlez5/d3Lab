const margin = { top: 50, right: 20, bottom: 80, left: 100 };
const width = 700 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("data/revenues.json").then(data => {

  data.forEach(d => {
    d.revenue = +d.revenue;
  });

  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, width])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([height, 0]);

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(d => "$" + d / 1000 + "K");

  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  g.append("g")
    .call(yAxis);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.month))
    .attr("y", d => y(d.revenue))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.revenue))
    .attr("fill", "#d4d400");

  g.append("text")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .text("Month");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .text("Revenue (dlls.)");

});