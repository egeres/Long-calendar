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
import Tooltip_date from './Tooltip_date';
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

    let width_line      : number = 8;
    let spacing_lines   : number = 5;
    let width_graph     : number = window.innerWidth  - 330;
    let days_to_display : number = Math.floor(width_graph / (width_line + spacing_lines));

    console.log(days_to_display)

    this.state = {
      categories      : [],
      color           : "#0F0",
      picking_color   : false,
      color_to_assign : "#000",
      id_to_assign    : null,

      // graph_width     : 700,
      // graph_height    : 700,

      graph_width     : width_graph,
      // graph_height    : Math.floor(window.innerHeight * 0.8),
      graph_height    : Math.floor(window.innerHeight - 25),

      days_to_display : days_to_display,
      widthline       : width_line ,

      menu_main_visible : false,
      
      mouse_is_held_down   : false,
       ctrl_is_held_down   : false,
      last_visibility_state: false,
    }

    this.toggle_visibility_by_id  = this.toggle_visibility_by_id .bind(this)
    this.set_visibility_by_id     = this.set_visibility_by_id    .bind(this)
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


    await fetch("http://localhost:17462/sources_in_data_folder")
    .then(async out => out.json())
    .then(async out => {

      let out_b = out.map(async (x) => {
        let o    = await (await fetch("http://localhost:17462/get_file_data?path_file=" + x.path_file)).json();
        x.status = o.status
        if (o.status === "success") { x.data              = o.data; }
        else                        { x.error_description = o.description; }
        return x
      })

      await Promise.all(out_b).then(x => this.setState({categories:x,})).catch()
    
    })
    .catch()

  }

  async componentDidMount()
  {
      await this.update_content();

      window.electron.ipcRenderer.on("poll_update", async (data) => {
        await this.update_content();
      });

      window.addEventListener('mouseup', (event) => {
        this.setState({mouse_is_held_down:false})
      });

      window.addEventListener('keydown', (event) => {
        if (event.key == "Control" && !this.state.ctrl_is_held_down) this.setState({ctrl_is_held_down:true});
      });

      window.addEventListener('keyup', (event) => {
        if (event.key == "Control") this.setState({ctrl_is_held_down:false});
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
    this.setState({
      color_to_assign : input_value,
    })
  }

  toggle_visibility_by_id(id)
  {
    let categories_now = this.state.categories
    let objIndex       = categories_now.findIndex((obj => obj.id == id));
    
    if (!this.state.ctrl_is_held_down)
    {
      // Toggles the current "eye"
      categories_now[objIndex].visible = !categories_now[objIndex].visible
    }
    else
    {
      if (categories_now.filter(x => x.visible).length == 1 && categories_now[objIndex].visible)
      {
        // Set all the "eyes" in visible mode
        categories_now.forEach(element => {element.visible = true});
      }
      else
      {
        // Sets the current "eye" to be the only one visible
        categories_now.forEach(element => {element.visible = false});
        categories_now[objIndex].visible = true
      }
    }

    this.setState({
      categories           : categories_now,
      mouse_is_held_down   : true,
      last_visibility_state: categories_now[objIndex].visible,
    });

    // this.state.ctrl_is_held_down

    let target : string = this.state.categories[objIndex].title.slice(0, -5);
    fetch(
      "http://localhost:17462/set_config_prop",
      {
        method : 'POST',
        headers: {
          'Accept'      : 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({["data."+target+".visible"] : categories_now[objIndex].visible})
      }
    )
    .then( x     => console.log)
    .catch(error => console.log);
  }

  set_visibility_by_id(id, visibility_state)
  {
    let categories_now = this.state.categories
    let objIndex       = categories_now.findIndex((obj => obj.id == id));
    categories_now[objIndex].visible = visibility_state
    this.setState({
      categories: categories_now,
    });

    let target : string = this.state.categories[objIndex].title.slice(0, -5);
    fetch(
      "http://localhost:17462/set_config_prop",
      {
        method: 'POST',
        headers: {
          'Accept'      :'application/json',
          'Content-Type':'application/json',
        },
        body: JSON.stringify({ ["data." + target + ".visible"] : visibility_state })
      }
    )
    .then( x     => console.log)
    .catch(error => console.log);

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

      let target : string = this.state.categories[objIndex].title.slice(0, -5);
      fetch(
        "http://localhost:17462/set_config_prop",
        {
          method: 'POST',
          headers: {
            'Accept'      :'application/json',
            'Content-Type':'application/json',
          },
          body: JSON.stringify({ ["data." + target + ".color"] : this.state.color_to_assign })
        }
      )
      .then( x     => console.log)
      .catch(error => console.log);

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

        {/* <Container_options_days
        set_days_to_display = {this.set_days_to_display}
        /> */}
        
        {/* <div className='spacer_10'/> */}

        <Container_categories
        categories              = {this.state.categories}
        toggle_visibility_by_id = {this.toggle_visibility_by_id}
        set_visibility_by_id    = {this.set_visibility_by_id}
        last_visibility_state   = {this.state.last_visibility_state}
        on_click_color          = {this.colorpicking_open_picker}
        onSortEnd               = {this.onSortEnd}
        mouse_is_held_down      = {this.state.mouse_is_held_down}
        ctrl_is_held_down       = {this.state.ctrl_is_held_down}
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
    <Tooltip_date/>

    <ReactTooltip
    className = 'customeTheme'
    place     = "right"
    effect    = "solid"
    />

    <Button_menu_main   show_menu_main={this.show_menu_main}/>
    <Button_reload_data refresh_data  ={this.refresh_data  }/>

    {/* <Menu_main        menu_main_visible={this.state.menu_main_visible}/> */}

    <div className='centered_panel'>
      <Menu_main
      menu_main_visible = {this.state.menu_main_visible}
      hide_menu_main    = {this.hide_menu_main}
      />
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
