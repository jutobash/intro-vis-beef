
(function () {
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.
    //read in our json file

    Promise.all([
        d3.json("./topo.json"),
        d3.csv("./cities.csv")]).then((data) => { 

            const topology = data[0]; //we will keep topology
            const cities = data[1]; //cities will be changed to include information on state plants

            //console.log(cities);

            var heats = d3.scaleSequential() //will be based on state emmission stat
                .domain([1, 50])
                .range(["yellow", "red"]);

            var radius = d3.scaleSequential() // redundant encoding emmission stat
                .domain([1, 50])
                .range([1, 10]);

            var projection = d3.geoAlbersUsa().scale(700).translate([487.5, 305])

            var path = d3.geoPath(projection);

            const topo = topojson.feature(topology, topology.objects.states)

            const svg = d3.select("#geomap").append('g').attr('transform', 'translate(50,50)');

            //tooltip mouse funcs
            const mouseover = function (event, d) {
                tooltip.style("opacity", 1)
            }
            var mousemove = function (event, d) {
                tooltip
                    .html(d.name)
                    .style("left", (event.x) / 2 + "px")
                    .style("top", (event.y) / 2 - 30 + "px")
            }
            var mouseleave = function (event, d) {
                tooltip.style("opacity", 0)
            }

            //usmap
            svg.append("g")
                .selectAll("path")
                .data(topo.features)
                .join("path")
                .attr("d", path)
                .attr("fill", "#b8b8b8")
                .attr("stroke", "black")
                .attr("opacity", .5)
                .attr("stroke-width", ".75px")

            //tooltip
            const tooltip = d3.select("#geomap")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 1)
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")

            //statepoints
            svg.selectAll("circle")
                .data(cities)
                .join("circle")
                .attr("stroke", "khaki")
                .attr("stroke-width", "2px")
                .attr("r", function () {
                    return radius(Math.floor(Math.random() * 50));
                })
                .attr("cx", function (d) {
                    var lon = projection([d.longitude, d.latitude]);
                    return lon[0];
                })
                .attr("cy", function (d) {
                    var lat = projection([d.longitude, d.latitude]);
                    return lat[1];
                })
                .attr("fill", function () {
                    return heats(Math.floor(Math.random() * 50));
                })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        })

})();
