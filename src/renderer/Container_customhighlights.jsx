
import React, { Component } from 'react';
import './App.scss';
// import * as eva from 'eva-icons';

export default class Container_customhighlights extends Component
{
    componentDidMount()
    {
        // eva.replace();
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

            {/* <span style={{margin:"0 auto"}}>
                <i data-eva="plus-circle-outline" data-eva-fill="#AAA"/>
            </span> */}

            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M9 12l6 0"></path>
            <path d="M12 9l0 6"></path>
            </svg>
        </div>
    }

}