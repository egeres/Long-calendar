import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import './App.scss';
import { HexColorPicker } from "react-colorful";
import Container_categories from './Container_categories';
import Container_graphs_time from './Container_graphs_time';
import Container_colorpicker from './Container_colorpicker';
import Container_options_days from './Container_options_days';
import Container_customhighlights from './Container_customhighlights';
import Graph_singleday from './Graph_singleday';
import Container_graphs_circular from './Container_graphs_circular';
import Container_options_display from './Container_options_display';

import Tooltip from './Tooltip';
import Tooltip_date from './Tooltip_date';
import Button_menu_main from './Button_menu_main';
import Button_reload_data from './Button_reload_data';
import Menu_main from './Menu_main';

import ReactTooltip from 'react-tooltip';
import {arrayMoveImmutable} from 'array-move';

class Home extends Component
{

  static defaultProps = {
    graph_timebars_margin : 40,
  };

  constructor(props)
  {
    super(props);

    let graph_timebars_margin : number = 15;
    let width_graph           : number = window.innerWidth  - 340 - (this.props.graph_timebars_margin * 2);

    let width_line      : number = 13;
    let spacing_lines   : number = 7;
    let days_to_display : number = Math.floor((width_graph  - (40 * 2)) / (width_line + spacing_lines));
    // console.log("days_to_display:", days_to_display)

    let width_line_xl      : number = 5;
    let spacing_lines_xl   : number = 5;
    let days_to_display_xl : number = Math.floor((width_graph  - (40 * 2)) / (width_line_xl + spacing_lines_xl));
    // console.log("days_to_display_xl:", days_to_display_xl)

    window.mouse_is_held_down = false;
    window. ctrl_is_held_down = false;

    this.state = {
      categories      : [],
      color           : "#0F0",
      is_picking_color: false,
      color_to_assign : "#000",
      id_to_assign    : null,

      // graph_width     : 700,
      // graph_height    : 700,

      graph_width     : width_graph,
      // graph_height    : Math.floor(window.innerHeight * 0.8),
      graph_height    : Math.floor(window.innerHeight - this.props.graph_timebars_margin * 2),

      graph_circle_width : Math.floor(window.innerHeight * 0.8),
      graph_circle_height: Math.floor(window.innerHeight * 0.8),

      display_mode    : 0,

      days_to_display   : days_to_display,
      widthline         : width_line,
      days_to_display_xl: days_to_display_xl,
      widthline_xl      : width_line_xl,

      menu_main_visible    : false,
      last_visibility_state: false,
    }

    this.toggle_visibility_by_id  = this.toggle_visibility_by_id .bind(this)
    this.set_visibility_by_id     = this.set_visibility_by_id    .bind(this)
    this.colorpicking_open_picker = this.colorpicking_open_picker.bind(this)
    this.set_color_by_id          = this.set_color_by_id         .bind(this)
    this.set_color_to_assign      = this.set_color_to_assign     .bind(this)
    this.set_days_to_display      = this.set_days_to_display     .bind(this)
    this.set_display_mode         = this.set_display_mode        .bind(this)
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

  hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
  }

  async update_content()
  {
    let sources_in_data_folder = window.electron.ipcRenderer.sources_in_data_folder()

    let out_b = sources_in_data_folder.map(async (x) => {
      let o = window.electron.ipcRenderer.get_file_data(x.path_file)
      x.status = o.status
      if (o.status === "success") { x.data              = o.data; }
      else                        { x.error_description = o.description; }
      return x
    })
    await Promise.all(out_b).then(x => this.setState({categories:x,})).catch()
  }

  async componentDidMount()
  {

      let collected_props = window.electron.ipcRenderer.get_config_prop([
          "window.display_mode",
      ])

      console.log(collected_props);

      this.setState({
        display_mode:collected_props["window.display_mode"] ?? 0,
      })

      window.electron.ipcRenderer.on('poll_update', (arg) => {
        this.update_content();
      });

      await this.update_content();

      window.addEventListener('mouseup', (event) => {
        window.mouse_is_held_down = false;
      });

      window.addEventListener('keydown', (event) => {
        if (event.key == "Control" && !window.ctrl_is_held_down) window.ctrl_is_held_down = true;
      });

      window.addEventListener('keyup',   (event) => {
        if (event.key == "Control") window.ctrl_is_held_down = false;
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

  set_display_mode(event)
  {
    if (event)
    {
      // console.log(event.target.getAttribute("id"))

      this.setState({
        display_mode:event.target.getAttribute("id")
      })
    }
  }

  set_color_to_assign(input_value)
  {
    // this.setState({
    //   color_to_assign : input_value,
    // })
    
    window.color_to_assign = input_value;
  }

  toggle_visibility_by_id(id)
  {
    let categories_now = this.state.categories
    let objIndex       = categories_now.findIndex((obj => obj.id == id));
    
    if (!window.ctrl_is_held_down)
    {
      // Toggles the current "eye"
      categories_now[objIndex].visible = !categories_now[objIndex].visible

      let target : string = this.state.categories[objIndex].title.slice(0, -5);
      window.electron.ipcRenderer.set_config_prop({
        ["data."+target+".visible"] : categories_now[objIndex].visible
      })

    }
    else
    {
      if (categories_now.filter(x => x.visible).length == 1 && categories_now[objIndex].visible)
      {
        // Set all the "eyes" in visible mode
        categories_now.forEach(element => {element.visible = true});

        categories_now.forEach(element => {
          window.electron.ipcRenderer.set_config_prop({
            ["data."+element.title.slice(0, -5)+".visible"] : true
          })
        });
      }
      else
      {
        // Sets the current "eye" to be the only one visible
        categories_now.forEach(element => {element.visible = false});
        categories_now[objIndex].visible = true
        
        // We set all the visibility of the properties to false
        categories_now.forEach(element => {
          window.electron.ipcRenderer.set_config_prop({
            ["data."+element.title.slice(0, -5)+".visible"] : false
          })
        });
        
        // We just set the current one to be visible
        let target : string = this.state.categories[objIndex].title.slice(0, -5);
        window.electron.ipcRenderer.set_config_prop({
          ["data."+target+".visible"] : true
        })
      }
    }

    this.setState({
      categories           : categories_now,
      last_visibility_state: categories_now[objIndex].visible,
    });

    window.mouse_is_held_down = true;

    // this.state.ctrl_is_held_down

    // let target : string = this.state.categories[objIndex].title.slice(0, -5);
    // window.electron.ipcRenderer.set_config_prop({
    //   ["data."+target+".visible"] : categories_now[objIndex].visible
    // })

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

    window.electron.ipcRenderer.set_config_prop({
      ["data."+target+".visible"] : visibility_state,
    })

  }

  colorpicking_open_picker(event, id)
  {
    let objIndex = this.state.categories.findIndex((obj => obj.id == id));

    console.log(
      this.state.categories[objIndex].color,
      // this.hexToRgbA(this.state.categories[objIndex].color)
    )

      let the_color : string = this.state.categories[objIndex].color;
      if (the_color.startsWith("rgba"))
      {

      }
      else
      {
        the_color = this.hexToRgbA(this.state.categories[objIndex].color);
      }


    this.setState({
      // color          : this.state.categories[objIndex].color,
      // color          : this.hexToRgbA(this.state.categories[objIndex].color),
      // color: "rgba(255, 0, 0, 1)",
      color: the_color,

      // color_to_assign: this.state.categories[objIndex].color,
      is_picking_color  : true,
      id_to_assign   : id,
    })


    window.color_to_assign = this.state.categories[objIndex].color;

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
      // categories_new[objIndex].color = this.state.color_to_assign;
      categories_new[objIndex].color = window.color_to_assign;
      this.setState({
        categories:categories_new
      })

      let target : string = this.state.categories[objIndex].title.slice(0, -5);

      window.electron.ipcRenderer.set_config_prop({
        // ["data."+target+".color"] : this.state.color_to_assign,
        ["data."+target+".color"] : window.color_to_assign,
      })

    }

    this.setState({
      is_picking_color: false,
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
    window.electron.ipcRenderer.reload();
    console.log("Reloading...")
  }

  render()
  {


    let graph;

    // 1 day view
    if (this.state.display_mode == 0)
    {
      graph = <Container_graphs_circular
        categories = {this.state.categories         }
        width      = {this.state.graph_circle_width }
        height     = {this.state.graph_circle_height}
      />
    }

    // Multi day view M
    if (this.state.display_mode == 1)
    {
      graph = <Container_graphs_time
        graph_timebars_margin = {this.props.graph_timebars_margin}
        categories            = {this.state.categories           }
        width                 = {this.state.graph_width          }
        height                = {this.state.graph_height         }
        days_to_display       = {this.state.days_to_display      }
        widthline             = {this.state.widthline            }
      />
    }

    // Multi day view XL
    if (this.state.display_mode == 2)
    {
      graph = <Container_graphs_time
        graph_timebars_margin = {this.props.graph_timebars_margin}
        categories            = {this.state.categories           }
        width                 = {this.state.graph_width          }
        height                = {this.state.graph_height         }
        days_to_display       = {this.state.days_to_display_xl   }
        widthline             = {this.state.widthline_xl         }
      />
    }

    return <div className='centered'>
    
    {/* The graph */}
    {graph}
    
    {/* Selector column */}
    <div className='centered_column' style={{position:"absolute", right:this.props.graph_timebars_margin}}>

        <Container_options_display
        set_display_mode = {this.set_display_mode}
        />
        <div className='spacer_10'/>

        <Container_categories
        categories              = {this.state.categories}
        toggle_visibility_by_id = {this.toggle_visibility_by_id}
        set_visibility_by_id    = {this.set_visibility_by_id}
        last_visibility_state   = {this.state.last_visibility_state}
        on_click_color          = {this.colorpicking_open_picker}
        onSortEnd               = {this.onSortEnd}
        />

        {/* <div className='spacer_10'/> */}
        {/* <Container_customhighlights/> */}

    </div>

    <Container_colorpicker
    visible             = {this.state.is_picking_color}
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
