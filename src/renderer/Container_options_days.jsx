
import React, { PureComponent, Component } from 'react';
import * as eva from 'eva-icons';

export default class Container_options extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selected_radio:1,
        }
    }

    componentDidMount()
    {
        // console.log("mounting...")

        this.props.set_days_to_display(event)

        eva.replace({
            height: 28,
            width : 28,
        });
    }

    changeRadio = (event) => {
        let id_selected_radiobutton = parseInt(event.target.getAttribute("id_rad"))
        this.setState({selected_radio:id_selected_radiobutton})
        this.props.set_days_to_display(event)

        window.electron.ipcRenderer.set_config_prop({
            ["window.days_to_display"] : id_selected_radiobutton,
        })
    }

    render()
    {
        const get_display = () => {
            if (this.props.visible)
            {return "block"}
            else
            {return "none"}
        }

        return <div className='container_options noselect'>
            {/* <input type="radio" value={70} name="days"                /><label>L</label>
            <input type="radio" value={40} name="days" defaultChecked /><label>M</label>
            <input type="radio" value={10} name="days"                /><label>S</label><br/> */}

        <table>
        <tbody>
        <tr>
        <td>120 D</td>
        <td>40 D</td>
        <td>10 D</td>
        </tr>
        <tr>
            <td><input type="radio" value={120} v_daystodisplay={120} v_width={1200} v_height={500} v_widthline={8 } checked={this.state.selected_radio === 0} onChange={this.changeRadio.bind(this)} id_rad={0} name="days"/></td>
            <td><input type="radio" value={40 } v_daystodisplay={40 } v_width={700 } v_height={500} v_widthline={10} checked={this.state.selected_radio === 1} onChange={this.changeRadio.bind(this)} id_rad={1} name="days"/></td>
            <td><input type="radio" value={10 } v_daystodisplay={10 } v_width={700 } v_height={500} v_widthline={20} checked={this.state.selected_radio === 2} onChange={this.changeRadio.bind(this)} id_rad={2} name="days"/></td>
        </tr>
        </tbody>
        </table>
        </div>
    }
}