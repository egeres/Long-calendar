import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import './App.scss';

export default class Button_reload_data extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render()
    {
        return <div id="button_refresh" onClick={() => this.props.onClick()} >
            <i data-eva="refresh-outline" data-eva-fill="#FFF" />
        </div>
    }
}