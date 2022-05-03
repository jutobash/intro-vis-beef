
(function () {
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.
    //read in our json file

    Promise.all([
        d3.json("./topo.json"),
        d3.csv("./plants.csv")]).then((data) => {

            const width = 550;
            const height = 400;
            const topology = data[0]; //we will keep topology
            const plants = data[1]; //cities will be changed to include information on state plants

            var data1 = [{
                statecattle: 2700000
            }]
            var data2 = [{
                statecattle: 4000000
            }]
            var data3 = [{
                statecattle: 6550000
            }]
            var data4 = [{
                statecattle: 4310000
            }]
            var data5 = [{
                statecattle: 6850000
            }]
            var data6 = [{
                statecattle: 5300000
            }]
            var data7 = [{
                statecattle: 4000000
            }]
            var data8 = [{
                statecattle: 13100000
            }]
            var data9 = [{
                statecattle: 3450000
            }]
            var data10 = [{
                statecattle: 5150000
            }]

            var heats = d3.scaleSequential() //needs: emmission stat
                .domain([594000000, 2882000000])
                .range(["yellow", "red"]);

            var radius = d3.scaleSequential() // redundant encoding emmission stat
                .domain([594000000, 2882000000])
                .range([10, 30]);

            var projection = d3.geoAlbersUsa().scale(700).translate([width / 2, height / 2])

            var path = d3.geoPath(projection);

            const topo = topojson.feature(topology, topology.objects.states)

            const svg = d3.select("#geoCanvas").append('svg').attr("width", width).attr("height", height).attr('transform', 'translate(50,50)');

            const barsvg = d3.select("#geoCanvas").append('svg').attr("width", width).attr("height", height).attr('transform', 'translate(50,50)');

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

            //Tooltip
            const Tooltip = d3.select("#geoCanvas")
                .append("div")
                .style("position", "absolute")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")


            //Tooltip mouse funcs
            const mouseover = function (event, d) {
                Tooltip.style("opacity", 1)
            }
            var mousemove = function (event, d) {
                Tooltip
                    .html("State: " + d.name + "<br>" + "Largest Plant: " + d.largestplant + "<br>" + "Cattle Count: " + d.statecattle) //add state, largestplantname, number of cattle per state
                    .style("left", (event.x) + "px")
                    .style("top", (event.y) - 90 + "px")
            }
            var mouseleave = function (event, d) {
                Tooltip.style("opacity", 0)
            }

            function update(data) { //updates bar graph based on point clicked'

                var u = barsvg.selectAll("rect")
                    .data(data)
                u
                    .join("rect")
                    .transition()
                    .duration(1000)
                    .attr("x", 85)
                    .attr("y", d => y(d.statecattle * 220))
                    .attr("width", x.bandwidth())
                    .attr("height", d => 350 - y(d.statecattle * 220))
                    .attr("fill", "orange")

                /*var textbar = barsvg.selectAll("bartext")
                    .data(data)
                textbar.enter()
                    .append("text")
                    .transition().duration(1000)
                    .attr("class", "bartext")
                    .attr("text-anchor", "middle")
                    .attr("x", 250)
                    .attr("y", d => (y(d.statecattle * 220)) - 3)
                    .text(function (d) { return (d.statecattle * 220) + (" LBs"); });
                textbar.exit().remove();

                //barsvg.selectAll("textbar").select("text").remove();
                //textbar.exit().remove(); //not functional */
            }

            //statepoints
            svg.selectAll("circle")
                .data(plants)
                .join("circle")
                .attr("class", "circle")
                .attr("stroke", "khaki")
                .attr("stroke-width", "2px")
                .attr("r", function (d) { //pass emmision value
                    console.log(d.statecattle * 220)
                    return radius(d.statecattle * 220);
                })
                .attr("cx", function (d) { //change lat long for plant locs
                    var lon = projection([d.longitude, d.latitude]);
                    return lon[0];
                })
                .attr("cy", function (d) {
                    var lat = projection([d.longitude, d.latitude]);
                    return lat[1];
                })
                .attr("fill", function (d) { // squale sequential based on emission double encoded with "r"
                    return heats(d.statecattle * 220);
                })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("click", function (d) {
                    if (d.target.__data__.name == "California") {
                        update(data10);
                    } else if (d.target.__data__.name == "Colorado") {
                        update(data1);
                    } else if (d.target.__data__.name == "Iowa") {
                        update(data2);
                    } else if (d.target.__data__.name == "Kansas") {
                        update(data3);
                    } else if (d.target.__data__.name == "Missouri") {
                        update(data4);
                    } else if (d.target.__data__.name == "Nebraska") {
                        update(data5);
                    } else if (d.target.__data__.name == "Oklahoma") {
                        update(data6);
                    } else if (d.target.__data__.name == "South Dakota") {
                        update(data7);
                    } else if (d.target.__data__.name == "Texas") {
                        update(data8);
                    } else {
                        update(data9);
                    }
                    //update(d.target.__data__); //not working unsure why
                })

            //axes not appearing properly current fix: edit height/width + axisRight 

            // X axis
            const x = d3.scaleBand()
                .range([0, width])
                .domain(["Ranch Emissions"]) // x axis labels
                .padding(.2)
            barsvg.append("g")
                .attr("transform", `translate(0,${350})`) //reflect height here in y axis and bar update func above
                .call(d3.axisBottom(x))

            // Add Y axis 
            const y = d3.scaleLinear()
                .domain([0, 3100000000]) //label values
                .range([350, 0])
            barsvg.append("g")
                .attr("class", "Yaxis")
                .call(d3.axisRight(y))

            barsvg.append('text') //y-axis
                .attr('class', 'axis-title') //Optional: change font size and font weight
                .attr('x', 80) //add some x padding to clear the y axis
                .attr('y', 15) //add some y padding to align the end of the axis with the text
                .text('LBs Methane (CH4)');
        })

})();
