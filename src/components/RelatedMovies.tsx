import { Box, Button, Card, CardMedia, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RelatedMoviesProps {
  movieId?: string;
}

interface SequelsAndPrequels {
  filmId: number;
  nameRu: string;
  nameEn: string;
  nameOriginal: string;
  posterUrlPreview: string;
  relationType: string;
}

const TypeHandler = (relationType?: string): string => {
  switch (relationType) {
    case 'SEQUEL':
      return 'Сиквел';
    case 'PREQUEL':
      return 'Приквел';
    case 'REMAKE':
      return 'Ремейк';
    default:
      return 'Неизвестно';
  }
};

const RelatedMovies: React.FC<RelatedMoviesProps> = ({ movieId }) => {
  const [relatedMovies, setRelatedMovies] = useState<SequelsAndPrequels[]>([]);
  const [showRelated, setShowRelated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) return;

    const fetchRelatedMovies = async (id: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/${id}/sequels_and_prequels`, {
          method: 'GET',
          headers: {
            'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setRelatedMovies(data || []);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedMovies(movieId);
  }, [movieId]);

  const handleMovieClick = (filmId: number) => {
    setIsLoading(true); // Отключаем кнопку при переходе
    setShowRelated(false); // Закрываем список при переходе
    navigate(`/film/${filmId}`);
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => setShowRelated(!showRelated)}
        disabled={isLoading}
        sx={{
          margin: '15px 10px',
          fontSize: '15px',
          color: 'white',
          height: 52,
          marginRight: 8,
          padding: '14px 28px',
          fontWeight: 500,
          borderRadius: '12px',
          background: 'linear-gradient(135deg,rgb(10, 113, 216) 9.93%,rgb(129, 15, 216))',
          transition: 'background .2s ease, transform .2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            filter: 'brightness(1.1)',
            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        {showRelated ? 'Скрыть' : 'Показать сиквелы и приквелы'}
      </Button>

      {showRelated && (
        <Box
          mt={2}
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row', xl: 'row' } }}
        >
          {relatedMovies.length === 0 ? (
            <Typography variant="h6">Нет сиквелов и приквелов</Typography>
          ) : (
            relatedMovies.map((movie) => (
              <Card
                key={movie.filmId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',

                  margin: { xs: '5px', sm: '5px', md: '5px', lg: '10px', xl: '10px' },
                  mb: 2,
                  maxWidth: '500px',
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onClick={() => !isLoading && handleMovieClick(movie.filmId)}
              >
                <CardMedia component="img" sx={{ width: 100 }} image={movie.posterUrlPreview} alt={movie.nameRu} />
                <CardContent>
                  <Typography variant="h6">{movie.nameRu || movie.nameEn || movie.nameOriginal}</Typography>
                  <Typography variant="subtitle1" sx={{ color: '#2862DE', fontWeight: '525' }}>
                    {TypeHandler(movie.relationType)}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default RelatedMovies;
