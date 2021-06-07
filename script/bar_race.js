/*
 this part of code is adapted from: https://bl.ocks.org/jrzief/70f1f8a5d066a286da3a1e699823470f
 */

var b_margin = { top: 20, right: 50, bottom: 30, left: 50 },
    b_width = 800 - margin.left - margin.right,
    b_height = 300 - margin.top - margin.bottom;
var bar_svg = d3.select("#bar_chart")
    .append("svg")
    .attr("width", b_width + b_margin.left + b_margin.right)
    .attr("height", b_height + b_margin.top + b_margin.bottom)
    .append("g")
    .attr("transform", "translate(10," + b_margin.top + ")");

var color = d3.scale.ordinal();

// set all animation's duration in racing
var duration = 190;

// The following data is accessed remotely. The URL is the Github repository of this project
// The data processing and normalisation code is in data processing directory
d3.csv("https://raw.githubusercontent.com/ChestnutTechno/aus_fire_vis/main/data/bar.csv", function (data) {

    // set data formatter and parser
    var formatDate = d3.time.format("%Y-%m-%d");
    var parseDate = formatDate.parse;

    // set color domain and range
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
        d.cumu_sum = +d.cumu_sum;
        d.next_val = +d.next_val;
        d.rank = +d.rank;
    });

    // set the initial time
    var time = "2019-08-01"

    // filter the all data to a small cluster of one-day data
    var dateSlice = data.filter(function (d) { return d.acq_date == time })
        .slice(0, 3);

    // set x axis range and domain
    var barX = d3.scale.linear()
        .domain([0, d3.max(dateSlice, function (d) { return d.cumu_sum })])
        .range([0, b_width]);

    /*
    set y axis range and domain
    y axis will not be shown on the svg but it will be used 
    to give each bar a position and a rank.
    */
    var barY = d3.scale.linear()
        .domain([3, 0])
        .range([b_height, 0]);

    // set x axis style
    var xAx = d3.svg.axis()
        .scale(barX)
        .ticks(width > 500 ? 5 : 2)
        .innerTickSize(-(b_height))
        .orient("top");

    // add x axis to the svg
    bar_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + b_margin.top + ")")
        .call(xAx);

    // add bars to the svg
    bar_svg.selectAll("rect")
        .data(dateSlice, function (d) { return d.state })
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", barX(0))
        .attr("width", function (d) { return barX(d.cumu_sum) - barX(0) - 1 })
        .attr("y", function (d) { return barY(d.rank) - 30 })
        .attr("height", 20)
        .style("fill", function (d) { return color(d.state); });

    // add labels to each bar
    // the label text is the name of each state
    bar_svg.selectAll("text.label")
        .data(dateSlice, function (d) { return d.state })
        .enter()
        .append("text")
        .attr("class", "bar_label")
        .attr("x", function (d) { return barX(d.cumu_sum) - 8 })
        .attr("y", function (d) { return barY(d.rank) - 15 })
        .attr("text-anchor", "end")
        .html(function (d) { return d.state });

    // add values to each bar
    bar_svg.selectAll("text.bar_val")
        .data(dateSlice, function (d) { return d.state })
        .enter()
        .append("text")
        .attr("class", "bar_val")
        .attr("x", function (d) { return barX(d.cumu_sum) + 8 })
        .attr("y", function (d) { return barY(d.rank) - 15 })
        .text(function (d) { return d.cumu_sum });

    // add a timestamp on the svg to show the date of the current one-day data
    var timeStamp = bar_svg.append("text")
        .attr("class", "bar_time")
        .attr("x", b_width + b_margin.right)
        .attr("y", b_height + 20)
        .style({
            "text-anchor": "end",
            "stroke-width": 3,
            "stoke-linejoin": "round",
            "fill": "rgb(211,211,211)",
            "opacity": 0.5,
            "stroke": "rgb(211,211,211)",
            "font-size": "60px"
        })
        .html(time.substring(0, 7));

    // set delay time to delay animation and give time for processing map data
    var delayTime = 4400;

    //set delay
    setTimeout(function (d) {
        // set timer
        let ticker = setInterval(function (e) {
            // after interval change one-day data to the next date
            dateSlice = data.filter(function (d) { return d.acq_date == time })
                .slice(0, 3);

            // change x axis domain
            barX.domain([0, d3.max(dateSlice, function (d) { return d.cumu_sum })]);

            // strech or contrast the x axis based on domain
            bar_svg.select(".axis")
                .transition()
                .duration(duration)
                .ease("linear")
                .call(xAx);

            // select all bars
            var bars = bar_svg.selectAll(".bar").data(dateSlice, function (d) { return d.state });

            // add new bars
            bars
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", barX(0))
                .attr("width", function (d) { return barX(d.cumu_sum) - barX(0) - 1 })
                .attr("y", barY(4) - 30)
                .attr("height", 20)
                .style("fill", function (d) { return color(d.state); });

            // add amination
            bars.transition()
                .duration(duration)
                .ease("linear")
                .attr("width", function (d) { return barX(d.cumu_sum) - barX(0) - 1 })
                .attr("y", function (d) { return barY(d.rank) - 30 });

            // remove old bars
            bars
                .exit()
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("width", function (d) { return barX(d.cumu_sum) - barX(0) - 1 })
                .attr("y", barY(4) - 30)
                .remove();

            var labels = bar_svg.selectAll(".bar_label")
                .data(dateSlice, function (d) { return d.state });

            labels
                .enter()
                .append("text")
                .attr("class", "bar_label")
                .attr("x", function (d) { return barX(d.cumu_sum) - 8 })
                .attr("y", function (d) { return barY(4) - 15 })
                .attr("text-anchor", "end")
                .html(function (d) { return d.state })
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("y", function (d) { return barY(d.rank) - 15 });

            labels
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("x", function (d) { return barX(d.cumu_sum) - 8 })
                .attr("y", function (d) { return barY(d.rank) - 15 });

            labels
                .exit()
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("x", function (d) { return barX(d.cumu_sum) - 8 })
                .attr("y", function (d) { return barY(4) - 15 })
                .remove();

            var val_labels = bar_svg.selectAll(".bar_val").data(dateSlice, function (d) { return d.state });

            val_labels
                .enter()
                .append("text")
                .attr("class", "bar_val")
                .attr("x", function (d) { return barX(d.cumu_sum) + 8 })
                .attr("y", function (d) { return barY(4) - 15 })
                .text(function (d) { return d.cumu_sum })
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("y", function (d) { return barY(d.rank) - 15 });

            val_labels
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("x", function (d) { return barX(d.cumu_sum) + 8 })
                .attr("y", function (d) { return barY(d.rank) - 15 })
                .tween("text", function (d) {
                    var i = d3.interpolateRound(d.cumu_sum, d.next_val);
                    return function (t) {
                        this.textContent = d3.format(",")(i(t));
                    }
                });

            val_labels
                .exit()
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("x", function (d) { return barX(d.cumu_sum) + 8 })
                .attr("y", function (d) { return barY(4) - 15 })
                .remove();
            timeStamp.html(time.substring(0, 7));

            if (time == "2020-01-10") clearInterval(ticker)
            var parsed = parseDate(time);
            parsed = d3.time.day.offset(parsed, 1);
            time = formatDate(parsed);
        }, duration);
    }, delayTime);



});