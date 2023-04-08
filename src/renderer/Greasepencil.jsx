import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Greasepencil extends Component {

    static defaultProps = {
        width      : 500,
        height     : 500,
        drawing    : false,
        erasing    : false,
        day_to_load: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            drawing            : false,
            can_draw           : false,
            strokeStyle        : "#4C4",
            lineWidth          : 5,
            did_i_edit_an_image: false,
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
                    pointerEvents: this.props.drawing ? 'auto': 'none',
                }}
                onMouseDown = {this.handleMouseDown}
                onMouseMove = {this.handleMouseMove}
                onMouseUp   = {this.handleMouseUp}
            />
        );
    }

    handleMouseDown = (event) => {

        if (!this.props.drawing) {return;}
        this.setState({did_i_edit_an_image: true});

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
        if (this.state.drawing && this.props.drawing) {

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

        if (!this.props.drawing) {return;}
        this.setState({did_i_edit_an_image: true});

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
        if (this.state.drawing && this.props.drawing) {
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

    componentDidMount() 
    {
        let ctx = this.refs.root.getContext('2d');
        ctx.strokeStyle = this.state.strokeStyle;
        ctx.lineWidth   = this.state.lineWidth;
        ctx.lineJoin    = 'round';
        ctx.lineCap     = 'round';

        this.refs.root.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.refs.root.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.refs.root.addEventListener('touchend', this.handleTouchEnd, { passive: false });

        this.canvas = this.refs.root;

        let o = window.electron.ipcRenderer.load_image({"filename":this.props.day_to_load});
        if (o?.image)
        {
            let base_64_img = o.image;
            let img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            }
            img.src = "data:image/png;base64," + base_64_img;
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.day_to_load !== prevProps.day_to_load)
        {
            this.setState({did_i_edit_an_image: false});

            let canvas  = this.refs.root;
            let ctx     = canvas.getContext('2d');
            let dataURL = canvas.toDataURL('image/png');
            let img     = new Image();

            if (this.state.did_i_edit_an_image)
            {
            const imageLoadPromise = new Promise((resolve) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    let dataURL = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
                    window.electron.ipcRenderer.save_image({ "image": dataURL, "filename": prevProps.day_to_load });
                    resolve();
                };
            });
            img.src = dataURL;
            await imageLoadPromise;
            }
            
            await ctx.clearRect(0, 0, canvas.width, canvas.height);

            let o = await window.electron.ipcRenderer.load_image({"filename":this.props.day_to_load});
            if (o?.image)
            {
                let base_64_img = o.image;
                let img = new Image();
                img.onload = async () => {
                    await ctx.drawImage(img, 0, 0);
                }
                img.src = "data:image/png;base64," + base_64_img;
            }
        }

        if (this.props.day_to_load && prevProps.drawing && this.props.drawing !== prevProps.drawing) {

            console.log('this.props.drawing', this.props.drawing);
            
            // Save this.canvas as a PNG
            let canvas  = this.refs.root;
            let ctx     = canvas.getContext('2d');
            let dataURL = canvas.toDataURL('image/png');
            let img     = new Image();

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
                window.electron.ipcRenderer.save_image({"image":dataURL, "filename":this.props.day_to_load});
            }

            img.src = dataURL;

        }
    }

}
