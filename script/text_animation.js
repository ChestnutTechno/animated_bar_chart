var title_svg = d3.select("#title_div")
    .append("svg")
    .attr("width", 960)
    .attr("height", 800)
    .append("g")
    .attr("transform", "translate(0, 0)");

var title = title_svg.append("g")
    .attr("id", "title_tx_g")
    .append("text")
    .attr("class", "title")
    .attr("transform", "translate(5, 80)");
title
    .append("tspan")
    .attr("x", 5)
    .attr("y", 5)
    .text("Time-lapse of the serious")
    .append("tspan")
    .attr("x", 5)
    .attr("dy", 80)
    .text("bushfire recorded")
    .append("tspan")
    .attr("x", 5)
    .attr("dy", 80)
    .text("in 2019-20");

var title_anm = title
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .attr("opacity", 1);

var subtitle = title_svg.select("#title_tx_g")
    .append("text")
    .attr("class", "subtitle")
    .attr("transform", "translate(5, 140)")
    .text("");

var subtitle_anm = subtitle.attr("opacity", 0)
    .transition()
    .duration(1000)
    .attr("opacity", 1)
    .attr("transform", "translate(5, 150)");