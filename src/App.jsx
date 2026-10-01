import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div className='min-h-screen bg-paper'>
      <Outlet />
    </div>
  )
}

export default App
