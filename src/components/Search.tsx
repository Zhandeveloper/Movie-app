import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface SearchProps {
  onSearch: (films: string[]) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const fetchFilms = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${query}`,
        {
          method: 'GET',
          headers: {
            'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();

      const formattedFilms = data.films.map((film: any) => ({
        kinopoiskId: film.filmId,
        nameRu: film.nameRu,
        genres: film.genres ? film.genres.map((genre: any) => ({ genre: genre.genre })) : [],
        posterUrlPreview: film.posterUrlPreview,
        ratingKinopoisk: film.rating && !isNaN(film.rating) ? parseFloat(film.rating) : undefined,
        ratingImdb: film.ratingImdb && !isNaN(film.ratingImdb) ? parseFloat(film.ratingImdb) : undefined,
      }));

      onSearch(formattedFilms);

      // Сохраняем запрос и результаты в localStorage
      localStorage.setItem('lastSearchQuery', query);
      localStorage.setItem('lastSearchResults', JSON.stringify(formattedFilms));

      // Логирование для проверки
      console.log('Данные сохранены в localStorage:', {
        lastSearchQuery: query,
        lastSearchResults: formattedFilms,
      });
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      fetchFilms();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск фильма..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Добавляем обработчик нажатия клавиш
        sx={{
          backgroundColor: 'white',
          borderRadius: '5px',
          input: { color: 'black', fontSize: '20px' },
        }}
      />
      <Button variant="contained" onClick={fetchFilms} sx={{ fontSize: '18px', textTransform: 'none' }}>
        Искать
      </Button>
    </div>
  );
};

export default Search;
