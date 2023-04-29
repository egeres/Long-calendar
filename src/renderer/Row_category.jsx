
import React, { PureComponent, Component } from 'react';
// import * as eva from 'eva-icons';
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

        
        // if(this.props.mouse_is_held_down && !this.props.ctrl_is_held_down)
        if(window.mouse_is_held_down && !window.ctrl_is_held_down)
        {
            this.props.set_visibility_by_id(this.props.id, this.props.last_visibility_state)
        }
    }

    componentDidMount()
    {
        // eva.replace({
        //     height: 28,
        //     width : 28,
        // });
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

            {/* <i data-eva="more-vertical-outline" data-eva-fill="#FFF"/> */}

            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-dots-vertical" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            </svg>

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
                    {/* <i data-eva="eye-outline" data-eva-fill="#FFF"/> */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                    </svg>
                </div>
                <div className={this.props.visible ? 'hidden':'empty'}>
                    {/* <i data-eva="eye-off-outline" data-eva-fill="#555"/> */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="#555" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
                    <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
                    <path d="M3 3l18 18"></path>
                    </svg>
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