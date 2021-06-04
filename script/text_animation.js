var title_svg = d3.select("#title_div")
    .append("svg")
    .attr("width", 1300)
    .attr("height", 200);

var title = title_svg.append("g")
    .attr("id", "title_tx_g")
    .append("text")
    .attr("class", "title")
    .attr("transform", "translate(5, 80)");

title
    .append("tspan")
    .attr("x", 5)
    .attr("y", 5)
    .text("Timelapse of the serious bushfire")
    .append("tspan")
    .attr("x", 5)
    .attr("dy", 80)
    .text("recorded in 2019-20");

var title_anm = title
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .attr("opacity", 1);
