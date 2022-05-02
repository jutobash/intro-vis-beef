
(function () {
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.
    //read in our json file

    Promise.all([
        d3.json("./topo.json"),
        d3.csv("./cities.csv")]).then((data) => {

            var data1 = [ //test bar data
                { type: "consumption", value: 4 },
                { type: "production", value: 16 }
            ];

            const width = 800;
            const height = 400;
            const topology = data[0]; //we will keep topology
            const cities = data[1]; //cities will be changed to include information on state plants

            //console.log(cities);

            var heats = d3.scaleSequential() //will be based on state emmission stat
                .domain([1, 50])
                .range(["yellow", "red"]);

            var radius = d3.scaleSequential() // redundant encoding emmission stat
                .domain([1, 50])
                .range([1, 10]);

            var projection = d3.geoAlbersUsa().scale(700).translate([width / 2, height / 2])

            var path = d3.geoPath(projection);

            const topo = topojson.feature(topology, topology.objects.states)

            const svg = d3.select("#geoCanvas").append('svg').attr("width", width).attr("height", height).attr('transform', 'translate(50,50)');

            const barsvg = d3.select("#geoCanvas").append('svg').attr("width", width).attr("height", height);

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
                    .html(d.name)
                    .style("left", (event.x) + "px")
                    .style("top", (event.y) - 50 + "px")
            }
            var mouseleave = function (event, d) {
                Tooltip.style("opacity", 0)
            }

            function update(data) { //updates bar graph based on point clicked

                var u = barsvg.selectAll("rect")
                    .data(data)

                u
                    .join("rect")
                    .transition()
                    .duration(1000)
                    .attr("x", d => x(d.type))
                    .attr("y", d => y(d.value))
                    .attr("width", x.bandwidth())
                    .attr("height", d => 350 - y(d.value))
                    .attr("fill", d => d.type == "consumption" ? "red" : "blue") //red for consumption blue otherwise
            }

            //statepoints
            svg.selectAll("circle")
                .data(cities)
                .join("circle")
                .attr("class", "circle")
                .attr("stroke", "khaki")
                .attr("stroke-width", "2px")
                .attr("r", function () { //double encoded based on emission
                    return radius(Math.floor(Math.random() * 50));
                })
                .attr("cx", function (d) { //change lat long for plant locs
                    var lon = projection([d.longitude, d.latitude]);
                    return lon[0];
                })
                .attr("cy", function (d) {
                    var lat = projection([d.longitude, d.latitude]);
                    return lat[1];
                })
                .attr("fill", function () { // squale sequential based on emission double encoded with "r"
                    return heats(Math.floor(Math.random() * 50));
                })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("click", function () { // change data to data.name of the circle
                    update(data1); //pass specific plant/state to update
                })

            //axes not appearing properly current fix: edit height/width + axisRight 
            
            // X axis
            const x = d3.scaleBand()
                .range([0, width])
                .domain(data1.map(d => d.type)) // x axis labels
                .padding(.2)
            barsvg.append("g")
                .attr("transform", `translate(0,${350})`) //reflect height here in y axis and bar update func above
                .call(d3.axisBottom(x))

            // Add Y axis 
            const y = d3.scaleLinear()
                .domain([0, 20]) //label values
                .range([350, 0])
            barsvg.append("g")
                .attr("class", "Yaxis")
                .call(d3.axisRight(y))
                
            barsvg.append('text') //x-axis
                .attr('class', 'axis-title') //Optional: change font size and font weight
                .attr('y', 350 + 25) //add to the bottom of graph (-25 to add it above axis)
                .attr('x', width - 60) //add to the end of X-axis (-60 offsets the width of text)
                .text('Type'); //actual text to display

            barsvg.append('text') //y-axis
                .attr('class', 'axis-title') //Optional: change font size and font weight
                .attr('x', 10) //add some x padding to clear the y axis
                .attr('y', 25) //add some y padding to align the end of the axis with the text
                .text('CH4 Emission/Dollars/?'); 
        })

})();
