
import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';

export default class Container_categories extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render()
    {
        return <div style={{display:"flex", flexDirection:"column"}}>
            {this.props.categories.map(x => {return (
            <Row_category
                id             = {x.id}
                title          = {x.title}
                color          = {x.color}
                visible        = {x.visible}
                on_click_eye   = {this.props.toggle_visibility_by_id}
                on_click_color = {this.props.set_color_by_id}
            />
            )})}
            
            <div className='spacer_10'/>
            <span style={{margin:"0 auto"}}>
                <i data-eva="plus-circle-outline" data-eva-fill="#AAA"/>
            </span>
        </div>
    }
}