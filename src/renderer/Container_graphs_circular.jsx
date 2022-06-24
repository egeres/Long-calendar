
import React, { Component } from 'react';
import Graph_singleday from "./Graph_singleday";
import Clock_vertical  from "./Clock_vertical";
import Clock_circular  from './Clock_circular';
import Container_graphs_time from './Container_graphs_time';

export default class Container_graphs_circular extends Component
{
    render()
    {
        return <div style={{
            position: "relative",
            // width   : this.props.width  + "px",
            // height  : this.props.height + "px",
            // backgroundColor:"green",
        }}>

            <Clock_circular
            height = {this.props.height}
            width  = {this.props.width }
            />

            <Graph_singleday
            categories = {this.props.categories}
            />

        </div>
    }
}