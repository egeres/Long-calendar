
import React, { PureComponent, Component } from 'react';
import * as eva from 'eva-icons';

export default class Container_options_display extends Component
{

    constructor(props)
    {
        super(props);
        
        this.state = {
            selected_radio:0,
        }
    }

    changeRadio = (event) => {
        let id_selected_radiobutton = parseInt(event.target.getAttribute("id_rad"))
        this.setState({selected_radio:id_selected_radiobutton})
        // this.props.set_days_to_display(event)

        window.electron.ipcRenderer.set_config_prop({
            ["window.days_to_display"] : id_selected_radiobutton,
        })
    }

    render()
    {

        return <div className='container_options noselect'>
        <table>
        <tbody>
        <tr>
            <td>Full</td>
            <td>Day</td>
        </tr>
        <tr>
            <td><input
            type            = "radio"
            value           = {120}
            v_daystodisplay = {120}
            v_width         = {1200}
            v_height        = {500}
            v_widthline     = {8 }
            checked         = {this.state.selected_radio === 0}
            onChange        = {this.changeRadio.bind(this)}
            id_rad          = {0}
            name            = "days"
            /></td>
            <td><input
            type            = "radio"
            value           = {10}
            v_daystodisplay = {10}
            v_width         = {700}
            v_height        = {500}
            v_widthline     = {20}
            checked         = {this.state.selected_radio === 1}
            onChange        = {this.changeRadio.bind(this)}
            id_rad          = {1}
            name            = "days"
            /></td>
        </tr>
        </tbody>
        </table>
        </div>
    }
}
