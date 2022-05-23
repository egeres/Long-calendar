
import React, { Component } from 'react';

export default class Tooltip_date extends Component
{
    static defaultProps = {
        content : "...",
    };

    constructor(props)
    {
        super(props);
    }
    render()
    {
        return <div id="tooltip_date" style={{opacity:1.0}}>
            AAAAAAAAAAAAAAAAAAAAAAAAAA
        </div>
    }
}