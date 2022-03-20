
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













