
import React, { Component } from 'react';
import './App.scss';
import * as eva from 'eva-icons';

export default class Container_customhighlights extends Component
{
    componentDidMount()
    {
        eva.replace();
    }

    render()
    {
        return <div className='container_customhightlights'>

            {/* asdasdasd as asd */}
            {/* <div className='spacer_10'/>
            <span style={{margin:"0 auto"}}>
                <i data-eva="plus-circle-outline" data-eva-fill="#AAA"/>
            </span> */}

            {/* <i data-eva="plus-circle-outline" data-eva-fill="#AAA"/> */}

            <span style={{margin:"0 auto"}}>
                <i data-eva="plus-circle-outline" data-eva-fill="#AAA"/>
            </span>
            
        </div>
    }

}