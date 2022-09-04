
import React, { Component } from 'react';
import Graph_singleday from "./Graph_singleday";
import Clock_vertical  from "./Clock_vertical";
import Clock_circular  from './Clock_circular';
import Container_graphs_time from './Container_graphs_time';
import Control_panel_graph_circular from './Control_panel_graph_circular';
import Background_circular_clock from './Background_circular_clock';

export default class Container_graphs_circular extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            day_offset  : 0,
            display_text: "",
        }

        this.day_offset_up    = this.day_offset_up   .bind(this)
        this.day_offset_down  = this.day_offset_down .bind(this)
        // this.set_display_text = this.set_display_text.bind(this)
    }

    componentDidMount()
    {
        window.addEventListener('keydown', (event) => {

            // console.log(event.key)
            // if (event.key == "Control" && !window.ctrl_is_held_down) window.ctrl_is_held_down = true;

            if (event.key=== "ArrowLeft") {
                this.day_offset_down()
            }

            if (event.key=== "ArrowRight") {
                this.day_offset_up()
            }

        });
    }

    day_offset_up()
    {
        // console.log(".")
        if (this.state.day_offset < 0)
        {
            this.setState({
                day_offset:this.state.day_offset + 1
            })
        }
    }

    day_offset_down()
    {
        // console.log("a")
        this.setState({
            day_offset:this.state.day_offset - 1
        })
    }

    // Triggers a redraw every time...
    // set_display_text(text: string)
    // {
    //     this.setState({
    //         display_text: text,
    //     })
    // }

    render()
    {
        // return <div style={{position: "relative",}}>
        return <div className='centered'>
            
            {/* The background with lines */}
            <Background_circular_clock
                height={this.props.height}
                width={this.props.width}
            />
            
            {/* The handle of the clock */}
            {this.state.day_offset === 0 &&
                <Clock_circular
                height = {this.props.height}
                width  = {this.props.width }
                />
            }

            {/* The graph itself */}
            <Graph_singleday
            height           = {this.props.height    }
            width            = {this.props.width     }
            categories       = {this.props.categories}
            day_offset       = {this.state.day_offset}
            // set_display_text = {this.set_display_text}
            />

            {/* Optional overlay of days */}
            {/* {this.state.display_text !== "" && */}
            <div id='circular_clock_text' style={{position:"absolute", fontSize:"26px", pointerEvents:"none",}}></div>
            {/* } */}

            {/* The control panel located at the bottom */}
            <Control_panel_graph_circular
                day_offset      = {this.state.day_offset}
                day_offset_up   = {this.day_offset_up   }
                day_offset_down = {this.day_offset_down }
            />

        </div>
    }
}