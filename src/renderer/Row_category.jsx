
import React, { PureComponent, Component } from 'react';
import * as eva from 'eva-icons';
import ReactTooltip from 'react-tooltip';


import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <i data-eva="more-vertical-outline" data-eva-fill="#FFF"/>);

export default class Row_category extends Component
{
    constructor(props)
    {
        super(props);
        this.handle_onmouseenter = this.handle_onmouseenter.bind(this)
    }

    handle_onmouseenter()
    {
        // console.log("......", this.props.last_visibility_state, this.props.id)

        if(this.props.mouse_is_held_down && !this.props.ctrl_is_held_down)
        {
            this.props.set_visibility_by_id(this.props.id, this.props.last_visibility_state)
        }
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

        return <div className='button_category noselect nodrag'>

            <i data-eva="more-vertical-outline" data-eva-fill="#FFF"/>
            {/* <DragHandle/> */}

            {/* <span onClick={() => this.props.on_click_eye(this.props.id)}> */}
            {/* <span onClick={() => this.props.on_click_eye(this.props.id)} onMouseDown={() => {console.log("...")}}> */}
            {/* <span onMouseDown={() => this.props.on_click_eye(this.props.id)}> */}

            {/* mouse_is_held_down */}

            {/* <span onMouseDown={() => this.props.on_click_eye(this.props.id)} onMouseEnter={() => console.log("...")}> */}


            {/* <span onMouseDown={() => this.props.on_click_eye(this.props.id)} onMouseEnter={() => {if(this.props.mouse_is_held_down){console.log("...")}}}> */}

            {/* <span onMouseDown={() => this.props.on_click_eye(this.props.id)} onMouseEnter={() => {this.handle_onmouseenter()}}></span> */}

            <span onMouseDown={() => this.props.toggle_visibility_by_id(this.props.id)} onMouseEnter={() => this.handle_onmouseenter()}>

                <div className={this.props.visible ? 'empty':'hidden'}>
                    <i data-eva="eye-outline" data-eva-fill="#FFF"/>
                </div>
                <div className={this.props.visible ? 'hidden':'empty'}>
                    <i data-eva="eye-off-outline" data-eva-fill="#FFF"/>
                </div>
            </span>

            <div className='spacer_10'/>

            <div
            className = 'button_color_picker'
            style     = {{backgroundColor:this.props.color}}
            onClick   = {(event) => this.props.on_click_color(event, this.props.id)}
            />

            {this.props.title}

            <div className={this.props.error ? 'hidden':'to_the_right'} data-tip={this.props.error_description}>
                <i data-eva="alert-circle-outline" data-eva-fill="#F00"/>
            </div>
            
        </div>
    }
}