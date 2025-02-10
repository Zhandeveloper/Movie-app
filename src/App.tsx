import { Routes, Route } from 'react-router-dom'; // Исправлено: импорт BrowserRouter
import Home from './pages/Home';
import MovieCard from './pages/MovieCard';
import { GlobalStyles } from '@mui/material';
import StaffCard from './pages/StaffCard';
import VideosSection from './pages/VideoSection';

function App() {
  return (
    <div className="App">
      <GlobalStyles styles={{ body: { backgroundColor: '#1a191f' }, color: 'white' }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film/:id" element={<MovieCard />} /> 
        <Route path="/staff/:id" element={<StaffCard />} />
        <Route path="/videos/:id" element={<VideosSection />} />
      </Routes>
    </div>
  );
}

export default App;
