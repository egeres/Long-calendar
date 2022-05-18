
import React, { Component } from 'react';
import moment from 'moment';

export default class Clock_vertical extends Component
{
    static defaultProps = {
    };

    constructor(props)
    {
        super(props);

        this.state = {
            position_y_tip: (moment().hour() + moment().minutes() / 60.0) / 24.0,
        };
    }

    render()
    {
        return (
        <div style={{
            position       : "absolute",
            right          : 0,
            top            : Math.ceil(this.props.margin + (this.props.height  - this.props.margin * 2) * this.state.position_y_tip),
            backgroundColor: "#fff",
            opacity        : 0.3,
            height         : "1.5px",
            width          : this.props.margin,
        }}/>
        );
    }

    componentDidMount()
    {
        setInterval(async () => {
            this.setState({
                position_y_tip: (moment().hour() + moment().minutes() / 60.0) / 24.0,
            })
        }, 1000)
    }

}


