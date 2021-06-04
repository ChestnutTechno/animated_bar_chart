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

var duration = 190;

d3.csv("https://raw.githubusercontent.com/ChestnutTechno/aus_fire_vis/main/data/bar.csv", function (data) {

    var formatDate = d3.time.format("%Y-%m-%d");
    var parseDate = formatDate.parse;

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

    var time = "2019-08-01"

    var dateSlice = data.filter(function (d) { return d.acq_date == time })
        .slice(0, 3);

    var barX = d3.scale.linear()
        .domain([0, d3.max(dateSlice, function (d) { return d.cumu_sum })])
        .range([0, b_width]);

    var barY = d3.scale.linear()
        .domain([3, 0])
        .range([b_height, 0]);

    var xAx = d3.svg.axis()
        .scale(barX)
        .ticks(width > 500 ? 5 : 2)
        .innerTickSize(-(b_height))
        .orient("top");

    bar_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + b_margin.top + ")")
        .call(xAx);

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

    bar_svg.selectAll("text.label")
        .data(dateSlice, function (d) { return d.state })
        .enter()
        .append("text")
        .attr("class", "bar_label")
        .attr("x", function (d) { return barX(d.cumu_sum) - 8 })
        .attr("y", function (d) { return barY(d.rank) - 15 })
        .attr("text-anchor", "end")
        .html(function (d) { return d.state });

    bar_svg.selectAll("text.bar_val")
        .data(dateSlice, function (d) { return d.state })
        .enter()
        .append("text")
        .attr("class", "bar_val")
        .attr("x", function (d) { return barX(d.cumu_sum) + 8 })
        .attr("y", function (d) { return barY(d.rank) - 15 })
        .text(function (d) { return d.cumu_sum });

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

    var delayTime = 4400;

    //set delay
    setTimeout(function (d) {
        let ticker = setInterval(function (e) {
            dateSlice = data.filter(function (d) { return d.acq_date == time })
                .slice(0, 3);

            barX.domain([0, d3.max(dateSlice, function (d) { return d.cumu_sum })]);

            bar_svg.select(".axis")
                .transition()
                .duration(duration)
                .ease("linear")
                .call(xAx);

            var bars = bar_svg.selectAll(".bar").data(dateSlice, function (d) { return d.state });

            bars
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", barX(0))
                .attr("width", function (d) { return barX(d.cumu_sum) - barX(0) - 1 })
                .attr("y", barY(4) - 30)
                .attr("height", 20)
                .style("fill", function (d) { return color(d.state); })
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("y", function (d) { return barY(d.rank) - 30 });

            bars.transition()
                .duration(duration)
                .ease("linear")
                .attr("width", function (d) { return barX(d.cumu_sum) - barX(0) - 1 })
                .attr("y", function (d) { return barY(d.rank) - 30 });

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