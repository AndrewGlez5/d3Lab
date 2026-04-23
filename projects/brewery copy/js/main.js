const margin = { top: 50, right: 20, bottom: 80, left: 100 };
const width = 700 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

let flag = true;

const svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleBand()
  .range([0, width])
  .padding(0.2);

const y = d3.scaleLinear()
  .range([height, 0]);

const xAxisGroup = g.append("g")
  .attr("transform", `translate(0, ${height})`);

const yAxisGroup = g.append("g");

const yLabel = g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", -height / 2)
  .attr("text-anchor", "middle")
  .attr("font-size", "20px")
  .text("Revenue");

d3.json("data/revenues.json").then(data => {

  data.forEach(d => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  d3.interval(() => {

    const newData = flag ? data : data.slice(1);

    update(newData);

    flag = !flag;

  }, 3500);

  update(data);

});

function update(data) {

  const value = flag ? "revenue" : "profit";

  x.domain(data.map(d => d.month));
  y.domain([0, d3.max(data, d => d[value])]);

  const xAxisCall = d3.axisBottom(x);
  const yAxisCall = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(d => "$" + d / 1000 + "K");

  xAxisGroup
    .transition()
    .duration(1000)
    .call(xAxisCall);

  yAxisGroup
    .transition()
    .duration(1000)
    .call(yAxisCall);

  const rects = g.selectAll("rect")
    .data(data, d => d.month);

  rects.exit()
    .transition()
    .duration(1000)
    .attr("y", height)
    .attr("height", 0)
    .remove();

  rects
    .transition()
    .duration(1000)
    .attr("x", d => x(d.month))
    .attr("y", d => y(d[value]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d[value]));

  rects.enter()
    .append("rect")
    .attr("x", d => x(d.month))
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("fill", "#d4d400")
    .transition()
    .duration(1000)
    .attr("y", d => y(d[value]))
    .attr("height", d => height - y(d[value]));

  const label = flag ? "Revenue" : "Profit";
  yLabel.text(label);
}