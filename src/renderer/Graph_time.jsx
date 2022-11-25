
import React, { Component } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

export default class Graph_time extends Component
{

    static defaultProps = {
        axis_length             : 40,
        width                   : 500,
        height                  : 500,
        margin                  : 40,
    };

    constructor(props)
    {
        super(props);

        // this.tooltip = d3.select("#tooltip").node();
        this.tooltip = d3.select("#tooltip");

        // console.log(this.tooltip)
    }

    render()
    {
        return (
        <svg
            className = {this.props.visible ? 'empty':'hidden'}
            viewBox   = {"0 0 "+this.props?.width+" "+this.props?.height}
            width     = {this.props?.width}
            height    = {this.props?.height}
            ref       = "root"
            style     = {{position:"absolute"}}
        >
        <g ref="group_main"></g>
        </svg>
        );
    }

    draw()
    {
        let thiz = this // I guess the better way to do it is by binding (?)

        d3
        .select(this.refs.group_main)
        .selectAll("*")
        .remove();

        d3
        .select(thiz.refs.group_main)
        .selectAll('.type_line')
        .data(thiz.props.data)
        .enter()
        .append('line')
            .attr("x1", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.start).startOf('day'),"days") / (thiz.props?.axis_length-1.0))) * (thiz.props.width - thiz.props.margin*2) })
            .attr("x2", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.end  ).startOf('day'),"days") / (thiz.props?.axis_length-1.0))) * (thiz.props.width - thiz.props.margin*2) })
            .attr("y1", i => { return thiz.props.margin + ((moment(i.start).hour()+moment(i.start).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
            .attr("y2", i => { return thiz.props.margin + ((moment(i.end  ).hour()+moment(i.end  ).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
            .style("stroke", i => this.props.color)
            .style("stroke-width", 10)

            .attr("tooltip", i => i.tooltip)

			.on("mouseover", function(e) {

                // console.log(e.target.getAttribute("tooltip"))

                if (e.target.getAttribute("tooltip"))
                {
                    thiz.tooltip.transition()
					.duration(50)
					.style("opacity", .9);

				    thiz.tooltip.html((d, i) => {
					return e.target.getAttribute("tooltip") })
					.style("left",function(d) {return e.pageX + "px"})
					.style("top" ,function(d) {return e.pageY + "px"})
                }

			})

			.on("mouseout", function(_d) {
				thiz.tooltip.transition()
					.duration(50)
					.style("opacity", 0);
			});
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













