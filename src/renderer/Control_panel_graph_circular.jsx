
import React, { Component } from 'react';
// import * as eva from 'eva-icons';
import moment from 'moment';

export default class Control_panel_graph_circular extends Component
{
    componentDidMount()
    {
        // eva.replace();
    }

    render()
    {
        return <div style={{
            position      : "absolute",
            bottom        : getComputedStyle(document.documentElement).getPropertyValue('--spacing-borders').trim(),
            width         : "500px",
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

        {/* << */}
        <span onClick = {() => {}} className="brighten" style={{opacity:0.0}}>
            {/* <i
            data-eva      = "arrowhead-left-outline"
            width         = "28px"
            height        = "28px"
            data-eva-fill = "#FFF"
            /> */}

            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M11 7l-5 5l5 5"></path>
            <path d="M17 7l-5 5l5 5"></path>
            </svg>
        </span>

        {/* <- */}
        <span onClick = {() => this.props.day_offset_down()} className="brighten">
            {/* <i
            data-eva      = "arrow-back-outline"
            width         = "28px"
            height        = "28px"
            data-eva-fill = "#FFF"
            /> */}

            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15 6l-6 6l6 6"></path>
            </svg>
        </span>

        {/* 0 */}
        <div
        className = 'noselect'
        style     = {{
            textAlign : "center",
            minWidth  : "60px",
            fontSize  : "26px",
            color     : "#FFF",
            opacity   : 0.3,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}>
            {this.props.day_offset}
        </div>

        {/* -> */}
        <span onClick = {() => this.props.day_offset_up()} className="brighten">
            {/* <i
            data-eva      = "arrow-forward-outline"
            width         = "28px"
            height        = "28px"
            data-eva-fill = "#FFF"
            /> */}

            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 6l6 6l-6 6"></path>
            </svg>
        </span>

        {/* >> */}
        <span onClick = {() => this.props.day_offset_zero()} className="brighten">
            {/* <i
            data-eva      = "arrowhead-right-outline"
            width         = "28px"
            height        = "28px"
            data-eva-fill = "#FFF"
            /> */}

            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M7 7l5 5l-5 5"></path>
            <path d="M13 7l5 5l-5 5"></path>
            </svg>
        </span>

        </div>



        <div
        className = 'noselect'
        style     = {{
            textAlign : "center",
            minWidth  : "50px",
            marginTop : "10px",
            fontSize  : "26px",
            color     : "#FFF",
            opacity   : 0.3,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}>
            {moment().subtract(- this.props.day_offset, 'days').format('dddd, MMMM Do YYYY')}
        </div>

        </div>
    }
}