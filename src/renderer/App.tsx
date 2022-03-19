import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import './App.css';
import List_categories from './List_categories';

class Home extends Component
{

  constructor(props)
  {
    super(props);
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
