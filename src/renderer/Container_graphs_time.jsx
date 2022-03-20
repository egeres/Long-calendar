
import React, { Component } from 'react';
import Graph_time from './Graph_time';
import moment from 'moment';

export default class Container_graphs_time extends Component
{
    render()
    {
        return <div>
            {/* {this.props.categories.map(x => {return (
            <b>x.title</b>
            )})} */}

            <Graph_time
            data = {[
                {
                    "start": moment("2022-03-19 12:00:00"),
                    "end"  : moment("2022-03-19 23:59:00"),
                }
            ]}
            />
        </div>
    }
}