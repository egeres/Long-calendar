
import React, { Component } from 'react';
import * as d3 from 'd3';


export default class Background_circular_clock extends Component
{
    static defaultProps = {
        width    : 500,
        height   : 500,
        thickness: 60,
    };

    constructor(props)
    {
        super(props);
        this.line  = null;
        this.state = {
            controlKeyPressed: false,
            element_x        : 0,
            element_y        : 0,
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
            style   = {{position:"absolute", pointerEvents:"none"}}
        >
        <g ref="group_main"></g>
        </svg>
        );
    }

    draw()
    {
        let thiz = this;

        // We remove all the children of the group
        d3.select(this.refs.group_main)
            .selectAll("*")
            .remove();

        // 4 cute lines
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

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        this.line = d3.select(this.refs.group_main)
            .append('line')
            .style('stroke', 'white')
            .style("opacity", 0.2)
            .style('stroke-width', 1)
            .attr('x1', this.props.width / 2)
            .attr('y1', this.props.height / 2)
            .attr('x2', this.props.width / 2)
            .attr('y2', this.props.height / 2)
            .style('pointer-events', 'none');

        document.addEventListener('mousemove', this.handleMouseMove);

        let my_element = d3.select(this.refs.root);
        let x = my_element.node().getBoundingClientRect().x;
        let y = my_element.node().getBoundingClientRect().y;

        this.setState({element_x: x, element_y: y});

        this.circular_clock_text = document.getElementById('circular_clock_text');
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        this.line.remove();
    }

    handleKeyDown = (e) => {
        if (e.ctrlKey) {
            this.setState({ controlKeyPressed: true });
            this.line.style('opacity', 0.2)
        }
    }
    
    handleKeyUp = (e) => {
        if (!e.ctrlKey) {
            this.setState({ controlKeyPressed: false });
            this.line.style('opacity', 0)
        }
        this.circular_clock_text.innerHTML = '';
    }
    
    handleMouseMove = (e) => {
        if (this.state.controlKeyPressed) {

            let x       = e.pageX - this.state.element_x;
            let y       = e.pageY - this.state.element_y;
            let centerX = this.props.width  / 2;
            let centerY = this.props.height / 2;

            // Calculate the angle of the line and scale it to fir 0 to 24, where 0 is 12 o'clock
            let angle_raw = Math.atan2(y - centerY, x - centerX)           

            // Given the angle, calculate x1,y1,x2,y2 to draw a line from the center of the circle to the edge of the circle, but not outside the circle
            let x1 = Math.cos(angle_raw) * (100) + centerX;
            let y1 = Math.sin(angle_raw) * (100) + centerY;
            let x2 = Math.cos(angle_raw) * (this.props.width  / 2 - 60) + centerX;
            let y2 = Math.sin(angle_raw) * (this.props.height / 2 - 60) + centerY;
            this.line.attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2);
            
            angle_raw += Math.PI;
            angle_raw = angle_raw / (2 * Math.PI);

            // Displace angle_raw to start at 0 after 90 degrees
            angle_raw = angle_raw - 0.25;
            if (angle_raw < 0) {
                angle_raw += 1;
            }

            // now that angle_raw is between 0 and 1, write this.circular_clock_text html's such that I have HH:mm format
            let hours   = Math.floor(angle_raw * 24);
            let minutes = Math.floor((angle_raw * 24 - hours) * 60);
            let hours_string   = hours   < 10 ? '0' + hours   : hours;
            let minutes_string = minutes < 10 ? '0' + minutes : minutes;
            this.circular_clock_text.innerHTML = hours_string + ':' + minutes_string;

        }
    }

}
