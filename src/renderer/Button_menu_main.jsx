import React, { Component } from 'react';
import Row_category from './Row_category';
import * as eva from 'eva-icons';
import './App_b.scss';

export default class Button_menu_main extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render()
    {
        return <div class="button_menu" onClick={() => this.props.show_menu_main()} >
            <i data-eva="menu-outline" data-eva-fill="#FFF" />
        </div>
    }
}