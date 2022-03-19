
import React, { PureComponent, Component } from 'react';
import * as eva from 'eva-icons';

export default class Button_category extends Component
{
    static defaultProps = {
    };

    stringToColour = function(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    constructor(props)
    {
        super(props);
        this.state = {
            color  : this.stringToColour(this.props.title),
            visible: true,
        }
    }

    componentDidMount()
    {

        eva.replace();
    }

    render()
    {

        const render_icon_eye = () => {

            if (this.state.visible)
            {
                return <i data-eva="eye-outline" data-eva-fill="#FFF"/>
            }
            else
            {
                return <i data-eva="eye-off-outline" data-eva-fill="#FFF"/>
            }
        }

        return <div className='button_category noselect'>
            <i data-eva="more-vertical-outline" data-eva-fill="#FFF"/>
            {render_icon_eye()}
            <div className='spacer_10'/>
            <div className='button_color_picker' style={{backgroundColor:this.state.color}}/>
            {this.props.title}
        </div>
    }
}