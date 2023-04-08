
import { Component } from 'react';
import Graph_singleday from "./Graph_singleday";
import Clock_circular  from './Clock_circular';
import Control_panel_graph_circular from './Control_panel_graph_circular';
import Background_circular_clock from './Background_circular_clock';
import Greasepencil from './Greasepencil';

type MyProps = { 
    categories  : object[],
    width       : number,
    height      : number,
    drawing_mode: boolean,
    erasing_mode: boolean,
};

type MyState = {
    day_offset  : number,
    display_text: string,
};

export default class Container_graphs_circular extends Component<MyProps, MyState>
{
    constructor(props:MyProps)
    {
        super(props)

        this.state = {
            day_offset  : 0,
            display_text: "",
        }

        this.day_offset_up    = this.day_offset_up  .bind(this)
        this.day_offset_down  = this.day_offset_down.bind(this)
        this.day_offset_zero  = this.day_offset_zero.bind(this)
    }

    componentDidMount()
    {
        window.addEventListener('keydown', (event) => {
            if (event.key=== "ArrowLeft") {
                this.day_offset_down()
            }
            if (event.key=== "ArrowRight") {
                this.day_offset_up()
            }
        });
    }

    day_offset_up()   {if (this.state.day_offset < 0) {this.setState({day_offset:this.state.day_offset + 1})}}
    day_offset_down() {this.setState({day_offset:this.state.day_offset - 1})}
    day_offset_zero() {this.setState({day_offset:0})}

    render() {

    let today = new Date();
    today.setDate(today.getDate() + this.state.day_offset);
    let dd        = String(today.getDate()).padStart(2, '0');
    let mm        = String(today.getMonth() + 1).padStart(2, '0');  //January is 0!
    let yyyy      = today.getFullYear();
    let final_day = yyyy + '-' + mm + '-' + dd + ".png";

    return <div className='centered'>

        {/* The background with lines */}
        <Background_circular_clock
            height = {this.props.height}
            width  = {this.props.width}
        />

        {/* The hour hand of the clock */}
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
        />

        <Greasepencil
            height      = {this.props.height}
            width       = {this.props.width  + 500}
            drawing     = {this.props.drawing_mode}
            erasing     = {this.props.erasing_mode}
            day_to_load = {final_day}
        />

        {/* Overlay to display the information about a segment */}
        <div id='circular_clock_text' className='noselect' style={{position:"absolute", fontSize:"26px", pointerEvents:"none",}}></div>

        {/* The control panel located at the bottom */}
        <Control_panel_graph_circular
            day_offset      = {this.state.day_offset}
            day_offset_up   = {this.day_offset_up   }
            day_offset_down = {this.day_offset_down }
            day_offset_zero = {this.day_offset_zero }
        />

    </div>
    }
}