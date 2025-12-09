// src/App.js
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Box bg="#000" color="white">
      <Navbar />
      <Box pt="80px">
        <Home />
      </Box>
    </Box>
  );
}

export default App;