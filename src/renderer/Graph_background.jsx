
import React, { Component } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

export default class Graph_background extends Component
{

    static defaultProps = {
        days_to_display: 40 ,
        width          : 500,
        height         : 500,
        margin         : 40 ,
        axis_length    : 40 ,
    };

    constructor(props)
    {
        super(props);

        // console.log(this.props.days_to_display)
    }

    render()
    {
        return (
        <svg
            viewBox = {"0 0 "+this.props?.width+" "+this.props?.height}
            width   = {this.props?.width}
            height  = {this.props?.height}
            ref     = "root"
            style={{position:"absolute"}}
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
        .select(this.refs.group_main)
        .append("rect")
        .attr("width" , this.props.width )
        .attr("height", this.props.height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "#000")
        .style("opacity", 0.7);

        d3
        .select(this.refs.group_main)
        .selectAll('.line_vertical')
        .data(d3.range(this.props?.days_to_display))
        // .data([0, 1, 3])
        .enter()
        .append('line')
        // .attr("x1", function(_d, _i) {return thiz.props.margin + _i * (thiz.props.width - thiz.props.margin*2) / (thiz.props?.days_to_display - 1) })
        // .attr("x2", function(_d, _i) {return thiz.props.margin + _i * (thiz.props.width - thiz.props.margin*2) / (thiz.props?.days_to_display - 1) })
            .attr("x1", function(_d, _i) {return Math.floor(thiz.props.margin + _i * (thiz.props.width - thiz.props.margin*2) / (thiz.props?.days_to_display - 1)) })
            .attr("x2", function(_d, _i) {return Math.floor(thiz.props.margin + _i * (thiz.props.width - thiz.props.margin*2) / (thiz.props?.days_to_display - 1)) })
            .attr("y1", thiz.props.margin)
            .attr("y2", thiz.props.height - thiz.props.margin)
            .attr("class", "line_vertical")
            .style("stroke-dasharray", ("2, 2"))
            .style("opacity", 0.4)
            .style("stroke", "#fff")
            .style("shape-rendering", "crispEdges")
            .style("stroke-width", 0.4);
    }

    componentDidMount()
    {
    	this.draw();
    }

    componentDidUpdate()
    {
        this.draw();
    }
}













