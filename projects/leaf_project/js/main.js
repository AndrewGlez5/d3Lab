const margin = { top: 50, right: 150, bottom: 100, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleLog()
  .domain([142, 150000])
  .range([0, width]);

const y = d3.scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

const area = d3.scaleLinear()
  .domain([2000, 1400000000])
  .range([25 * Math.PI, 1500 * Math.PI]);

const color = d3.scaleOrdinal(d3.schemePastel1);

const xAxis = d3.axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d => "$" + d);

const yAxis = d3.axisLeft(y);

const xAxisGroup = g.append("g")
  .attr("transform", `translate(0, ${height})`);

const yAxisGroup = g.append("g");

const yearLabel = g.append("text")
  .attr("x", width - 80)
  .attr("y", height - 10)
  .attr("font-size", "40px")
  .attr("fill", "white")
  .attr("opacity", 0.4);

g.append("text")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "18px")
  .text("GDP Per Capita ($)");

g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -60)
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "18px")
  .text("Life Expectancy (Years)");

d3.json("data/data.json").then(data => {

  const formattedData = data.map(year => {
    return year.countries.filter(country => {
      return country.income && country.life_exp;
    }).map(country => {
      return {
        continent: country.continent,
        country: country.country,
        income: +country.income,
        life_exp: +country.life_exp,
        population: +country.population
      };
    });
  });

  const allContinents = [...new Set(
    formattedData.flat().map(d => d.continent)
  )];

  color.domain(allContinents);

  const legend = g.append("g")
    .attr("transform", `translate(${width + 20}, 20)`);

  allContinents.forEach((c, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 25})`);

    row.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(c));

    row.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("fill", "white")
      .text(c);
  });

  let i = 0;

  d3.interval(() => {
    update(formattedData[i], data[i].year);
    i++;
    if (i >= formattedData.length) i = 0;
  }, 1000);

  update(formattedData[0], data[0].year);

});

function update(data, year) {

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup.selectAll("text").attr("fill", "white");
  yAxisGroup.selectAll("text").attr("fill", "white");

  xAxisGroup.selectAll("path, line").attr("stroke", "white");
  yAxisGroup.selectAll("path, line").attr("stroke", "white");

  const circles = g.selectAll("circle")
    .data(data, d => d.country);

  circles.exit().remove();

  circles
    .transition()
    .duration(1000)
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp))
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
    .attr("fill", d => color(d.continent));

  circles.enter()
    .append("circle")
    .attr("cx", d => x(d.income))
    .attr("cy", d => y(d.life_exp))
    .attr("r", 0)
    .attr("fill", d => color(d.continent))
    .transition()
    .duration(1000)
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI));

  yearLabel.text(year);
}