
import React, { PureComponent, Component } from 'react';
import moment  from 'moment';
import * as d3 from 'd3';

import Button_category from './Button_category';

export default class List_categories extends Component
{
    static defaultProps = {
    };

    constructor(props)
    {
        super(props);
    }

    // componentDidUpdate()
    // {
    //     this.render();
    // }

    render()
    {
        return <div>
            {this.props.categories.map(x => {return (
            <Button_category
                id           = {x.id}
                title        = {x.title}
                color        = {x.color}
                visible      = {x.visible}
                on_click_eye = {this.props.toggle_visibility_by_id}
                // on_click_eye = {() => {console.log("eye clicked")}}
            />
            )})}
        </div>
    }
}