
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
        // return <div id="tooltip" style={{opacity:1.0, display:"none"}}>
        return <div id="tooltip" style={{opacity:1.0}}>
        {/* return <div id="tooltip"> */}
            {/* {this.props.content} */}
            -
        </div>
    }
}