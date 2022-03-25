
import React, { Component } from 'react';
import Graph_background from './Graph_background';
import Graph_multiple from './Graph_multiple';
import Graph_time from './Graph_time';
import moment from 'moment';

export default class Container_graphs_time extends Component
{
    render()
    {
        return <div style={{
            position: "relative",
            width   : this.props.width ,
            height  : this.props.height,
            
        }}>

            <Graph_background
            width           = {this.props.width }
            height          = {this.props.height}
            days_to_display = {this.props.days_to_display}
            />

            {/* {this.props.categories.map(x => {return (
                <Graph_time
                key     = {x.id}
                width   = {this.props.width }
                height  = {this.props.height}
                data    = {x.data}
                color   = {x.color}
                visible = {x.visible}
                />
            )})} */}

            <Graph_multiple
            width           = {this.props.width     }
            height          = {this.props.height    }
            data            = {this.props.categories}
            days_to_display = {this.props.days_to_display}
            />

        </div>
    }
}