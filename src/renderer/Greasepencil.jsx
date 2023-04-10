import React, { Component } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

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
            pendown            : false,
            can_draw           : false,
            strokeStyle        : "#4C4",
            lineWidth          : 2,
            did_i_edit_an_image: false,
        };
    }

    render() {
        return (
            <canvas
                width  = {this.props?.width }
                height = {this.props?.height}
                ref="root"
                style={{
                    position     : 'absolute',
                    pointerEvents: (this.props.drawing | this.props.erasing) ? 'auto': 'none',
                }}
                onMouseDown = {this.handleMouseDown}
                onMouseMove = {this.handleMouseMove}
                onMouseUp   = {this.handleMouseUp}
            />
        );
    }

    handleMouseDown = (event) => {

        if (!(this.props.drawing | this.props.erasing)) {return;}
        this.setState({did_i_edit_an_image: true});

        let rect = this.canvas.getBoundingClientRect();

        this.setState({ pendown: true });
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
        if (this.state.pendown && this.props.drawing) {

            const canvas = this.refs.root;
            const rect = canvas.getBoundingClientRect();
            this.draw(
                event.clientX - rect.left,
                event.clientY - rect.top
            );
        }

        if (this.state.pendown && this.props.erasing) {
            const canvas = this.refs.root;
            const rect = canvas.getBoundingClientRect();
            this.ctx.clearRect(
                event.clientX - rect.left,
                event.clientY - rect.top,
                50,
                50
            );
        }
    };

    handleMouseUp = () => {
        this.setState({ pendown: false });
    };

    handleTouchStart = (event) => {

        if (!(this.props.drawing | this.props.erasing)) {return;}
        this.setState({did_i_edit_an_image: true});

        event.preventDefault();
        this.setState({ pendown: true });

        const canvas = this.refs.root;
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
        if (this.state.pendown && this.props.drawing) {
            let rect = this.canvas.getBoundingClientRect();
            this.draw(
                event.touches[0].clientX - rect.left,
                event.touches[0].clientY - rect.top,
            );
        }

        if (this.state.pendown && this.props.erasing) {
            const canvas = this.refs.root;
            const rect   = canvas.getBoundingClientRect();
            this.ctx.clearRect(
                event.touches[0].clientX - rect.left,
                event.touches[0].clientY - rect.top,
                50,
                50
            );
        }
    };

    handleTouchEnd = () => {
        this.setState({ pendown: false });
    };

    startDrawing = (x, y) => {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    };

    draw = (x, y) => {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    };

    componentDidMount() 
    {
        this.ctx = this.refs.root.getContext('2d');
        this.ctx.strokeStyle = this.state.strokeStyle;
        this.ctx.lineWidth   = this.state.lineWidth;
        this.ctx.lineJoin    = 'round';
        this.ctx.lineCap     = 'round';

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
                this.ctx.drawImage(img, 0, 0);
            }
            img.src = "data:image/png;base64," + base_64_img;
        }

        setInterval(() => {

            // Random color
            // let the_color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`

            // Color based on time of day, 07:00 is 0 and 23:59 is 1
            const currentTime = moment();
            const startTime   = moment('07:00', 'HH:mm');
            const endTime     = moment('23:59', 'HH:mm');
            const totalMinutes   = endTime.diff(startTime, 'minutes');
            const elapsedMinutes = currentTime.diff(startTime, 'minutes');
            let the_color = d3.interpolateSpectral(elapsedMinutes / totalMinutes); // https://github.com/d3/d3-scale-chromatic
            
            // WIP, except if we are writting on a previous day, which should be "blue", or, if we write in the future "red"?

            // We set the color
            this.setState({strokeStyle:the_color});

        }, 5000);
    }

    async componentDidUpdate(prevProps, prevSetate, snapshot) {

        if (this.state.strokeStyle !== prevState.drawing)
        {
            this.ctx.strokeStyle = this.props.drawing ? this.state.strokeStyle : "white";
        }

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

        if (
            this.props.day_to_load &&
            (prevProps.drawing | prevProps.erasing) &&
            ((this.props.drawing !== prevProps.drawing) | (this.props.erasing !== prevProps.erasing))
        ) {

            console.log("Saving...")

            // Save this.canvas as a PNG
            let canvas  = this.refs.root;
            let dataURL = canvas.toDataURL('image/png');
            let img     = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
                window.electron.ipcRenderer.save_image({"image":dataURL, "filename":this.props.day_to_load});
            }
            img.src = dataURL;
        }
    }

}
