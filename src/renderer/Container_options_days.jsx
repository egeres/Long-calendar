
import React, { PureComponent, Component } from 'react';
import * as eva from 'eva-icons';

export default class Container_options extends Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        eva.replace({
            height: 28,
            width : 28,
        });
    }

    render()
    {
        const get_display = () => {
            if (this.props.visible)
            {return "block"}
            else
            {return "none"}
        }

        return <div className='container_options'>
            {/* <input type="radio" value={70} name="days"                /><label>L</label>
            <input type="radio" value={40} name="days" defaultChecked /><label>M</label>
            <input type="radio" value={10} name="days"                /><label>S</label><br/> */}

        <table>
        <tbody>
        <tr>
        <td>100 D</td>
        <td>40 D</td>
        <td>10 D</td>
        </tr>
        <tr onChange={this.props.set_days_to_display(event)}>
        <td><input type="radio" value={100} v_daystodisplay={100} v_width={500} v_height={500} v_widthline={5 }                name="days"/></td>
        <td><input type="radio" value={40 } v_daystodisplay={40 } v_width={500} v_height={500} v_widthline={10} defaultChecked name="days"/></td>
        <td><input type="radio" value={10 } v_daystodisplay={10 } v_width={500} v_height={500} v_widthline={20}                name="days"/></td>
        </tr>
        </tbody>
        </table>
        </div>
    }
}