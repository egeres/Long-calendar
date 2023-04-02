import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Greasepencil extends Component {
    static defaultProps = {
        width: 500,
        height: 500,
    };

    constructor(props) {
        super(props);
        this.state = {
            drawing    : false,
            can_draw   : false,
            strokeStyle: "#4C4",
            lineWidth  : 5,
        };
    }

    render() {
        return (
            <canvas
                width={this.props?.width}
                height={this.props?.height}
                ref="root"
                style={{
                    position     : 'absolute',
                    pointerEvents: this.state.can_draw ? 'auto': 'none',
                }}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
            />
        );
    }

    handleMouseDown = (event) => {

        if (!this.state.can_draw) {return;}

        let rect = this.canvas.getBoundingClientRect();

        this.setState({ drawing: true });
        this.startDrawing(
            event.clientX - rect.left,
            event.clientY - rect.top,
        );
        this.draw(
            event.clientX - rect.left,
            event.clientY - rect.top,
        );
    };

    handleMouseMove = (event) => {
        if (this.state.drawing && this.state.can_draw) {

            const canvas = this.refs.root;
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            this.draw(
                event.clientX - rect.left,
                event.clientY - rect.top
            );
        }
    };

    handleMouseUp = () => {
        this.setState({ drawing: false });
    };

    handleTouchStart = (event) => {

        if (!this.state.can_drawing) {return;}

        event.preventDefault();
        this.setState({ drawing: true });

        const canvas = this.refs.root;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        this.startDrawing(
            event.touches[0].clientX - rect.left,
            event.touches[0].clientY - rect.top,
        );
        this.draw(
            event.touches[0].clientX - rect.left,
            event.touches[0].clientY - rect.top,
        );
    };

    handleTouchMove = (event) => {
        event.preventDefault();
        if (this.state.drawing && this.state.can_draw) {
            let rect = this.canvas.getBoundingClientRect();
            this.draw(
                event.touches[0].clientX - rect.left,
                event.touches[0].clientY - rect.top,
            );
        }
    };

    handleTouchEnd = () => {
        this.setState({ drawing: false });
    };

    startDrawing = (x, y) => {
        let ctx = this.refs.root.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    draw = (x, y) => {
        let ctx = this.refs.root.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    componentDidMount() {
        let ctx = this.refs.root.getContext('2d');
        ctx.strokeStyle = this.state.strokeStyle;
        ctx.lineWidth   = this.state.lineWidth;
        ctx.lineJoin    = 'round';
        ctx.lineCap     = 'round';

        this.refs.root.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.refs.root.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.refs.root.addEventListener('touchend', this.handleTouchEnd, { passive: false });

        this.canvas = this.refs.root;
    }
}
