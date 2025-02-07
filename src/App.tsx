import { Routes, Route } from 'react-router-dom'; // Исправлено: импорт BrowserRouter
import Home from './pages/Home';
import MovieCard from './pages/MovieCard';
import { GlobalStyles } from '@mui/material';
import StaffCard from './pages/StaffCard';

function App() {
  return (
    <div className="App">
      <GlobalStyles styles={{ body: { backgroundColor: '#1a191f' }, color: 'white' }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film/:id" element={<MovieCard />} /> {/* Маршрут с параметром `id` */}
        <Route path="/staff/:id" element={<StaffCard />} />
      </Routes>
    </div>
  );
}

export default App;
