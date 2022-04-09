
import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import e from 'express';

import {
    sortableContainer,
    sortableElement  ,
    sortableHandle   ,
} from 'react-sortable-hoc';

const DragHandle     = sortableHandle(() => <span>::</span>);

const SortableItem   = sortableElement(({value}) => <li>{value}</li>);

const SortableItem_2 = sortableElement(({x}) => 
    <div key={`item-${x.id}`}>
        <DragHandle />
        <Row_category
        id                = {x.id}
        key               = {`item-${x.id}`}
        title             = {x.title}
        color             = {x.color}
        visible           = {x.visible}
        error             = {x.status === "success"}
        error_description = {x.error_description}
        on_click_eye      = {x.toggle_visibility_by_id}
        on_click_color    = {x.set_color_by_id}
        />
    </div>

);

const SortableItem_3 = sortableElement(({x}) => <li>{x.id}</li>);

const SortableContainer = sortableContainer(({children}) => {
    // return <ul>{children}</ul>;
    return <div style={{display:"flex", flexDirection:"column"}}>{children}</div>;
});


export default class Container_categories extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render_static()
    {
        return <div style={{display:"flex", flexDirection:"column"}}>
            {this.props.categories.map(x => {return (
            <Row_category
                id                = {x.id}
                key               = {x.id}
                title             = {x.title}
                color             = {x.color}
                visible           = {x.visible}
                error             = {x.status === "success"}
                error_description = {x.error_description}
                on_click_eye      = {this.props.toggle_visibility_by_id}
                on_click_color    = {this.props.set_color_by_id}
            />
            )})}
            
            <div className='spacer_10'/>
            <span style={{margin:"0 auto"}}>
                <i data-eva="plus-circle-outline" data-eva-fill="#AAA"/>
            </span>
        </div>
    }
      
    render()
    {
        console.log("SortableItem_2", this.props.categories)

        // return <SortableContainer onSortEnd={this.onSortEnd}>
        return <SortableContainer onSortEnd={this.props.onSortEnd} useDragHandle>
        
        {
            // [
            //     // 0,
            //     // 1,
            //     // 2,
            //     // 3,
            //     {
            //         id                     : 0,
            //         title                  : "a",
            //         toggle_visibility_by_id: this.props.toggle_visibility_by_id,
            //         set_color_by_id        : this.props.set_color_by_id,
            //     },
            //     {
            //         id                     : 1,
            //         title                  : "b",
            //         toggle_visibility_by_id: this.props.toggle_visibility_by_id,
            //         set_color_by_id        : this.props.set_color_by_id,
            //     }
            // ]
            this.props.categories
            .map(x => (
            <SortableItem_2 key={`item-${x.id}`} index={x.id} x={x} />
            ))
        }

        {/* {[0, 1, 2, 3].map(x => (
          <li key={`item-${x}`}>{x}</li>
        ))} */}

        </SortableContainer>
    }
}