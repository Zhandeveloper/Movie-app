import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';

import { Film } from '../pages/Home';

// Типы для жанров и стран
interface Genre {
  id: number;
  genre: string;
}

interface Country {
  id: number;
  country: string;
}

// Тип для данных API
interface ApiFilm {
  kinopoiskId: number;
  nameRu: string;
  genres: { genre: string }[];
  posterUrlPreview: string;
  ratingKinopoisk: number | null;
  ratingImdb: number | null;
}

interface SearchProps {
  onSearch: (films: Film[]) => void;
}

const genres: Genre[] = [
  { id: 1, genre: 'триллер' },
  { id: 2, genre: 'драма' },
  { id: 3, genre: 'криминал' },
  { id: 4, genre: 'мелодрама' },
  { id: 5, genre: 'детектив' },
  { id: 6, genre: 'фантастика' },
  { id: 7, genre: 'приключения' },
  { id: 8, genre: 'биография' },
  { id: 9, genre: 'фильм-нуар' },
  { id: 10, genre: 'вестерн' },
  { id: 11, genre: 'боевик' },
  { id: 12, genre: 'фэнтези' },
  { id: 13, genre: 'комедия' },
  { id: 14, genre: 'военный' },
  { id: 15, genre: 'история' },
  { id: 16, genre: 'музыка' },
  { id: 17, genre: 'ужасы' },
  { id: 18, genre: 'мультфильм' },
  { id: 19, genre: 'семейный' },
  { id: 20, genre: 'мюзикл' },
  { id: 21, genre: 'спорт' },
  { id: 22, genre: 'документальный' },
  { id: 23, genre: 'короткометражка' },
  { id: 24, genre: 'аниме' },
  { id: 33, genre: 'детский' },
];
const countries: Country[] = [
  { id: 1, country: 'США' },
  { id: 2, country: 'Швейцария' },
  { id: 3, country: 'Франция' },
  { id: 4, country: 'Польша' },
  { id: 5, country: 'Великобритания' },
  { id: 6, country: 'Швеция' },
  { id: 7, country: 'Индия' },
  { id: 8, country: 'Испания' },
  { id: 9, country: 'Германия' },
  { id: 10, country: 'Италия' },
  { id: 11, country: 'Гонконг' },
  { id: 12, country: 'Германия (ФРГ)' },
  { id: 13, country: 'Австралия' },
  { id: 14, country: 'Канада' },
  { id: 15, country: 'Мексика' },
  { id: 16, country: 'Япония' },
  { id: 17, country: 'Дания' },
  { id: 18, country: 'Чехия' },
  { id: 19, country: 'Ирландия' },
  { id: 20, country: 'Люксембург' },
  { id: 21, country: 'Китай' },
  { id: 22, country: 'Норвегия' },
  { id: 23, country: 'Нидерланды' },
  { id: 24, country: 'Аргентина' },
  { id: 25, country: 'Финляндия' },
  { id: 34, country: 'Россия' },
  { id: 33, country: 'СССР' },
];

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const [genre, setGenre] = useState<number | null>(null);
  const [country, setCountry] = useState<number | null>(null);
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [ratingFrom, setRatingFrom] = useState<string>('');
  const [ratingTo, setRatingTo] = useState<string>('');
  const [order, setOrder] = useState<string>('RATING');
  const [type, setType] = useState<string>(''); // <-- новый стейт для type
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedFilters = localStorage.getItem('lastSearchFilters');
    if (savedFilters) {
      const f = JSON.parse(savedFilters);
      setQuery(f.query || '');
      setGenre(f.genre || null);
      setCountry(f.country || null);
      setYearFrom(f.yearFrom || '');
      setYearTo(f.yearTo || '');
      setRatingFrom(f.ratingFrom || '');
      setRatingTo(f.ratingTo || '');
      setOrder(f.order || 'RATING');
      setType(f.type || ''); // <-- подгружаем сохранённый type
    }
  }, []);

  const validateFilters = () => {
    const yF = parseInt(yearFrom),
      yT = parseInt(yearTo);
    const rF = parseFloat(ratingFrom),
      rT = parseFloat(ratingTo);
    if (yearFrom && (yF < 1870 || yF > 2050)) {
      alert('Год от некорректен');
      return false;
    }
    if (yearTo && (yT < 1870 || yT > 2050)) {
      alert('Год до некорректен');
      return false;
    }
    if (ratingFrom && (rF < 1 || rF > 10)) {
      alert('Рейтинг от некорректен');
      return false;
    }
    if (ratingTo && (rT < 1 || rT > 10)) {
      alert('Рейтинг до некорректен');
      return false;
    }
    return true;
  };

  const fetchFilms = async () => {
    if (!query && !genre && !country && !yearFrom && !yearTo && !ratingFrom && !ratingTo && !type) {
      alert('Ничего не выбрано');
      return;
    }
    if (!validateFilters()) return;

    const params = new URLSearchParams();
    if (country) params.append('countries', country.toString());
    if (genre) params.append('genres', genre.toString());
    params.append('order', order);
    params.append('type', type || 'ALL'); // <-- используем выбранный type или ALL по умолчанию
    params.append('ratingFrom', ratingFrom || '0');
    params.append('ratingTo', ratingTo || '10');
    params.append('yearFrom', yearFrom || '1000');
    params.append('yearTo', yearTo || '3000');
    if (query.trim()) params.append('keyword', query);
    params.append('page', '1');

    try {
      const res = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films?${params}`, {
        headers: {
          'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      const formatted: Film[] = data.items.map((film: ApiFilm) => ({
        kinopoiskId: film.kinopoiskId,
        nameRu: film.nameRu,
        genres: film.genres,
        posterUrlPreview: film.posterUrlPreview,
        ratingKinopoisk: film.ratingKinopoisk ?? undefined,
        ratingImdb: film.ratingImdb ?? undefined,
      }));
      onSearch(formatted);
      localStorage.setItem(
        'lastSearchFilters',
        JSON.stringify({
          query,
          genre,
          country,
          yearFrom,
          yearTo,
          ratingFrom,
          ratingTo,
          order,
          type,
        }),
      );
      localStorage.setItem('lastSearchResults', JSON.stringify(formatted));
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchFilms();
  };

  const resetFilters = () => {
    setQuery('');
    setGenre(null);
    setCountry(null);
    setYearFrom('');
    setYearTo('');
    setRatingFrom('');
    setRatingTo('');
    setOrder('RATING');
    setType(''); // <-- сбрасываем и type
  };

  const toggleFilters = () => setFiltersOpen(!filtersOpen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* строка поиска */}
      <div style={{ display: 'flex', gap: 10 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск фильма..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
            input: { color: 'black', fontSize: 20 },
          }}
        />
        <Button variant="contained" onClick={fetchFilms} sx={{ fontSize: 18, textTransform: 'none' }}>
          <SearchIcon /> Искать
        </Button>
      </div>

      {/* кнопка показа/скрытия фильтров */}
      <Button
        variant="outlined"
        onClick={toggleFilters}
        sx={{
          fontSize: 18,
          textTransform: 'none',
          color: 'white',
          border: '1px solid black',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {filtersOpen ? (
          'Закрыть фильтры'
        ) : (
          <>
            <FilterListIcon /> Фильтры
          </>
        )}
      </Button>

      {/* сами фильтры */}
      {filtersOpen && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {/* Тип фильма */}
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }}>Тип фильма</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            >
              <MenuItem value="">
                <em>--</em>
              </MenuItem>
              <MenuItem value="FILM">Фильм</MenuItem>
              <MenuItem value="TV_SHOW">ТВ-шоу</MenuItem>
              <MenuItem value="TV_SERIES">Сериал</MenuItem>
              <MenuItem value="MINI_SERIES">Мини-сериал</MenuItem>
              <MenuItem value="ALL">Все</MenuItem>
            </Select>
          </FormControl>

          {/* Жанр */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }}>Жанр</InputLabel>
            <Select
              value={genre || ''}
              onChange={(e) => setGenre(e.target.value ? Number(e.target.value) : null)}
              sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            >
              <MenuItem value="">
                <em>Нет</em>
              </MenuItem>
              {genres.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Страна */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }}>Страна</InputLabel>
            <Select
              value={country || ''}
              onChange={(e) => setCountry(e.target.value ? Number(e.target.value) : null)}
              sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            >
              <MenuItem value="">
                <em>Нет</em>
              </MenuItem>
              {countries.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Года и рейтинги */}
          <TextField
            label="Год от"
            type="number"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: 150,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white', '&.Mui-focused': { color: 'white' } },
            }}
          />
          <TextField
            label="Год до"
            type="number"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: 150,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white', '&.Mui-focused': { color: 'white' } },
            }}
          />
          <TextField
            label="Мин. рейтинг"
            type="number"
            value={ratingFrom}
            onChange={(e) => setRatingFrom(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: 150,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white', '&.Mui-focused': { color: 'white' } },
            }}
          />
          <TextField
            label="Макс. рейтинг"
            type="number"
            value={ratingTo}
            onChange={(e) => setRatingTo(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: 150,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white', '&.Mui-focused': { color: 'white' } },
            }}
          />

          {/* Сортировка */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }}>Сортировка</InputLabel>
            <Select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              sx={{ width: 150, color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            >
              <MenuItem value="RATING">По рейтингу</MenuItem>
              <MenuItem value="YEAR">По году</MenuItem>
              <MenuItem value="NUM_VOTE">По голосам</MenuItem>
            </Select>
          </FormControl>

          {/* Сброс */}
          <Button variant="outlined" onClick={resetFilters} sx={{ color: 'white', border: '1.5px solid black' }}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};

export default Search;
