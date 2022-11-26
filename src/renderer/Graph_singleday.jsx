
import React, { Component } from 'react';
import moment from 'moment';
import * as d3 from 'd3';

export default class Graph_singleday extends Component
{
    static defaultProps = {
        width     : 1100,
        height    : 1100,
        thickness : 60,
        day_offset: 0,
    };

    constructor(props)
    {
        super(props);
        this.tooltip      = d3.select("#tooltip");
        this.tooltip_date = d3.select("#tooltip_date");
        setTimeout(() => { this.tooltip      = d3.select("#tooltip"     ); }, 100)
        setTimeout(() => { this.tooltip_date = d3.select("#tooltip_date"); }, 100)
    }

    render()
    {
        return (
        <svg
            viewBox = {"0 0 "+this.props?.width+" "+this.props?.height}
            width   = {this.props?.width}
            height  = {this.props?.height}
            ref     = "root"
            // style={{position:"absolute"}}
        >
        <g ref="group_main"></g>
        </svg>
        );
    }

    draw()
    {
        // console.log("Redrawing...")

        let thiz = this // I guess the better way to do it is by binding (?)

        d3
        .select(this.refs.group_main)
        .selectAll("*")
        .remove();
        
        if (false)
        {

        // d3
        // .select(this.refs.group_main)
        // .append("rect")
        // .attr("width" , this.props.width )
        // .attr("height", this.props.height)
        // .attr("x", 0)
        // .attr("y", 0)
        // .attr("fill", "#F00")
        // .style("opacity", 0.7);

        var arcGenerator = d3.arc()
            .innerRadius((this.props.height/2) - this.props.thickness)
            .outerRadius((this.props.height/2));
        
        this.g = d3.select(this.refs.group_main).append("g").attr("transform", "translate("+this.props.width/2+", "+this.props.height/2+")");

        this.data         = [10, 40, 30, 20, 60, 80];
        var pieGenerator = d3.pie();
        var arcData      = pieGenerator(this.data);
        
        arcData = [
            {
                "data"      : 60,
                "index"     : 1,
                "value"     : 60,
                "startAngle": 2.0943951023931953,
                "endAngle"  : 3.665191429188092,
                "padAngle"  : 0,
            }
        ]

        // console.log(arcData)

        this.scale_color = d3.scaleLinear().domain([Math.min(...this.data), Math.max(...this.data)]).range([1, 0]);

        // let thiz = this;

        this.path_arc = this.g.selectAll('path').data(arcData).enter()
            .append('path')
            // .style("stroke-width","0")
            .style("fill", function(d, i) {
                // return "#fff";
                return d3.interpolateSpectral(thiz.scale_color(d.value));
                // return d3.schemePastel1(      thiz.scale_color(d.value));
                // return d3.interpolateCividis( contexto.scale_color(d.value));
                // return d3.interpolateInferno( contexto.scale_color(d.value));
                // return d3.interpolateRdYlBu(  contexto.scale_color(d.value));
                // return contexto.color_index(i);
            })
            .attr('d', arcGenerator);
            // .style("stroke-width", 10)
            // .style("stroke", function(d) { return "#fff" });

        // const arc = d3.arc();
        // arc({
        //   innerRadius: 0,
        //   outerRadius: 100,
        //   startAngle: 0,
        //   endAngle: Math.PI / 2
        // }); // "M0,-100A100,100,0,0,1,100,0L0,0Z"

        }

        if (false)
        {
            let arc_generator = d3.arc()
            .innerRadius((this.props.height/2) - this.props.thickness)
            .outerRadius((this.props.height/2));
                
            let arc_data = [
                {
                    "startAngle": Math.PI * 0,
                    "endAngle"  : Math.PI * 1,
                    "padAngle"  : 0,
                }
            ];
            
            this.g = d3
                .select(this.refs.group_main)
                .append("g")
                .attr("transform", "translate("+this.props.width/2+", "+this.props.height/2+")");
            
            this.g.selectAll('path').data(arc_data).enter()
                .append('path')
                .style("fill", function(d, i) { return "#fff"; })
                .attr('d', arc_generator);
        }

        let arc_generator = d3.arc()
        .innerRadius((this.props.height/2) - this.props.thickness)
        .outerRadius((this.props.height/2));

        // Display of arc events
        if (true)
        {

            this.props.categories.forEach((element, index_el) => {
                
                if (!element.visible) { return null; }

                let sub_data = element.data
                .filter(i => i.end)
                // .filter(i => (moment().diff(moment(i.start).startOf('day'),"days")) < 1)
                // .filter(i => (moment().diff(moment(i.start),"days")) < 1)
                // .filter(i => ((moment().subtract(- this.props.day_offset, "days")).diff(moment(i.start).startOf('day'),"days")) < 1)
                .filter(i => {
                    return moment().subtract(- this.props.day_offset, "days").dayOfYear() === moment(i.start).dayOfYear()
                })

                // element.data.forEach(x => {

                //     // console.log(x.start)

                //     // console.log(
                //     //     ((moment().subtract(- this.props.day_offset, "days")).diff(moment(x.start).startOf('day'),"days"))
                //     // )

                //     // console.log(
                //     //     moment()
                //     //     .diff(
                //     //         moment(x.start).startOf('day'),
                //     //         "days"
                //     //     )
                //     // )

                //     console.log(
                //         moment(x.start).dayOfYear()
                //     )

                // })
                
                let new_data = sub_data.map(x => {

                    let start_hour                          = moment(x.start).hour();
                    let start_hour_with_0_padding_on_left   = ("0" + start_hour).slice(-2);
                    let start_minute                        = moment(x.start).minute();
                    let start_minute_with_0_padding_on_left = ("0" + start_minute).slice(-2);

                    let end_hour                          = moment(x.end).hour();
                    let end_hour_with_0_padding_on_left   = ("0" + end_hour).slice(-2);
                    let end_minute                        = moment(x.end).minute();
                    let end_minute_with_0_padding_on_left = ("0" + end_minute).slice(-2);

                    let to_display = (
                        start_hour_with_0_padding_on_left   + ":" +
                        start_minute_with_0_padding_on_left + " - " +
                        end_hour_with_0_padding_on_left     + ":" +
                        end_minute_with_0_padding_on_left
                    )

                    return {
                        "start_time": to_display,
                        "startAngle": ((moment(x.start).hour()+moment(x.start).minutes()/60.0)/24.0) * Math.PI * 2,
                        "endAngle"  : ((moment(x.end  ).hour()+moment(x.end  ).minutes()/60.0)/24.0) * Math.PI * 2,
                        "color"     : x.color ?? element.color ?? "#FFF",
                        "tooltip"   : x.tooltip ?? "",
                        "index"     : index_el,
                    }
                })

                // console.log(this.props)

                this.g = d3
                    .select(this.refs.group_main)
                    .append("g")
                    .attr("transform", "translate("+this.props.width/2+", "+this.props.height/2+")");
                this.g.selectAll('path').data(new_data).enter()
                    .append('path')
                    .style("fill", d => d.color)
                    .attr("index", d => d.index)
                    .attr("tooltip", d => d.tooltip)
                    .attr("start_time", d => d.start_time)
                    .attr('d', arc_generator)
                    .on("mouseover", function(e) {

                        let ooooo = document.querySelectorAll(".button_category").forEach(x => {
                            x.style["color"] = "rgb(175, 175, 175)"
                        })

                        document.getElementById("circular_clock_text").innerHTML = e.target.getAttribute("start_time")

                        document.querySelectorAll(".button_category")[e.target.getAttribute("index")].style["color"] = "rgb(240, 240, 240)";

                        if (e.target.getAttribute("tooltip"))
                        {
                            let rect = e.target.getBoundingClientRect()
                            let x    = rect.x
                            let y    = rect.y + rect.height / 2
        
                            thiz.tooltip
                            .style("opacity", 1.0)
                            .style("display", "block");
                            
                            thiz.tooltip
                            // .transition()
                            // .duration(70)
                            .html ((d, i) => {return e.target.getAttribute("tooltip")})
                            .style("left", d => {return x + "px"})
                            .style("top" , d => {return y + "px"});
        
                            // thiz.tooltip_date
                            // .html ((d, i) => {return e.target.getAttribute("date")+" ("+e.target.getAttribute("days_ago")+" days ago)" + " ("+e.target.getAttribute("date_dayofweek")+")"})                         
                            // .style("opacity", 1.0)
                            // .style("display", "block")
                            // .style("left", d => {return x + "px"})
                            // .style("top" , d => {return "10px"});
                        }
                    })
                    .on("mouseout", function(_d) {

                        document.querySelectorAll(".button_category").forEach(x => {
                            x.style["color"] = "rgb(175, 175, 175)"
                        })

                        document.getElementById("circular_clock_text").innerHTML = ""
                        
                        thiz.tooltip
                        .style("opacity", 0)
                        .style("display", "none");
                        thiz.tooltip_date
                        .style("opacity", 0)
                        .style("display", "none");
                    });
            });
        }
        
        // Display of single events as dots
        if (true)
        {
            // console.log(this.props.categories)

            // let arc_generator = d3.arc()
            // .innerRadius((this.props.height/2) - 100)
            // .outerRadius((this.props.height/2));

            this.props.categories.forEach(element => {
                
                // console.log(
                //     moment().subtract(- this.props.day_offset, "days").dayOfYear()
                // )

                // console.log(element)
                if (!element.visible) { return null; }

                let sub_data = element.data
                .filter(i => !i.end)
                // .filter(i => (moment().diff(moment(i.start).startOf('day'),"days")) < 1)
                // .filter(i => (moment().diff(moment(i.start),"days")) < 1)
                .filter(i => {
                    return moment().subtract(- this.props.day_offset, "days").dayOfYear() === moment(i.start).dayOfYear()
                })
                let new_data = sub_data.map(x => {
                    
                    let sssss = ((moment(x.start).hour()+moment(x.start).minutes()/60.0)/24.0) * Math.PI * 2;
                    
                    // console.log(x)
                    // console.log(
                    //     sssss,
                    //     Math.cos(sssss),
                    //     Math.sin(sssss),
                    // )

                    // sssss = 0
                    // sssss = Math.PI * 0.5
                    // sssss = Math.PI

                    return {
                        "cx"     :  Math.sin(sssss) * ((this.props.width/2) - this.props.thickness/2),
                        "cy"     :- Math.cos(sssss) * ((this.props.width/2) - this.props.thickness/2),
                        "r"      : (x.size  ?? 4.5) * 1,
                        "fill"   : x.color ?? element.color ?? "#FFF",
                        "opacity": 1.0,
                    }
                })
                // console.log(new_data)

                this.g = d3
                    .select(this.refs.group_main)
                    .append("g")
                    .attr("transform", "translate("+this.props.width/2+", "+this.props.height/2+")");

                this.g.selectAll('circle').data(new_data)
                .join(
                    enter => enter
                        .append("circle")
                        .attr("cx"      , d => d.cx     )
                        .attr("cy"      , d => d.cy     )
                        .style("r"      , d => d.r      )
                        .style("fill"   , d => d.fill   )
                        .style("opacity", d => d.opacity),
                    update => update
                        .append("circle")
                        .attr("cx"      , d => d.cx     )
                        .attr("cy"      , d => d.cy     )
                        .style("r"      , d => d.r      )
                        .style("fill"   , d => d.color  )
                        .style("opacity", d => d.opacity),
                    exit => exit
                        .remove(),
                )

            });
        }

    }

    componentDidMount()
    {
    	this.draw();

        // We redraw when the day changes
        this.day_as_string_today = moment().subtract(1, "hours").format("YYYY-MM-DD");
        setInterval(async () => {
            let day_as_string = moment().subtract(1, "hours").format("YYYY-MM-DD");
            if (day_as_string !== this.day_as_string_today) {
                this.day_as_string_today = day_as_string;
                this.draw();
            }
        }, 1000)
    }

    componentDidUpdate()
    {
        this.draw();
    }
}

