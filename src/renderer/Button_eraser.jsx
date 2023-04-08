import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import './App.scss';

export default class Button_eraser extends Component
{
    componentDidMount()
    {
        // eva.replace();
    }

    render()
    {
        return <div id="button_eraser" onClick={() => this.props.onClick()} className={this.props.active ? "button_active" : ""}>
            {/* <i data-eva="edit-outline" data-eva-fill="#FFF" /> */}

            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eraser" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3"></path>
                <path d="M18 13.3l-6.3 -6.3"></path>
            </svg>
        </div>
    }
}