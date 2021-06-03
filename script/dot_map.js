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

d3.json("/data/aus_map.geojson", function (json) {
    m_svg.append("g")
        .attr("transform", "translate(0, 300)")
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", m_path)
        .attr("id", function (d) {
            return d.properties.STE_NAME16;
        })
        .attr("stroke", "rgb(211,211,211)")
        .attr("fill", "rgb(32,33,36)")
});

d3.csv("/data/spatial_data.csv", function (data) {
    m_svg.append("g")
        .attr("id", "dot_layer")
        .attr("transform", "translate(0, 300)")
        .selectAll("circle")
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
        .attr("fill", "rgb(149,44,41)")
        .attr("class", "m_dot");
});

