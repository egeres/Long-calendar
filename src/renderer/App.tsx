import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import './App.css';
import Container_categories from './Container_categories';
import { HexColorPicker } from "react-colorful";

class Home extends Component
{

  ctrl_is_being_pressed : Boolean = false;

  // ctrl_down(event) { if (event.key === "Control") {/*console.log("A");*/ this.ctrl_is_being_pressed = true ;} }
  // ctrl_up(  event) { if (event.key === "Control") {/*console.log("B");*/ this.ctrl_is_being_pressed = false;} }

  constructor(props)
  {
    super(props);

    // this.ctrl_down = this.ctrl_down.bind(this);
    // this.ctrl_up   = this.ctrl_up.bind(  this);

    this.state = {
      categories   : [],
      color        : "#0F0",
      picking_color: false,
    }

    this.toggle_visibility_by_id = this.toggle_visibility_by_id.bind(this)
    this.set_color_by_id         = this.set_color_by_id        .bind(this)
  }

  async componentDidMount()
  {
      let out = await fetch("http://localhost:17462/sources_in_data_folder");
      out = await out.json()
      console.log(out)
      await this.setState({
          categories:out,
      })

      console.log(this.state)
  }

  toggle_visibility_by_id(id)
  {
    // console.log("eye clicked", id)
    // console.log(this.state.categories)

    let categories_now = this.state.categories
    let objIndex       = categories_now.findIndex((obj => obj.id == id));

    // console.log(objIndex)
    categories_now[objIndex].visible = !categories_now[objIndex].visible
    this.setState({
      categories:categories_now
    })
    // console.log(this.state.categories)
  }

  set_color_by_id(id)
  {
    let objIndex = this.state.categories.findIndex((obj => obj.id == id));

    this.setState({
      color        : this.state.categories[objIndex].color,
      picking_color: true,
    })

  }

  render()
  {
    return <div className='centered'>
    
    <Container_categories
    categories              = {this.state.categories}
    toggle_visibility_by_id = {this.toggle_visibility_by_id}
    set_color_by_id         = {this.set_color_by_id}
    />

    <div className={this.state.picking_color ? 'empty':'hidden'}>
      <HexColorPicker color={this.state.color}/>
    </div>

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
