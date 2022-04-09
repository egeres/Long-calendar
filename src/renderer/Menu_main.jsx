import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import './App_b.scss';
import Toggle from 'react-toggle'
import "react-toggle/style.css" // for ES6 modules

export default class Menu_main extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            fullscreen:true,
        }

        this.wrapperRef              = React.createRef();
        this.handleClickOutside      = this.handleClickOutside.bind(this);
        this.set_property_fullscreen = this.set_property_fullscreen.bind(this);
        


    }
    
    set_property_fullscreen(e)
    {
        console.log(
            e.target.checked
        )
        
        fetch(
            "http://localhost:17462/set_single_config_prop?target=fullscreen",
            {
                method : 'POST',
                body   : JSON.stringify({content:e.target.checked}),
                headers: {
                    'Accept'      : 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    componentDidMount()
    {
        document.addEventListener(   "mousedown", this.handleClickOutside);

        let out = fetch("http://localhost:17462/get_config")
        .then(x => x.json())
        .then(x => 
            this.setState({
                fullscreen:x.fullscreen,
            })    
        )
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside(event)
    {
        if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target))
        {
            console.log("out")
            this.props.hide_menu_main()
        }
    }

    render()
    {
        // return {this.props.menu_main_visible && <div class="container_menu_main">  
        // </div>}

        if (this.props.menu_main_visible) {
            return <div
            className = 'container_menu_main'
            ref       = {this.wrapperRef}
            >
                <div style={{width:"50%", height:"100%", float:"left"}}>

                    <table>
                        <tr>
                            <td style={{textAlign:"right"}}>
                                <Toggle
                                defaultChecked={this.state.fullscreen}
                                onChange={this.set_property_fullscreen}
                                />
                            </td>
                            <td style={{textAlign:"left" }}>
                                Fullscreen
                            </td>
                        </tr>
                        {/* <tr>
                            <td style={{textAlign:"right"}}>
                                <input
                                style = {{width:"100%", padding:0}}
                                type  = "text"
                                id    = "fname"
                                name  = "fname"
                                />
                            </td>
                            <td style={{textAlign:"left" }}>
                                Width
                            </td>
                        </tr>
                        <tr>
                            <td style={{textAlign:"right"}}>
                                <input
                                style = {{width:"100%", padding:0}}
                                type  = "text"
                                id    = "fname"
                                name  = "fname"
                                />
                            </td>
                            <td style={{textAlign:"left" }}>
                                Height
                            </td>
                        </tr> */}

                    </table>

                </div>
                <div style={{width:"50%", height:"100%", float:"right"}}>
                    <p>This application is intended to be used as a quick overview of historical data, reminiscent of other tools such as cube.js, prometheus.io, netdata... but with a very minimal input of data via files.</p>
                </div>
            </div>
        }

        return null
    }
}