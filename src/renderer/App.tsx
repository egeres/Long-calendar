import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import './App.scss';
import { HexColorPicker } from "react-colorful";
import Container_categories from './Container_categories';
import Container_graphs_time from './Container_graphs_time';
import Container_colorpicker from './Container_colorpicker';
import Container_options_days from './Container_options_days';
import Container_customhighlights from './Container_customhighlights';

import Tooltip from './Tooltip';
import Button_menu_main from './Button_menu_main';
import Button_reload_data from './Button_reload_data';
import Menu_main from './Menu_main';

import ReactTooltip from 'react-tooltip';
import {arrayMoveImmutable} from 'array-move';

class Home extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      categories      : [],
      color           : "#0F0",
      picking_color   : false,
      color_to_assign : "#000",
      id_to_assign    : null,

      graph_width     : 700,
      graph_height    : 700,
      days_to_display : 40 ,
      widthline       : 10 ,

      menu_main_visible : false,
    }

    this.toggle_visibility_by_id  = this.toggle_visibility_by_id .bind(this)
    this.colorpicking_open_picker = this.colorpicking_open_picker.bind(this)
    this.set_color_by_id          = this.set_color_by_id         .bind(this)
    this.set_color_to_assign      = this.set_color_to_assign     .bind(this)
    this.set_days_to_display      = this.set_days_to_display     .bind(this)
    this.show_menu_main           = this.show_menu_main          .bind(this)
    this.hide_menu_main           = this.hide_menu_main          .bind(this)
    this.onSortEnd                = this.onSortEnd               .bind(this)
    this.refresh_data             = this.refresh_data            .bind(this)

    // this.props.show_menu_main()
  }

  show_menu_main() {
    this.setState({menu_main_visible:true,})
  }

  hide_menu_main() {
    this.setState({menu_main_visible:false,})
  }

  async update_content()
  {
    // let out = await fetch("http://localhost:17462/sources_in_data_folder");
    // out = await out.json()
    // out = out.map(async (x) => {
    //   let o    = await (await fetch("http://localhost:17462/get_file_data?path_file=" + x.path_file)).json();
    //   x.status = o.status
    //   if (o.status === "success") { x.data              = o.data; }
    //   else                        { x.error_description = o.description; }
    //   return x
    // })
    // out = await Promise.all(out)
    // // let out = await fetch("http://localhost:17462/get_file_data?file=" + "asd");
    // // console.log("out 1 =", out)
    // await this.setState({
    //     categories:out,
    // })


    fetch("http://localhost:17462/sources_in_data_folder")
    .then(out => out.json())
    .then(out => {

      out = out.map(async (x) => {
        let o    = await (await fetch("http://localhost:17462/get_file_data?path_file=" + x.path_file)).json();
        x.status = o.status
        if (o.status === "success") { x.data              = o.data; }
        else                        { x.error_description = o.description; }
        return x
      })

      Promise.all(out).then(x => this.setState({categories:x,})).catch()
    
    })
    .catch()

  }

  async componentDidMount()
  {
      await this.update_content();

      window.electron.ipcRenderer.on("poll_update", async (data) => {
        await this.update_content();
      });

      ReactTooltip.rebuild()
  }

  set_days_to_display(event)
  {
    // this.setState({timecalendar_axis_length: event.target.value});
    // console.log(event)

    if (event)
    {
      if (this.state.days_to_display != event.target.value)
      {
        // if (event.target.getAttribute("v_daystodisplay"))
        if (event.target.value)
        {

          // this.setState({days_to_display: event.target.value});
          // console.log(event.target.getAttribute("v_daystodisplay"))
          // console.log(event.target.getAttribute("v_widthline"))
          // console.log(event.target.getAttribute("v_width"))
          // console.log(event.target.getAttribute("v_height"))

          this.setState({

            // days_to_display: event.target.value,

            days_to_display: event.target.getAttribute("v_daystodisplay"),
            widthline      : event.target.getAttribute("v_widthline"),
            graph_width    : event.target.getAttribute("v_width"),
          //   // height         : event.target.getAttribute("v_height"),
          });

        }
      }
    }
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
    });

    fetch(
      "http://localhost:17462/set_config_prop?target=" + this.state.categories[objIndex].title,
      {
        method: 'POST',
        headers: {
          'Accept'      : 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visible : categories_now[objIndex].visible
        })
      }
    );
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

      fetch(
        "http://localhost:17462/set_config_prop?target=" + this.state.categories[objIndex].title,
        {
          method: 'POST',
          headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            color : this.state.color_to_assign
          })
        }
      );

    }

    this.setState({
      picking_color: false,
    })

  }

  onSortEnd = ({oldIndex, newIndex}) => {

      // console.log("a", oldIndex, newIndex)

      this.setState(({categories}) => ({
        categories: arrayMoveImmutable(categories, oldIndex, newIndex),
      }));
  };

  refresh_data()
  {
    console.log("Reloading data...")

    fetch("http://localhost:17462/reload").catch()
  }

  render()
  {
    return <div className='centered'>
    
    <Container_graphs_time
    categories      = {this.state.categories     }
    width           = {this.state.graph_width    }
    height          = {this.state.graph_height   }
    days_to_display = {this.state.days_to_display}
    widthline       = {this.state.widthline      }
    />

    <div className='spacer_10'/>

    <div className='centered_column'>

      <Container_options_days
      set_days_to_display = {this.set_days_to_display}
      />
      
      <div className='spacer_10'/>

      <Container_categories
      categories              = {this.state.categories}
      toggle_visibility_by_id = {this.toggle_visibility_by_id}
      set_color_by_id         = {this.colorpicking_open_picker}
      onSortEnd               = {this.onSortEnd}
      />

      <div className='spacer_10'/>

      {/* <Container_customhighlights/> */}

    </div>

    <Container_colorpicker
    visible             = {this.state.picking_color}
    color               = {this.state.color}
    set_color_to_assign = {this.set_color_to_assign}
    set_color_by_id     = {this.set_color_by_id}
    />

    <Tooltip/>

    <ReactTooltip
    className = 'customeTheme'
    place     = "right"
    effect    = "solid"
    />

    <Button_menu_main   show_menu_main={this.show_menu_main}/>
    <Button_reload_data refresh_data  ={this.refresh_data  }/>

    {/* <Menu_main        menu_main_visible={this.state.menu_main_visible}/> */}

    <div className='centered_panel'>
      <Menu_main menu_main_visible={this.state.menu_main_visible} hide_menu_main={this.hide_menu_main}/>
    </div>

    {/* <div> aaaa {this.state.menu_main_visible + "aa"}</div> */}

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
