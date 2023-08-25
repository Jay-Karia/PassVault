import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

import TextField from '@mui/material/TextField';

function App() {

  return (
    <>
      <h1 className="text-3xl font-bold underline text-blue-900">Hello Tailwind CSS! 💨</h1>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{
        marginTop:"10px"
      }} />
    </>
  )
}

export default App
