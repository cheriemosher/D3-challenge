var svgWidth = 660;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(healthData) {

  console.log(healthData);

  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(healthData, d => d.poverty + 2)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(healthData, d => d.healthcare + 1)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);
  
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10.25")
    .attr("fill", "#41C7E2")
    .attr("opacity", ".3");

  var circleLabels = chartGroup.selectAll(null)
    .data(healthData)
    .enter()
    .append("text");

  circleLabels
      .attr("x", function(d) {
        return xLinearScale(d.poverty);
      })
      .attr("y", function(d) {
        return yLinearScale(d.healthcare);
      })
      .text(function(d) {
        return d.abbr;
      })
      .attr("font-family", "georgia")
      .attr("font-size", "8.5px")
      .attr("text-anchor", "middle")
      .attr("fill", "black");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 1.55))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2.25}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

}).catch(function(error) {
    console.log(error);
});