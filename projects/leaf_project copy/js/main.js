const margin = { top: 50, right: 150, bottom: 100, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

let interval;
let filteredContinent = "all";
let yearIndex = 0;
let data;
let rawData;

const svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleLog().domain([142,150000]).range([0,width]);
const y = d3.scaleLinear().domain([0,90]).range([height,0]);
const area = d3.scaleLinear().domain([2000,1400000000]).range([25*Math.PI,1500*Math.PI]);
const color = d3.scaleOrdinal(d3.schemePastel1);

const xAxisGroup = g.append("g").attr("transform", `translate(0,${height})`);
const yAxisGroup = g.append("g");

const xAxis = d3.axisBottom(x).tickValues([400,4000,40000]).tickFormat(d=>"$"+d);
const yAxis = d3.axisLeft(y);

const yearLabel = g.append("text")
  .attr("x", width-80)
  .attr("y", height-10)
  .attr("font-size","40px")
  .attr("fill","white")
  .attr("opacity",0.4);

const tip = d3.tip()
  .attr("class","d3-tip")
  .html(d => `
    <strong>${d.country}</strong><br>
    Income: $${d.income}<br>
    Life Exp: ${d.life_exp}<br>
    Population: ${d.population}
  `);

svg.call(tip);

d3.json("data/data.json").then(dataLoaded => {

  rawData = dataLoaded;

  data = rawData.map(year => {
    return year.countries.filter(c => c.income && c.life_exp).map(c => ({
      continent: c.continent,
      country: c.country,
      income: +c.income,
      life_exp: +c.life_exp,
      population: +c.population
    }));
  });

  const continents = [...new Set(data.flat().map(d => d.continent))];
  color.domain(continents);

  continents.forEach(c => {
    $("#continent-select").append(`<option value="${c}">${c}</option>`);
  });

  $("#slider").slider({
    min: 0,
    max: data.length-1,
    step: 1,
    slide: (event, ui) => {
      yearIndex = ui.value;
      update(data[yearIndex], rawData[yearIndex].year);
    }
  });

  $("#play-button").click(function(){
    if ($(this).text() === "Play") {
      $(this).text("Pause");
      interval = setInterval(step, 1000);
    } else {
      $(this).text("Play");
      clearInterval(interval);
    }
  });

  $("#reset-button").click(function(){
    yearIndex = 0;
    update(data[0], rawData[0].year);
    $("#slider").slider("value", 0);
  });

  $("#continent-select").change(function(){
    filteredContinent = $(this).val();
    update(data[yearIndex], rawData[yearIndex].year);
  });

  update(data[0], rawData[0].year);
});

function step(){
  yearIndex++;
  if(yearIndex >= data.length) yearIndex = 0;

  update(data[yearIndex], rawData[yearIndex].year);

  $("#slider").slider("value", yearIndex);
}

function update(dataYear, year){

  $("#year").text(year);

  let filteredData = filteredContinent === "all"
    ? dataYear
    : dataYear.filter(d => d.continent === filteredContinent);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  const circles = g.selectAll("circle")
    .data(filteredData, d=>d.country);

  circles.exit().remove();

  circles
    .transition().duration(1000)
    .attr("cx", d=>x(d.income))
    .attr("cy", d=>y(d.life_exp))
    .attr("r", d=>Math.sqrt(area(d.population)/Math.PI))
    .attr("fill", d=>color(d.continent));

  circles.enter()
    .append("circle")
    .attr("cx", d=>x(d.income))
    .attr("cy", d=>y(d.life_exp))
    .attr("r", 0)
    .attr("fill", d=>color(d.continent))
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .transition().duration(1000)
    .attr("r", d=>Math.sqrt(area(d.population)/Math.PI));

  yearLabel.text(year);
}