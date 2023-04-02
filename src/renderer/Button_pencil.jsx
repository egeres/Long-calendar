import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import './App.scss';

export default class Button_pencil extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render()
    {
        return <div id="button_pencil" onClick={() => this.props.refresh_data()} >
            <i data-eva="edit-outline" data-eva-fill="#FFF" />
        </div>
    }
}