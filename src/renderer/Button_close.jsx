import React, { Component } from 'react';
import Row_category from './Row_category';
// import * as eva from 'eva-icons';
import './App.scss';

export default class Button_close extends Component
{
    componentDidMount()
    {
        // eva.replace();
    }

    render()
    {
        return <div className='icon_circular_background' onClick={() => this.props.onClick()} >
            {/* <i data-eva="close-outline" data-eva-fill="#FFF" /> */}

            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M18 6l-12 12"></path>
            <path d="M6 6l12 12"></path>
            </svg>

        </div>
    }
}