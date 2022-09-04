
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
        let id_selected_radiobutton = parseInt(event.target.getAttribute("id"))
        this.setState({selected_radio:id_selected_radiobutton})
        // this.props.set_days_to_display(event)

        this.props.set_display_mode(event)

        window.electron.ipcRenderer.set_config_prop({
            ["window.display_mode"] : id_selected_radiobutton,
        })
    }

    componentDidMount()
    {
        let collected_props = window.electron.ipcRenderer.get_config_prop([
            "window.display_mode",
        ])

        this.setState({
            selected_radio:collected_props["window.display_mode"] ?? 0
        })
    }

    render()
    {

        return <div className='container_options noselect'>
        <table>
        <tbody>
        <tr>
            <td>XL</td>
            <td>M</td>
            <td>Day</td>
        </tr>
        <tr>
            <td><input
            type     = "radio"
            name     = "days"
            checked  = {this.state.selected_radio === 2}
            onChange = {this.changeRadio.bind(this)}
            id       = {2}
            /></td>
            <td><input
            type     = "radio"
            name     = "days"
            checked  = {this.state.selected_radio === 1}
            onChange = {this.changeRadio.bind(this)}
            id       = {1}
            /></td>
            <td><input
            type     = "radio"
            name     = "days"
            checked  = {this.state.selected_radio === 0}
            onChange = {this.changeRadio.bind(this)}
            id       = {0}
            /></td>
        </tr>
        </tbody>
        </table>
        </div>
    }
}
