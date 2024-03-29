import React, { Component } from 'react';
import Row_category from './Row_category';
// import * as eva from 'eva-icons';
import './App.scss';

export default class Button_pencil extends Component
{
    componentDidMount()
    {
        // eva.replace();
    }

    render()
    {
        return <div id="button_pencil" onClick={() => this.props.onClick()} className={this.props.active ? "button_active" : ""}>
            {/* <i data-eva="edit-outline" data-eva-fill="#FFF" /> */}

            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-pencil" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
            <path d="M13.5 6.5l4 4"></path>
            </svg>
        </div>
    }
}