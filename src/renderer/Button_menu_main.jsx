import React, { Component } from 'react';
import Row_category from './Row_category';
// import * as eva from 'eva-icons';
import './App.scss';

export default class Button_menu_main extends Component
{
    render()
    {
        return <div id="button_menu" onClick={() => this.props.onClick()} >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 6l16 0"></path>
            <path d="M4 12l16 0"></path>
            <path d="M4 18l16 0"></path>
            </svg>
        </div>
    }
}