
import React, { Component } from 'react';
import * as eva from 'eva-icons';

export default class Control_panel_graph_circular extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render()
    {
        return <div
        // onClick={() => console.log("....")}
        style={{
            width          : "100px",
            height         : "100px",
            // backgroundColor: "red",
            marginLeft     : "auto",
            marginRight    : "auto",

            display       : "flex",
            alignItems    : "center",
            justifyContent: "center",
        }}>
            <span onClick = {() => this.props.day_offset_down()}>
                <i
                data-eva      = "arrow-back-outline"
                width         = "28px"
                height        = "28px"
                data-eva-fill = "#FFF"
                opacity       = "0.2"
                />
            </span>

            <div
            className = 'noselect'
            style     = {{
                // backgroundColor: "red",
                textAlign : "center",
                minWidth  : "50px",
                fontSize  : "26px",
                color     : "#FFF",
                opacity   : 0.2,
                // fontWeight: "100",
            }}>
                {this.props.day_offset}
            </div>

            <span onClick = {() => this.props.day_offset_up()}>
                <i
                data-eva      = "arrow-forward-outline"
                width         = "28px"
                height        = "28px"
                data-eva-fill = "#FFF"
                opacity       = "0.2"
                />
            </span>
        </div>
    }
}