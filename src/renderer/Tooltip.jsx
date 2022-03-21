
import React, { Component } from 'react';

export default class Tooltip extends Component
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
        return <div id="tooltip" style={{opacity:0.0, display:"none"}}>
            {/* {this.props.content} */}
            ...
        </div>
    }
}