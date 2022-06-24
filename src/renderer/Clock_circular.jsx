
import React, { Component } from 'react';
import moment from 'moment';
import * as d3 from 'd3';

export default class Clock_circular extends Component
{

    static defaultProps = {
        width : 500,
        height: 500,
    };

    constructor(props)
    {
        super(props);

        this.state = {
            angle  : ((moment().hour()+moment().minutes()/60.0          )/24.0) * Math.PI * 2,
            angle_p: ((moment().hour()+moment().minutes()/60.0 - 25/60.0)/24.0) * Math.PI * 2,
        };
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

        // let angle   = ((moment().hour()+moment().minutes()/60.0)/24.0) * Math.PI * 2;
        // let angle_p = ((moment().hour()+moment().minutes()/60.0 - 25/60.0)/24.0) * Math.PI * 2;

        d3
        .select(this.refs.group_main)
        .selectAll("*")
        .remove();

        // d3
        // .select(this.refs.group_main)
        // .append("rect")
        // .attr("width" , this.props.width )
        // .attr("height", this.props.height)
        // .attr("x", 0)
        // .attr("y", 0)
        // .attr("fill", "#D00")
        // .style("opacity", 0.7);

        d3
        .select(this.refs.group_main)
        .append('line')
            .style("opacity", 0.2)
            .style("stroke", "#FFF")
            .style("stroke-width", 1)
            .attr("x1", (0) )
            .attr("y1", (this.props.height / 2) )
            .attr("x2", (this.props.width) )
            .attr("y2", (this.props.height / 2) );
        d3
        .select(this.refs.group_main)
            .append('line')
            .style("opacity", 0.2)
            .style("stroke", "#FFF")
            .style("stroke-width", 1)
            .attr("x1", (this.props.width / 2))
            .attr("y1", (0))
            .attr("x2", (this.props.width / 2))
            .attr("y2", (this.props.height)); 

        d3
        .select(this.refs.group_main)
            .append('line')
            .style("stroke", "#FFF")
            .style("stroke-width", 1)
            .attr("x1", (this.props.width  / 2) +  (  Math.sin(thiz.state.angle)) * (this.props.width/2 - 100))
            .attr("y1", (this.props.height / 2) +  (- Math.cos(thiz.state.angle)) * (this.props.width/2 - 100))
            .attr("x2", (this.props.width  / 2) +  (  Math.sin(thiz.state.angle)) * (this.props.width/2 - 120))
            .attr("y2", (this.props.height / 2) +  (- Math.cos(thiz.state.angle)) * (this.props.width/2 - 120));

        d3
        .select(this.refs.group_main)
            .append('line')
            .style("stroke", "#FFF")
            .style("opacity", 0.1)
            .style("stroke-width", 1)
            .attr("x1", (this.props.width  / 2) +  (  Math.sin(thiz.state.angle_p)) * (this.props.width/2 - 100))
            .attr("y1", (this.props.height / 2) +  (- Math.cos(thiz.state.angle_p)) * (this.props.width/2 - 100))
            .attr("x2", (this.props.width  / 2) +  (  Math.sin(thiz.state.angle_p)) * (this.props.width/2 - 120))
            .attr("y2", (this.props.height / 2) +  (- Math.cos(thiz.state.angle_p)) * (this.props.width/2 - 120)); 

    }

    componentDidMount() {

        setInterval(async () => {
            this.setState({
                angle  : ((moment().hour()+moment().minutes()/60.0          )/24.0) * Math.PI * 2,
                angle_p: ((moment().hour()+moment().minutes()/60.0 - 25/60.0)/24.0) * Math.PI * 2,
            })
        }, 10 * 1000)
        
        this.draw();
    }
    componentDidUpdate() {this.draw();}
}
