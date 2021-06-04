var margin = { top: 20, right: 50, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select("#line_chart_div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// create x axis
var x = d3.time.scale()
    .range([0, width]);
var xAxis = d3.svg.axis()
    .scale(x)
    .innerTickSize(6)
    .outerTickSize(0)
    .tickFormat(d3.time.format("%B"))
    .orient("bottom");

// create y axis
var y = d3.scale.linear()
    .range([height, 0]);
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .innerTickSize(6)
    .outerTickSize(0)
    .orient("left");

// create lines
var line = d3.svg.line().interpolate("monotone")
    .x(function (d) { return x(d.date) })
    .y(function (d) { return y(d.number) });

var color = d3.scale.ordinal();



var dateParse = d3.time.format("%Y-%m-%d").parse;
d3.csv("https://raw.githubusercontent.com/ChestnutTechno/aus_fire_vis/main/data/state_obv.csv", function (error, data) {
    if (error) { throw error };
    color.domain([
        "New South Wales",
        "Northern Territory",
        "Queensland",
        "South Australia",
        "Tasmania",
        "Victoria",
        "Western Australia"
    ]);
    color.range(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494']);

    data.forEach(function (d) {
        d.acq_date = dateParse(d.acq_date);
    });

    var states = color.domain().map(function (name) {
        return {
            name: name,
            values: data.map(function (d) {
                return { date: d.acq_date, number: +d[name] };
            })
        };
    });

    x.domain(d3.extent(data, function (d) { return d.acq_date }));

    y.domain([
        0,
        d3.max(states, function (c) { return d3.max(c.values, function (v) { return v.number; }); })
    ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".state")
        .data(states)
        .enter()
        .append("g")
        .attr("class", "state");

    var path = svg.selectAll(".state")
        .append("path")
        .attr("id", function (d) { return d.name.substring(0, 3); })
        .attr("class", "line")
        .attr("d", function (d) { return line(d.values); })
        .style("stroke", function (d) {
            return color(d.name);
        });

    svg.selectAll(".line")
        .on("mouseover", onMouseOver)
        .on("mousemove", onMouseMove)
        .on("mouseout", onMouseOut);

    var curtain = svg.append("g").append("rect")
        .attr("x", -1 * width - 2)
        .attr("y", -1 * height - 1)
        .attr("height", height + 3)
        .attr("width", width + 2)
        .attr("class", "curtain")
        .attr("transform", "rotate(180)")
        .style("fill", "rgb(32,33,36)");

    curtain
        .transition()
        .duration(30000)
        .delay(5000)
        .ease("linear")
        .attr("x", -2 * width)
    d3.select("#rly_btn")
        .on("click", repeatAnimation);


    function repeatAnimation() {
        curtain
            .transition()
            .duration(500)
            .ease("linear")
            .attr("x", -1 * width)
            .transition()
            .duration(30000)
            .delay(1000)
            .ease("linear")
            .attr("x", -2 * width);
    }


    // add legend
    svg.append("g")
        .attr("id", "lc_legend")
        .append("rect")
        .attr("x", 20)
        .attr("y", 0)
        .attr("id", "legend_bg")
        .attr("width", 80)
        .attr("height", 140)
        .style("fill", "rgb(63,63,63");

    var legend = d3.select("#lc_legend");

    var mousedown = function () {
        var id = this.getAttribute("id");
        svg.selectAll(".line").style("opacity", 0.1);
        svg.select("#" + id).style("opacity", 1);
    }

    var mouseup = function () {
        d3.selectAll(".line").style("opacity", 1);
    }

    // NSW legend
    legend.append("circle")
        .attr("id", "New")
        .attr("cx", 35)
        .attr("cy", 11)
        .attr("r", 6)
        .style("fill", "#66c2a5")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);

    legend.append("text")
        .attr("class", "lc_legend_tx")
        .attr("x", 50)
        .attr("y", 15)
        .text("NSW")
        .style("fill", "rgb(211,211,211)");

    // NT legend
    legend.append("circle")
        .attr("id", "Nor")
        .attr("cx", 35)
        .attr("cy", 31)
        .attr("r", 6)
        .style("fill", "#fc8d62")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);

    legend.append("text")
        .attr("x", 50)
        .attr("y", 35)
        .text("NT")
        .style("fill", "rgb(211,211,211)");

    // QLD legend
    legend.append("circle")
        .attr("id", "Que")
        .attr("cx", 35)
        .attr("cy", 51)
        .attr("r", 6)
        .style("fill", "#8da0cb")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);

    legend.append("text")
        .attr("x", 50)
        .attr("y", 55)
        .text("QLD")
        .style("fill", "rgb(211,211,211)");

    // SA legend
    legend.append("circle")
        .attr("id", "Sou")
        .attr("cx", 35)
        .attr("cy", 71)
        .attr("r", 6)
        .style("fill", "#e78ac3")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);

    legend.append("text")
        .attr("x", 50)
        .attr("y", 75)
        .text("SA")
        .style("fill", "rgb(211,211,211)");

    // TAS legend
    legend.append("circle")
        .attr("id", "Tas")
        .attr("cx", 35)
        .attr("cy", 91)
        .attr("r", 6)
        .style("fill", "#a6d854")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);

    legend.append("text")
        .attr("x", 50)
        .attr("y", 95)
        .text("TAS")
        .style("fill", "rgb(211,211,211)");

    // VIC legend
    legend.append("circle")
        .attr("id", "Vic")
        .attr("cx", 35)
        .attr("cy", 111)
        .attr("r", 6)
        .style("fill", "#ffd92f")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);

    legend.append("text")
        .attr("x", 50)
        .attr("y", 115)
        .text("VIC")
        .style("fill", "rgb(211,211,211)");

    // WA legend
    legend.append("circle")
        .attr("id", "Wes")
        .attr("cx", 35)
        .attr("cy", 131)
        .attr("r", 6)
        .style("fill", "#e5c494")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);

    legend.append("text")
        .attr("x", 50)
        .attr("y", 135)
        .text("WA")
        .style("fill", "rgb(211,211,211)");
});

var onMouseOver = function () {
    d3.selectAll(".line").style("opacity", 0.1);
}

var onMouseMove = function (d) {
    d3.select("#" + d.name.substring(0, 3)).style("opacity", 1);
}

var onMouseOut = function () {
    d3.selectAll(".line").style("opacity", 1);
}

// var onClick = function (d) {
//     d3.selectAll(".line").style("opacity", 0.2);
//     console.log("opacity set to 0.2");
//     d3.select("#" + d).style("opacity", 1);
//     console.log("highlight line");
// }