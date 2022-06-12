import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import './App.scss';
import Toggle from 'react-toggle'
import "react-toggle/style.css" // for ES6 modules
import Button_close from './Button_close';

export default class Menu_main extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            fullscreen                : true,
            reload_interval           : 2000,
            shortcut                  : "Alt+E",
            recalculate_data_command  : "python data_generator.py",
            recalculate_data_on_launch: true,
        }

        this.wrapperRef              = React.createRef();
        this.handleClickOutside      = this.handleClickOutside.bind(this);
        this.set_property_fullscreen = this.set_property_fullscreen.bind(this);
    }
    
    set_property_fullscreen(e)
    {
        this.setState({
            fullscreen : e.target.checked,
        })

        window.electron.ipcRenderer.set_config_prop({
            ["window.visible"] : e.target.checked,
        })
    }

    async componentDidMount()
    {
        let collected_props = window.electron.ipcRenderer.get_config_prop([
            "window.fullscreen",
            "window.reload_interval",
            "window.shortcut",
        ])
        
        console.log(collected_props)

        await this.setState({
            fullscreen     : collected_props["window.fullscreen"     ] ?? true,
            reload_interval: collected_props["window.reload_interval"] ?? 2000,
            shortcut       : collected_props["window.shortcut"       ] ?? "alt+e",
        })

        eva.replace({
            height: 28,
            width : 28,
        });
    }

    handleClickOutside(event)
    {
        this.props.hide_menu_main()

        window.electron.ipcRenderer.set_config_prop({
            ["window.fullscreen"]                : this.state.fullscreen == true,
            ["window.reload_interval"]           : parseInt(this.state.reload_interval),
            ["window.shortcut"]                  : this.state.shortcut,
            ["window.recalculate_data_on_launch"]: this.state.recalculate_data_on_launch == true,
            ["window.recalculate_data_command"]  : this.state.recalculate_data_command,
        })
    }

    render()
    {
        // return {this.props.menu_main_visible && <div class="container_menu_main">  
        // </div>}

        if (this.props.menu_main_visible) {
            return <div
            className = 'container_menu_main nodrag noselect'
            ref       = {this.wrapperRef}
            >

                <span className='corner_top_right'>
                    <Button_close onClick={(e) => {this.handleClickOutside(e)}}/>
                </span>

                <div style={{width:"50%", height:"100%", float:"left"}}>

                    <p>Fullscreen</p>
                    <input
                        type     = "checkbox"
                        onChange = {(e) => {this.setState({fullscreen:e.target.checked})}}
                        checked  = {this.state.fullscreen}
                    />

                    <br/><br/>

                    <p>Shortcut</p>
                    <input
                    type       = "text"
                    value      = {this.state.shortcut}
                    spellCheck = "false"
                    onChange   = {(e) => {this.setState({shortcut:e.target.value})}}
                    />


                    <table>
                        {/* <tr>
                            <td style={{textAlign:"right"}}>
                                <Toggle
                                checked ={this.state.fullscreen}
                                onChange={this.set_property_fullscreen}
                                />
                            </td>
                            <td style={{textAlign:"left" }}>
                                Fullscreen
                            </td>
                        </tr> */}
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

                    <p>Reload interval (ms)</p>
                    <input 
                    type       = "text"
                    value      = {this.state.reload_interval}
                    spellCheck = "false"
                    onChange   = {(e) => {this.setState({reload_interval:e.target.value})}}
                    />

                    <br/><br/>

                    <p>Data recalculate command</p>
                    <input 
                    type       = "text"
                    value      = {this.state.recalculate_data_command}
                    spellCheck = "false"
                    onChange   = {(e) => {this.setState({recalculate_data_command:e.target.value})}}
                    />

                    <br/><br/>

                    <p>Recalculate data on launch</p>
                    <input
                        type     = "checkbox"
                        onChange = {(e) => {this.setState({recalculate_data_on_launch:e.target.checked})}}
                        checked  = {this.state.recalculate_data_on_launch}
                    />

                </div>
            </div>
        }

        return null
    }
}