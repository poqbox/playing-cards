import { Route, Routes } from 'react-router-dom'
import './App.css'
import Cardception from './components/Cardception'

// test by running "npm run dev" in the terminal

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Cardception />} />
        <Route path="/:card_code" element={<Cardception />} />
      </Routes>
    </>
  )
}

export default App
