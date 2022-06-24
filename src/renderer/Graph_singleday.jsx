
import React, { Component } from 'react';
import moment from 'moment';
import * as d3 from 'd3';

export default class Graph_singleday extends Component
{
    static defaultProps = {
        width : 1100,
        height: 1100,
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
            // style={{position:"absolute"}}
        >
        <g ref="group_main"></g>
        </svg>
        );
    }

    draw()
    {
        console.log("Redrawing...")

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
            .innerRadius((this.props.height/2) - 100)
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

        console.log(arcData)

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
            .innerRadius((this.props.height/2) - 100)
            .outerRadius((this.props.height/2));
                
            let arc_data = [
                {
                    "startAngle": Math.PI * 0,
                    "endAngle"  : Math.PI * 1,
                    "padAngle"  : 0,
                }
            ];
            
            // arc_data = a_pieGenerator(a_data);
            
            this.g = d3
                .select(this.refs.group_main)
                .append("g")
                .attr("transform", "translate("+this.props.width/2+", "+this.props.height/2+")");
            
            this.g.selectAll('path').data(arc_data).enter()
                .append('path')
                .style("fill", function(d, i) { return "#fff"; })
                .attr('d', arc_generator);
        }

        if (true)
        {
            console.log(this.props.categories)

            let arc_generator = d3.arc()
            .innerRadius((this.props.height/2) - 100)
            .outerRadius((this.props.height/2));

            this.props.categories.forEach(element => {
                
                // console.log(element)
                if (!element.visible) { return null; }

                let sub_data = element.data
                .filter(i => i.end)
                .filter(i => (moment().diff(moment(i.start).startOf('day'),"days")) < 1)
                
                let new_data = sub_data.map(x => {
                  
                    return {
                        "startAngle": ((moment(x.start).hour()+moment(x.start).minutes()/60.0)/24.0) * Math.PI,
                          "endAngle": ((moment(x.end  ).hour()+moment(x.end  ).minutes()/60.0)/24.0) * Math.PI,
                    }
                })
                console.log(new_data)

                this.g = d3
                    .select(this.refs.group_main)
                    .append("g")
                    .attr("transform", "translate("+this.props.width/2+", "+this.props.height/2+")");
                this.g.selectAll('path').data(new_data).enter()
                    .append('path')
                    .style("fill", function(d, i) {
                        // return "#fff";
                        return element.color;
                    })
                    .attr('d', arc_generator);
            });
        }
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

