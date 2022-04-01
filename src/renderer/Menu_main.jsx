import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import './App_b.scss';

export default class Menu_main extends Component
{
    constructor(props)
    {
      super(props);
      this.wrapperRef         = React.createRef();
      this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    
    componentDidMount()
    {
        document.addEventListener(   "mousedown", this.handleClickOutside);
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside(event)
    {
        if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target))
        {
            console.log("out")
            this.props.hide_menu_main()
        }
    }

    render()
    {
        // return {this.props.menu_main_visible && <div class="container_menu_main">  
        // </div>}

        if (this.props.menu_main_visible) {
            return <div
            className = 'container_menu_main'
            ref       = {this.wrapperRef}
            >
            
            </div>
        }

        return null
    }
}