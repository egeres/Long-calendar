
import React, { Component } from 'react';
import * as eva from 'eva-icons';
import moment from 'moment';

export default class Control_panel_graph_circular extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render()
    {
        return <div style={{
            position      : "absolute",
            bottom        : "10px",
            width         : "500px",
            height        : "100px",
            display       : "flex",
            alignItems    : "center",
            justifyContent: "center",
            flexDirection : "column",
        }}>


        <div style={{
            // position      : "absolute",
            // bottom        : "10px",
            // width         : "100px",
            // height        : "100px",
            display       : "flex",
            alignItems    : "center",
            justifyContent: "center",
        }}>

        <span onClick = {() => this.props.day_offset_down()} className="brighten">
            <i
            data-eva      = "arrow-back-outline"
            width         = "28px"
            height        = "28px"
            data-eva-fill = "#FFF"
            />
        </span>

        <div
        className = 'noselect'
        style     = {{
            textAlign : "center",
            minWidth  : "50px",
            fontSize  : "26px",
            color     : "#FFF",
            opacity   : 0.2,
        }}>
            {this.props.day_offset}
        </div>

        <span onClick = {() => this.props.day_offset_up()} className="brighten">
            <i
            data-eva      = "arrow-forward-outline"
            width         = "28px"
            height        = "28px"
            data-eva-fill = "#FFF"
            />
        </span>

        <span onClick = {() => this.props.day_offset_zero()} className="brighten">
            <i
            data-eva      = "arrowhead-right-outline"
            width         = "28px"
            height        = "28px"
            data-eva-fill = "#FFF"
            />
        </span>

        </div>



        <div
        className = 'noselect'
        style     = {{
            textAlign : "center",
            minWidth  : "50px",
            fontSize  : "26px",
            color     : "#FFF",
            opacity   : 0.2,
        }}>
            {moment().subtract(- this.props.day_offset, 'days').format('dddd, MMMM Do YYYY')}
        </div>

        </div>
    }
}