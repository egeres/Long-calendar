
import React, { Component } from 'react';
import * as d3 from 'd3';


export default class Background_circular_clock extends Component
{
    static defaultProps = {
        width : 500,
        height: 500,
    };

    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
        <svg
            viewBox = {"0 0 "+this.props?.width+" "+this.props?.height}
            width   = {this.props?.width}
            height  = {this.props?.height}
            ref     = "root"
            style={{position:"absolute", pointerEvents:"none"}}
        >
        <g ref="group_main"></g>
        </svg>
        );
    }

    draw()
    {
        let thiz = this;

        d3.select(this.refs.group_main)
            .selectAll("*")
            .remove();

        d3.select(this.refs.group_main)
            .append('line')
            .style("opacity", 0.2)
            .style("stroke", "#FFF")
            .style("stroke-width", 1)
            .attr("x1", (0) )
            .attr("y1", (this.props.height / 2) )
            .attr("x2", (200) )
            .attr("y2", (this.props.height / 2) );
        d3.select(this.refs.group_main)
            .append('line')
            .style("opacity", 0.2)
            .style("stroke", "#FFF")
            .style("stroke-width", 1)
            .attr("x1", (this.props.width / 2))
            .attr("y1", (0))
            .attr("x2", (this.props.width / 2))
            .attr("y2", (200)); 
        d3.select(this.refs.group_main)
            .append('line')
            .style("opacity", 0.2)
            .style("stroke", "#FFF")
            .style("stroke-width", 1)
            .attr("x1", (this.props.width / 2))
            .attr("y1", (this.props.height))
            .attr("x2", (this.props.width / 2))
            .attr("y2", (this.props.height - 200)); 
        d3.select(this.refs.group_main)
            .append('line')
            .style("opacity", 0.2)
            .style("stroke", "#FFF")
            .style("stroke-width", 1)
            .attr("x1", (this.props.width) )
            .attr("y1", (this.props.height / 2) )
            .attr("x2", (this.props.width - 200) )
            .attr("y2", (this.props.height / 2) );
    }

    componentDidMount()
    {   
        this.draw();
    }
}








