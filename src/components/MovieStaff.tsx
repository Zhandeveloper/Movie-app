import React, { useState, useEffect } from 'react';
import { Box, Button, Select, MenuItem, FormControl} from '@mui/material';
import { Link } from 'react-router-dom';

export interface Staff {
  staffId: number;
  nameRu: string;
  nameEn: string;
  description?: string;
  posterUrl?: string;
  professionText: string;
}

interface MovieStaffProps {
  movieId?: string;
}

const MovieStaff: React.FC<MovieStaffProps> = ({ movieId }) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loadMoreCount, setLoadMoreCount] = useState(0);
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [professions, setProfessions] = useState<string[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${movieId}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
        }
        const data: Staff[] = await response.json(); // Явная типизация данных
      
        setStaff(data);
        setProfessions([
          ...new Set(
            data
              .map((item) => item.professionText || "")
              .filter((p): p is string => p !== "")
          )
        ]); 
        setVisibleCount(window.innerWidth < 1000 ? 4 : 20);
      } catch (err) {
        setError('Ошибка при загрузке данных актерского состава');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchStaff();
    }
  }, [movieId]);

  const handleLoadMore = () => {
    const increment = 10;
    const maxLoads = window.innerWidth < 1000 ? 5 : staff.length / increment;
    if (loadMoreCount < maxLoads) {
      setVisibleCount((prev) => prev + increment);
      setLoadMoreCount((prev) => prev + 1);
    }
  };

  if (loading) return <h2>Загрузка...</h2>;
  if (error) return <h2>{error}</h2>;

  const filteredStaff = selectedProfession ? staff.filter((s) => s.professionText === selectedProfession) : staff;

  return (
    <Box>
      <h1>Киногруппа:</h1>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
      
        <Select
          value={selectedProfession}
          onChange={(e) => setSelectedProfession(e.target.value)}
          displayEmpty
          sx={{ mb: 2, backgroundColor: 'white' }}
        >
          <MenuItem value="">Все</MenuItem>
          {professions.map((profession) => (
            <MenuItem key={profession} value={profession}>{profession}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {filteredStaff.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {filteredStaff.slice(0, visibleCount).map((item) => (
            <div
              key={item.staffId}
              className="similarsMovieCard"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '10px',
                height: '100%',
                width: '150px',
              }}
            >
              <Link
                to={`/staff/${item.staffId}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  marginTop: '10px',
                  fontSize: '20px',
                  transition: 'transform 0.2s',
                }}
              >
                <img
                  src={item.posterUrl}
                  alt={item.nameRu}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <h4 style={{ margin: '0 0 8px' }}>{item.nameRu || item.nameEn}</h4>
                <p style={{ color: '#2862DE', fontSize: '17px', margin: '0', fontWeight: 'bold' }}>
                  {item.description}
                </p>
                <p style={{ color: 'gray', fontSize: '17px', margin: '0' }}>{item.professionText}</p>
              </Link>
            </div>
          ))}
        </Box>
      ) : (
        <h2>Нет данных</h2>
      )}
      {visibleCount < filteredStaff.length && (
        <Button variant="contained" onClick={handleLoadMore} sx={{ mt: 2 }}>
          Показать ещё
        </Button>
      )}
    </Box>
  );
};

export default MovieStaff;
