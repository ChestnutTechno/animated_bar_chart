var m_margin = { top: 20, right: 50, bottom: 30, left: 50 },
    m_width = 960 - margin.left - margin.right,
    m_height = 960 - margin.top - margin.bottom;

var projection = d3.geo.mercator().center([132, -28])
    .translate([width / 2, height / 2])
    .scale(1000);

var m_path = d3.geo.path().projection(projection);

var m_svg = d3.select("#map")
    .append("svg")
    .attr("width", m_width)
    .attr("height", m_height)
    .attr("transform", "translate(" + m_margin.left + "," + m_margin.top + ")");

// The following data is accessed remotely. The URL is the Github repository of this project
// The data processing and normalisation code is in data processing directory
d3.csv("https://raw.githubusercontent.com/ChestnutTechno/aus_fire_vis/main/data/group_by_state.csv", function (sdata) {
    d3.json("https://raw.githubusercontent.com/ChestnutTechno/aus_fire_vis/main/data/aus_map.geojson", function (json) {
        d3.csv("https://raw.githubusercontent.com/ChestnutTechno/aus_fire_vis/main/data/spatial_data.csv", function (data) {
            
        // configure map colors
        var m_color = d3.scale.ordinal();
            s_sub = []
            for (let index = 0; index < color.domain().length; index++) {
                const element = color.domain()[index];
                s_sub.push(element.substring(0, 3));

            }
            m_color.domain(s_sub).range(color.range());

            var tooltip = d3.select("#map")
                .append("div")
                .attr("id", "map_tool_tip");

            var tx = tooltip.append("p")
                .attr("id", "map_tool_tip_tx")
                .text("tool tip test");


            m_svg.append("g")
                .attr("transform", "translate(0, 350)")
                .selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", m_path)
                .attr("id", function (d) {
                    return d.properties.STE_NAME16.substring(0, 3);
                })
                .attr("stroke", "rgb(211,211,211)")
                .attr("fill", "rgb(32,33,36)")
                .on("mouseover", function () {
                    var id = this.getAttribute("id")
                    m_svg.select("#" + id)
                        .transition()
                        .duration(200)
                        .attr("opacity", .3)
                        .attr("fill", function () {
                            return m_color(id);
                        });

                    tooltip.style("display", "block");
                    var s = sdata.filter(function (d) { return d.state.substring(0, 3) == id })[0];
                    tx.text(s.state + " --- Number of observation: " + s.total);
                })
                .on("mousemove", function () {
                    tooltip.style("top", (d3.event.pageY + 10) + "px")
                        .style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                    m_svg.selectAll("path")
                        .transition()
                        .duration(200)
                        .attr("opacity", 1)
                        .attr("fill", "rgb(32,33,36)");
                })
                .on("click", function (d) {
                    var id = this.getAttribute("id");
                    var filtered = data.filter(function (d) { return d.state.substring(0, 3) == id });
                    var dot_layer = m_svg.append("g")
                        .attr("class", "dot_layer")
                        .attr("transform", "translate(0, 350)");
                    var dots = dot_layer.selectAll("circle")
                        .data(filtered)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) {
                            return projection([d.longitude, d.latitude])[0];
                        })
                        .attr("cy", function (d) {
                            return projection([d.longitude, d.latitude])[1];
                        })
                        .attr("r", .5)
                        .attr("opacity", 0.3)
                        .attr("fill", "rgb(211,211,211)")
                        .attr("class", "m_dot")
                });


            // clear dots button
            d3.select("#clr_dots_btn")
                .on("click", function () {
                    m_svg.selectAll(".dot_layer")
                        .remove();
                });

            // show all dots button
            d3.select("#show_dots_btn")
                .on("click", function () {
                    var dot_layer = m_svg.append("g")
                        .attr("class", "dot_layer")
                        .attr("transform", "translate(0, 350)");
                    var dots = dot_layer.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) {
                            return projection([d.longitude, d.latitude])[0];
                        })
                        .attr("cy", function (d) {
                            return projection([d.longitude, d.latitude])[1];
                        })
                        .attr("r", .5)
                        .attr("opacity", .3)
                        .attr("fill", "rgb(211,211,211)")
                        .attr("class", "m_dot")
                });
        });
    });
});