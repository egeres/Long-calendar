
import moment from 'moment';
import React, { Component } from 'react';
import Graph_background from './Graph_background';
import Graph_multiple from './Graph_multiple';
import Graph_time from './Graph_time';
import Clock_vertical from './Clock_vertical';

export default class Container_graphs_time extends Component
{

    static defaultProps = {
        graph_timebars_margin      : 15,
        graph_timebars_margin_inner: 40,
        total_graph_width          : null,
        total_graph_height         : null,
    };

    render()
    {

        let style_left  = this.props.graph_timebars_margin;
        let style_right = this.props.graph_timebars_margin;

        if (this.props.total_graph_width !== null)
        {
            style_left = (this.props.total_graph_width - this.props.width) / 2;
        }
        if (this.props.total_graph_height !== null)
        {
            style_right = (this.props.total_graph_height - this.props.height) / 2;
        }

        return <div style={{
            position: "absolute",
            width   : this.props.width  + "px",
            height  : this.props.height + "px",
            left    : style_left,
            top     : style_right,
        }}>

            <Graph_background
            width           = {this.props.width }
            height          = {this.props.height}
            days_to_display = {this.props.days_to_display}
            margin          = {this.props.graph_timebars_margin_inner}
            />

            <div id="tooltip_linehighlight" style={{
                top            : this.props.graph_timebars_margin_inner + "px",
                display        : "none",
                backgroundColor: "#FFF",
                width          : "0.2px",
                height         : (this.props.height - (this.props.graph_timebars_margin * 0) - (this.props.graph_timebars_margin_inner * 2)) + "px",
                position       : "absolute",
            }}/>

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
            width           = {this.props.width                      }
            height          = {this.props.height                     }
            data            = {this.props.categories                 }
            days_to_display = {this.props.days_to_display            }
            widthline       = {this.props.widthline                  }
            margin          = {this.props.graph_timebars_margin_inner}
            />

            <Clock_vertical
            height          = {this.props.height}
            margin          = {this.props.graph_timebars_margin_inner}
            />

        </div>
    }
}