import React from 'react'
import { Outlet } from 'react-router-dom'

const App = () => {
  localStorage.setItem("theme", "light");

  return (
    <div className='min-h-screen h-screen bg-paper'>
      <Outlet />
    </div>
  )
}

export default App
