import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import './App.scss';

export default class Button_close extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render()
    {
        return <div className='icon_circular_background' onClick={() => this.props.onClick()} >
            <i data-eva="close-outline" data-eva-fill="#FFF" />
        </div>
    }
}