import React, { Component } from 'react';
import Row_category from './Row_category';
// import * as eva from 'eva-icons';
import './App.scss';

export default class Button_reload_data extends Component
{
    componentDidMount()
    {
        // eva.replace();
    }

    render()
    {
        return <div id="button_refresh" onClick={() => this.props.onClick()} >
            {/* <i data-eva="refresh-outline" data-eva-fill="#FFF" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-reload" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"></path>
            <path d="M20 4v5h-5"></path>
            </svg>
        </div>
    }
}