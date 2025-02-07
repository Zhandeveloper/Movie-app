import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
// Типы для данных фильма
export interface Film {
  kinopoiskId: number;
  nameRu: string;
  genres?: { genre: string }[]; // Массив объектов жанров
  posterUrlPreview?: string;
  ratingKinopoisk?: number;
  ratingImdb?: number;
  rating?: string;
}

const handleButtonClick = (filmId: number) => {
  const filmUrl = `https://www.kinopoisk.ru/film/${filmId}/`; // Сформируйте URL фильма на сайте Кинопоиска
  window.open(filmUrl, '_blank'); // Открываем ссылку в новой вкладке
};

// Компонент MediaCard
const MediaCard: React.FC<{
  title: string;
  image: string;
  genres?: { genre: string }[];
  ratingKinopoisk?: number;
  ratingImdb?: number;
  kinopoiskId: number;
}> = ({ title, genres, image, ratingKinopoisk, kinopoiskId, ratingImdb }) => {
  return (
    <Card
      sx={{
        margin: '10px',
        width: 400,
        backgroundColor: 'rgb(28, 28, 53)',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'all 1s ease',
        ':hover': {
          transform: 'scale(1.05)',
          border: '2px solid orange',
        },
      }}
    >
      {/* Контейнер для изображения и рейтинга */}
      <Box sx={{ position: 'relative' }}>
        {/* Рейтинг в левом верхнем углу */}
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'black',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '90%',
            zIndex: 1,
            fontSize: '27px',
            width: '32px',
            height: '39px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'roboto',
            border:
              (ratingKinopoisk ?? 0) > 7
                ? '1px solid lime'
                : (ratingKinopoisk ?? 0) >= 5
                ? '1px solid orange'
                : (ratingKinopoisk ?? 0) > 0
                ? '1px solid red'
                : '1px solid blue',
          }}
        >
          {ratingKinopoisk && ratingKinopoisk > 0 ? ratingKinopoisk : ratingImdb && ratingImdb > 0 ? ratingImdb : 'u/k'}
        </Box>
        {/* Изображение */}
        <CardMedia component="img" image={image} sx={{ objectFit: 'cover' }} />
      </Box>

      {/* Контент карточки */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {genres &&
            genres.map((genreObj, index) => (
              <span key={index} className="genre" style={{ color: 'orange', fontSize: '25px' }}>
                {genreObj.genre}
                {index < genres.length - 1 && ', '} {/* Разделитель запятой */}
              </span>
            ))}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={{ textTransform: 'capitalize', fontSize: '24px' }}
          onClick={() => handleButtonClick(kinopoiskId)}
        >
          Смотреть в кинопосике
        </Button>
      </CardActions>
    </Card>
  );
};
const Home: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [category, setCategory] = useState<string>('TOP_POPULAR_MOVIES');

  // Восстанавливаем состояние из localStorage
  useEffect(() => {
    const savedFilms = localStorage.getItem('searchedFilms');
    if (savedFilms) {
      setFilms(JSON.parse(savedFilms));
    } else {
      fetchFilms(category);
    }
  }, [category]); // Добавил зависимость от category

  const fetchFilms = async (category: string) => {
    try {
      const response = await fetch(
        `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=${category}&page=1`,
        {
          method: 'GET',
          headers: {
            'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      setFilms(data.items || []);
      localStorage.removeItem('searchedFilms'); // Очищаем сохранённый поиск при смене категории
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  // Функция обработки поиска
  const handleSearch = (searchResults: Film[]) => {
    setFilms(searchResults);
    localStorage.setItem('searchedFilms', JSON.stringify(searchResults));
  };

  return (
    <>
      <Navbar onCategoryChange={(newCategory) => {
        setCategory(newCategory);
        localStorage.removeItem('searchedFilms'); // Очищаем поиск при выборе жанра
      }} onSearch={handleSearch} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px', flexWrap: 'wrap' }}>
        {films.map((film) => (
          <Link key={film.kinopoiskId} to={`/film/${film.kinopoiskId}`} style={{ textDecoration: 'none' }}>
            <MediaCard
              key={film.kinopoiskId}
              title={film.nameRu}
              ratingKinopoisk={film.ratingKinopoisk && film.ratingKinopoisk > 0 ? film.ratingKinopoisk : film.ratingImdb ?? undefined}
              kinopoiskId={film.kinopoiskId}
              image={film.posterUrlPreview || '/placeholder.jpg'}
              genres={film.genres || []}
            />
          </Link>
        ))}
      </div>
    </>
  );
};


export default Home;
