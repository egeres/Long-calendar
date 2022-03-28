
import React, { Component } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import { readSync } from 'original-fs';
// import { ipcRenderer } from 'electron';
// window.ipcRenderer = require('electron').ipcRenderer;
import { ipcRenderer, ipcMain, dialog } from 'electron'

export default class Graph_multiple extends Component
{

    static defaultProps = {
        axis_length    : 40,
        width          : 500,
        height         : 500,
        margin         : 40,
        days_to_display: 40,
    };

    constructor(props)
    {
        super(props);

        // this.tooltip = d3.select("#tooltip").node();
        this.tooltip = d3.select("#tooltip");

        // console.log(this.tooltip)

        setTimeout(
            () => { this.tooltip = d3.select("#tooltip"); },
            100
        )

        // ipcRenderer.on('asynchronous-message', function (evt, message) {
        //     console.log(message); // Returns: {'SAVED': 'File Saved'}
        // });

    }

    render()
    {
        return (
        <svg
            // className = {this.props.visible ? 'empty':'hidden'}
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
        // console.log(this.props.data)

        // Single data is displated!
        this.props.data
        .filter(x => x.visible)
        .forEach(sub_data => {
            d3
            .select(thiz.refs.group_main)
            .selectAll('.type_circle')
            .data(sub_data.data)
            .enter()
            .append('circle')
            .filter(i => (moment().diff(moment(i.date_sta).startOf('day'),"days")) < thiz.props.days_to_display)
            .filter(i => !i.end)
                .attr("cx", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.start).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
                .attr("cy", i => { return thiz.props.margin + ((moment(i.start).hour()+moment(i.start).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
                .attr( "r"      , d => (d?.size    ?? sub_data.size    ?? 4.5   ))
                .style("fill"   , d => (d?.color   ?? sub_data.color   ?? "#FFF"))
                .style("opacity", d => (d?.opacity ?? sub_data.opacity ?? 1.0   ))
        });

        // Segment data is displated!
        this.props.data
        .filter(x => x.visible)
        .forEach(sub_data => {
            d3
            .select(thiz.refs.group_main)
            .selectAll('.type_line')
            .data(sub_data.data)
            .enter()
            .append('line')
            .filter(i => (moment().diff(moment(i.date_sta).startOf('day'),"days")) < thiz.props.days_to_display)
            .filter(i => i.end)
                .attr("x1", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.start).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
                .attr("x2", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.end  ).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
                .attr("y1", i => { return thiz.props.margin + ((moment(i.start).hour()+moment(i.start).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
                .attr("y2", i => { return thiz.props.margin + ((moment(i.end  ).hour()+moment(i.end  ).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
                .style("stroke", i => sub_data.color)
                .style("stroke-width", this.props.widthline)
                .attr("tooltip", i => i.tooltip)
                .on("mouseover", function(e) {
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
                        .style("top" , d => {return y + "px"})
                    }
                })
                .on("mouseout", function(_d) {
                    thiz.tooltip
                    // .transition()
                    // .duration(70)
                    .style("opacity", 0)
                    .style("display", "none");
                });
        });

    }

    componentDidMount()
    {
    	this.draw();

        // ipcRenderer.on('asynchronous-message', function (evt, message) {
        //     console.log(message); // Returns: {'SAVED': 'File Saved'}
        // });

        // window.ipcRenderer.on('ping', (event, message) => { 
        //     console.log(message) 
        // });
    }

    componentDidUpdate()
    {
        this.draw();
    }
}













