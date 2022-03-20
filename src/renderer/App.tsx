import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import './App.css';
import List_categories from './List_categories';

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
      categories:[]
    }

    this.toggle_visibility_by_id = this.toggle_visibility_by_id.bind(this)
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
    console.log("eye clicked", id)
    console.log(this.state.categories)

    let categories_now = this.state.categories
    let objIndex       = categories_now.findIndex((obj => obj.id == id));

    console.log(objIndex)
    categories_now[objIndex].visible = false
    categories_now[objIndex].title   = "aaa"
    this.setState({
      categories:categories_now
    })
    console.log(this.state.categories)
  }

  render()
  {
    return <div className='centered'>
    
    <List_categories
    categories              = {this.state.categories}
    toggle_visibility_by_id = {this.toggle_visibility_by_id}
    />

    </div>
  }

  // componentDidUpdate()
  // {
  //     this.render();
  // }
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
