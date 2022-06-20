
import React, { Component } from 'react';

export default class Tooltip extends Component
{
    render()
    {
        return <div id="tooltip" style={{opacity:1.0}} className="noselect">This text will be overwritten</div>
    }
}