
import React, { PureComponent, Component } from 'react';
import moment  from 'moment';
import * as d3 from 'd3';

import Button_category from './Button_category';

export default class List_categories extends Component
{
    static defaultProps = {
    };

    constructor(props)
    {
        super(props);
        this.state = { categories: [] };
    }

    // async get_divs_to_render()
    // {
    //     let await fetch("http://localhost:7462/reload").then(res => res.json())
    // }

    async componentDidMount()
    {
        let out = await fetch("http://localhost:17462/sources_in_data_folder");
        // console.log(out)
        out = await out.json()
        // console.log(out)
        await this.setState({
            categories:out.names,
        })

        console.log(this.state)
    }

    render()
    {
        return <div>
            {this.state.categories.map(x => {return (<Button_category title={x}/>)})}
        </div>
    }
}