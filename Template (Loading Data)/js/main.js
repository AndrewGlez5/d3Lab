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
