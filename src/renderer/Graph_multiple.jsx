
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
        this.tooltip      = d3.select("#tooltip");
        this.tooltip_date = d3.select("#tooltip_date");

        // console.log(this.tooltip)

        setTimeout(() => { this.tooltip               = d3.select("#tooltip"              ); }, 100)
        setTimeout(() => { this.tooltip_date          = d3.select("#tooltip_date"         ); }, 100)
        setTimeout(() => { this.tooltip_linehighlight = d3.select("#tooltip_linehighlight"); }, 100)

        // ipcRenderer.on('asynchronous-message', function (evt, message) {
        //     console.log(message); // Returns: {'SAVED': 'File Saved'}
        // });
    }

    render()
    {
        return (
        <svg
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

        // console.log("Redrawing...", this.props.days_to_display)

        let this_groups = d3.select(thiz.refs.group_main)
        .selectAll("g")
        .data(this.props.data)
        .join(
            enter => enter
                .append("g")
                .style("visibility", d => {return d.visible ? "visible" : "hidden"}),
            update => update
                .style("visibility", d => {return d.visible ? "visible" : "hidden"}),
        )
        
        this_groups.selectAll("circle")
        .data((d, i_) => {
            return d.data.map((x, i) => {
                let to_ret     = {...x};
                to_ret.color   = x?.color   ?? d.color   ?? "#FFF";
                to_ret.size    = x?.size    ?? d.size    ?? 4.5   ;
                to_ret.opacity = x?.opacity ?? d.opacity ?? 1.0   ;
                return to_ret;
            })
            .filter(i => !i.end)
            .filter(i => (moment().diff(moment(i.start).startOf('day'),"days")) <  thiz.props.days_to_display)
            .filter(i => (moment().diff(moment(i.start).startOf('day'),"days")) >= 0)
        })
        .join(
        enter  => enter
            .append("circle")
            .attr("cx", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.start).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
            .attr("cy", i => { return thiz.props.margin + ((moment(i.start).hour()+moment(i.start).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
            .style("r"      , d => d.size   )
            .style("fill"   , d => d.color  )
            .style("opacity", d => d.opacity),
            update => update
            .attr("cx", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.start).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
            .attr("cy", i => { return thiz.props.margin + (      (moment(i.start).hour()+moment(i.start).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
            .style("r"      , d => d.size   )
            .style("fill"   , d => d.color  )
            .style("opacity", d => d.opacity),
        exit   => exit
            .remove(),
        )
        

        this_groups.selectAll("line")
        .data((d, i_) => {
            return d.data.map((x, i) => {
                let to_ret     = {...x};
                to_ret.color   = x?.color   ?? d.color   ?? "#FFF";
                to_ret.size    = x?.size    ?? d.size    ?? 4.5   ;
                to_ret.opacity = x?.opacity ?? d.opacity ?? 1.0   ;
                to_ret.index   = i_;
                return to_ret;
            })
            .filter(i => i.end)
            .filter(i => (moment().diff(moment(i.start).startOf('day'),"days")) < thiz.props.days_to_display)
            .filter(i => (moment().diff(moment(i.start).startOf('day'),"days")) >= 0)
        })
        .join(
        enter  => enter
            .append('line')
            .attr("x1", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.start).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
            .attr("x2", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.end  ).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
            .attr("y1", i => { return thiz.props.margin + ((moment(i.start).hour()+moment(i.start).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
            .attr("y2", i => { return thiz.props.margin + ((moment(i.end  ).hour()+moment(i.end  ).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
            .style("stroke-width", this.props.widthline) // Should we have something like .style("stroke-width", x => (x.size ?? this.props.widthline))
            // .style("stroke" , d => (d?.color   ?? sub_data.color   ?? "#FFF"))
            // .style("opacity", d => (d?.opacity ?? sub_data.opacity ?? 1.0   ))
            .style("stroke"       , d => d.color  )
            .style("opacity"      , d => d.opacity)
            .attr("index"         , d => d.index)
            .attr("tooltip"       , d => d.tooltip)
            .attr("date"          , d => moment(d.start).format('YYYY-M-D'))
            .attr("date_dayofweek", d => ["", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"][moment(d.start).isoWeekday()])
            .attr("days_ago"      , d => moment().diff(moment(d.start).startOf('day'),"days"))

            .on("mouseover", function(e) {
                if (e.target.getAttribute("tooltip"))
                {

                    // Category higlihgt
                    document.querySelectorAll(".button_category").forEach(x => {
                        x.style["color"] = "rgb(175, 175, 175)"
                    })
                    document.querySelectorAll(".button_category")[
                        e.target.getAttribute("index")
                    ].style["color"] = "rgb(240, 240, 240)";


                    let rect = e.target.getBoundingClientRect()
                    let x    = rect.x
                    let y    = rect.y + rect.height / 2

                    if (thiz.tooltip)
                    {
                    thiz.tooltip
                    .style("opacity", 1.0)
                    .style("display", "block")
                    .html ((d, i) => {return e.target.getAttribute("tooltip")})
                    .style("left", d => {return x + "px"})
                    .style("top" , d => {return y + "px"});
                    }

                    if (thiz.tooltip)
                    {
                    thiz.tooltip_date
                    .html ((d, i) => {return e.target.getAttribute("date")+" ("+e.target.getAttribute("days_ago")+" days ago)" + " ("+e.target.getAttribute("date_dayofweek")+")"})                         
                    .style("opacity", 1.0)
                    .style("display", "block")
                    .style("left", d => {return x + "px"})
                    .style("top" , d => {return "10px"});
                    }
                    
                    let left_index      = thiz.props.days_to_display - e.target.getAttribute("days_ago") - 1;
                    let x_position_line = thiz.props.margin + (left_index / (thiz.props.days_to_display - 1)) * (thiz.props.width - (thiz.props.margin * 2));
                    if (thiz.tooltip_linehighlight)
                    {
                    thiz.tooltip_linehighlight
                    .style("display", "block")
                    .style("left", d => {return x_position_line + "px"})
                    }
                }
            })
            .on("mouseout", function(_d) {

                document.querySelectorAll(".button_category").forEach(x => {
                    x.style["color"] = "rgb(175, 175, 175)"
                })

                if (thiz.tooltip)
                {
                thiz.tooltip
                .style("opacity", 0.0)
                .style("display", "none");
                }

                if (thiz.tooltip_date)
                {
                thiz.tooltip_date
                .style("opacity", 0)
                .style("display", "none");
                }

                if (thiz.tooltip_linehighlight)
                {
                thiz.tooltip_linehighlight
                .style("display", "none")
                }
            }),
        update => update
            .attr("x1", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.start).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
            .attr("x2", i => { return thiz.props.margin + (1.0 - (moment().diff(moment(i.end  ).startOf('day'),"days") / (thiz.props?.days_to_display-1.0))) * (thiz.props.width - thiz.props.margin*2) })
            .attr("y1", i => { return thiz.props.margin + ((moment(i.start).hour()+moment(i.start).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
            .attr("y2", i => { return thiz.props.margin + ((moment(i.end  ).hour()+moment(i.end  ).minutes()/60.0)/24.0) * (thiz.props.height - thiz.props.margin*2) })
            .style("stroke-width", this.props.widthline) // Should we have something like .style("stroke-width", x => (x.size ?? this.props.widthline))
            .style("stroke", d => d.color)
            .style("opacity", d => d.opacity)
            .attr("index", d => d.index)
            .attr("tooltip", d => d.tooltip)
            .attr("date", d => moment(d.start).format('YYYY-M-D'))
            .attr("date_dayofweek", d => ["", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"][moment(d.start).isoWeekday()])
            .attr("days_ago", d => moment().diff(moment(d.start).startOf('day'),"days")),
            exit   => exit
            .remove(),
        )
    }

    componentDidMount()
    {
        d3
        .select(this.refs.group_main)
        .selectAll("*")
        .remove();
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

    componentDidUpdate(prevProps, prevState)
    {
        this.draw();
    }
}













