
import React, { PureComponent, Component } from 'react';
import moment  from 'moment';
import * as d3 from 'd3';

import Row_category from './Row_category';

export default class Container_categories extends Component
{
    render()
    {
        return <div>
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
        </div>
    }
}