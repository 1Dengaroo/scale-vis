"use scrict";

const PATH = "assets/wealth-health-2014.csv";
const MARGIN = { top: 20, right: 30, bottom: 20, left: 30 };
const WIDTH = 650 - MARGIN.left - MARGIN.right,
  HEIGHT = 500 - MARGIN.top - MARGIN.bottom;

async function fetchData() {
  const response = await d3.csv(PATH, d3.autoType);
  return await response;
}

const data = await fetchData();
const xScale = d3
  .scaleLinear()
  .domain(d3.extent(data.map((d) => d.Income)))
  .range([0, WIDTH]);

const yScale = d3
  .scaleLinear()
  .domain(d3.extent(data.map((d) => d.LifeExpectancy)))
  .range([HEIGHT, 0]);

const cScale = d3.scaleOrdinal(d3.schemeTableau10);

const rScale = d3
  .scaleLinear()
  .domain(d3.extent(data.map((d) => d.Population)))
  .range([4, 25]);

const xAxis = d3.axisBottom().scale(xScale).ticks(5, "s");

const yAxis = d3.axisLeft().scale(yScale);

/* ^^^ SCALES & AXES ^^^ */

function addTooltip(event, d) {
  const pos = d3.pointer(event, window);
}

function createChart(data) {
  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", WIDTH + MARGIN.left + MARGIN.right)
    .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
    .append("g")
    .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

  // Draws the circles
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.Income))
    .attr("cy", (d) => yScale(d.LifeExpectancy))
    .attr("r", (d) => rScale(d.Population))
    .style("fill", (d) => cScale(d.Region))
    .style("stroke", "black")
    .style("opacity", ".7")
    .on("mouseenter", (event, d) => {
      const pos = d3.pointer(event, window);
      d3.select(".tooltip")
        .style("display", "block")
        .style("left", pos[0])
        .style("top", pos[1])
        .html(
          `Country: ${d.Country}</br>Region: ${
            d.Region
          }</br>Population: ${d3.format(",")(
            d.Population
          )}</br>Income: $${d3.format(",")(d.Income)}</br>Life Expectancy: ${
            d.LifeExpectancy
          }`
        );
    })
    .on("mouseleave", (event, d) => {
      d3.select(".tooltip").style("display", "none");
    });

  // Draws the axes
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${HEIGHT})`);

  svg.append("g").attr("class", "axis y-axis").call(yAxis);

  // Adding labels to axes
  svg
    .append("text")
    .attr("x", WIDTH - 50)
    .attr("y", HEIGHT - 5)
    .attr("class", "axis-label")
    .text("Income");

  svg
    .append("text")
    .attr("x", 10)
    .attr("y", 0)
    .attr("class", "axis-label")
    .text("Life Expectancy")
    .style("writing-mode", "vertical-lr");

  // Creating Legend
  svg
    .selectAll("rect")
    .data(cScale.domain())
    .enter()
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("x", WIDTH - 150)
    .attr("y", (d, i) => HEIGHT - 50 - i * 18)
    .style("fill", (d) => cScale(d));

  svg
    .selectAll("text2")
    .data(cScale.domain())
    .enter()
    .append("text")
    .attr("x", WIDTH - 130)
    .attr("y", (d, i) => HEIGHT - 37 - i * 18)
    .text((d) => d);
}

createChart(data);
console.log(data);
