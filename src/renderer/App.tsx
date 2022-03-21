import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import './App.css';
import { HexColorPicker } from "react-colorful";
import Container_categories from './Container_categories';
import Container_graphs_time from './Container_graphs_time';
import Container_colorpicker from './Container_colorpicker';
import Tooltip from './Tooltip';

class Home extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      categories     : [],
      color          : "#0F0",
      picking_color  : false,
      color_to_assign: "#000",
      id_to_assign   : null,

      graph_width  : 700,
      graph_height : 700,
    }

    this.toggle_visibility_by_id  = this.toggle_visibility_by_id .bind(this)
    this.colorpicking_open_picker = this.colorpicking_open_picker.bind(this)
    this.set_color_by_id          = this.set_color_by_id         .bind(this)
    this.set_color_to_assign      = this.set_color_to_assign     .bind(this)
  }

  async componentDidMount()
  {
      let out = await fetch("http://localhost:17462/sources_in_data_folder");
      out = await out.json()
      // console.log("out 0 =", out)

      out = out.map(async (x) => {

        let o    = await (await fetch("http://localhost:17462/get_file_data?path_file=" + x.path_file)).json();
        x.status = o.status

        if (o.status === "success") { x.data        = o.data; }
        else                        { x.description = o.description; }

        return x
      })

      out = await Promise.all(out)

      // let out = await fetch("http://localhost:17462/get_file_data?file=" + "asd");
      // console.log("out 1 =", out)

      await this.setState({
          categories:out,
      })

      console.log(this.state)
  }

  set_color_to_assign(input_value)
  {
    // console.log(input_value)
    this.setState({
      color_to_assign : input_value,
    })
  }

  toggle_visibility_by_id(id)
  {
    let categories_now = this.state.categories
    let objIndex       = categories_now.findIndex((obj => obj.id == id));
    categories_now[objIndex].visible = !categories_now[objIndex].visible
    this.setState({
      categories:categories_now
    })
  }

  colorpicking_open_picker(event, id)
  {
    let objIndex = this.state.categories.findIndex((obj => obj.id == id));
    this.setState({
      color          : this.state.categories[objIndex].color,
      color_to_assign: this.state.categories[objIndex].color,
      picking_color  : true,
      id_to_assign   : id,
    })

    let rect = event.target.getBoundingClientRect()
    let x    = rect.x - (document.getElementById("colorpicker").getBoundingClientRect().width  / 2)
    let y    = rect.y + 20
    document.getElementById("colorpicker").style.left = x + "px"
    document.getElementById("colorpicker").style.top  = y + "px"
  }

  set_color_by_id()
  {
    if (this.state.id_to_assign !== null)
    {
      let objIndex = this.state.categories.findIndex((obj => obj.id == this.state.id_to_assign));
      let categories_new = this.state.categories
      categories_new[objIndex].color = this.state.color_to_assign;
      this.setState({
        categories:categories_new
      })
    }

    this.setState({
      picking_color: false,
    })

   }

  render()
  {
    return <div className='centered'>
    
    <Container_graphs_time
    categories = {this.state.categories  }
    width      = {this.state.graph_width }
    height     = {this.state.graph_height}
    />

    <div className='spacer_10'/>

    <Container_categories
    categories              = {this.state.categories}
    toggle_visibility_by_id = {this.toggle_visibility_by_id}
    set_color_by_id         = {this.colorpicking_open_picker}
    />

    {/* <div id="colorpicker" className={this.state.picking_color ? 'empty':'hidden'} style={{position:"absolute"}}>
      <HexColorPicker color={this.state.color}/>
    </div> */}

    <Container_colorpicker
    visible             = {this.state.picking_color}
    color               = {this.state.color}
    set_color_to_assign = {this.set_color_to_assign}
    set_color_by_id     = {this.set_color_by_id}
    />

    <Tooltip/>

    </div>
  }
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
}
