import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import './App.css';
import List_categories from './List_categories';

class Home extends Component
{

  ctrl_is_being_pressed : Boolean = false;

  ctrl_down(event) { if (event.key === "Control") {/*console.log("A");*/ this.ctrl_is_being_pressed = true ;} }
  ctrl_up(  event) { if (event.key === "Control") {/*console.log("B");*/ this.ctrl_is_being_pressed = false;} }

  constructor(props)
  {
    super(props);

    this.ctrl_down = this.ctrl_down.bind(this);
    this.ctrl_up   = this.ctrl_up.bind(  this);
  }

  render()
  {
    return <div className='centered'>
    
    <List_categories/>

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
