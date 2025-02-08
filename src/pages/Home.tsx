import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export interface Film {
  kinopoiskId: number;
  nameRu: string;
  genres?: { genre: string }[];
  posterUrlPreview?: string;
  ratingKinopoisk?: number;
  ratingImdb?: number;
  rating?: string;
}

const handleButtonClick = (filmId: number) => {
  const filmUrl = `https://www.kinopoisk.ru/film/${filmId}/`;
  window.open(filmUrl, '_blank');
};
// Функия для скролла сайта
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // Плавная прокрутка
  });
};

const NameConvertHanlder = (category?:string):string => {
switch(category){
  case 'TOP_250_TV_SHOWS':
    return 'Топ лучших сериалов';
    case 'TOP_250_MOVIES':
    return 'Топ лучших фильмов'
  default:
    return 'Неизвестно'
}
}

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
      <Box sx={{ position: 'relative' }}>
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
        <CardMedia component="img" image={image} sx={{ objectFit: 'cover' }} />
      </Box>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {genres &&
            genres.map((genreObj, index) => (
              <span key={index} className="genre" style={{ color: 'orange', fontSize: '25px' }}>
                {genreObj.genre}
                {index < genres.length - 1 && ', '}
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
          Смотреть в кинопоиске
        </Button>
      </CardActions>
    </Card>
  );
};

const Home: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [category, setCategory] = useState<string>('TOP_POPULAR_MOVIES');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const savedFilms = localStorage.getItem('searchedFilms');
    if (savedFilms) {
      setFilms(JSON.parse(savedFilms));
    } else {
      fetchFilms(category, currentPage);
    }
  }, [category, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const fetchFilms = async (category: string, page: number) => {
    try {
      const response = await fetch(
        `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=${category}&page=${page}`,
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
      setTotalPages(data.totalPages || 1);
      localStorage.removeItem('searchedFilms');
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const handleSearch = (searchResults: Film[]) => {
    setFilms(searchResults);
    localStorage.setItem('searchedFilms', JSON.stringify(searchResults));
  };

  return (
    <>
      <Navbar
        onCategoryChange={(newCategory) => {
          setCategory(newCategory);
          localStorage.removeItem('searchedFilms');
        }}
        onSearch={handleSearch}
      />
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px', flexWrap: 'wrap' }}
      >
        {films.map((film) => (
          <Link key={film.kinopoiskId} to={`/film/${film.kinopoiskId}`} style={{ textDecoration: 'none' }}>
            <MediaCard
              key={film.kinopoiskId}
              title={film.nameRu}
              ratingKinopoisk={
                film.ratingKinopoisk && film.ratingKinopoisk > 0 ? film.ratingKinopoisk : film.ratingImdb ?? undefined
              }
              kinopoiskId={film.kinopoiskId}
              image={film.posterUrlPreview || '/placeholder.jpg'}
              genres={film.genres || []}
            />
          </Link>
        ))}
      </div>

      {films.length > 0 && !localStorage.getItem('searchedFilms') && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', gap:'100px', marginTop:'40px' }}>
          <Button
            variant="contained"
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              scrollToTop(); // Прокрутка вверх
            }}
            disabled={currentPage === 1}
          >
            {currentPage > 1 && <WestIcon sx={{ fontSize: '35px', padding:'10%' }} />}
          </Button>
           <Typography variant='h5'>{NameConvertHanlder(category)}</Typography>
          <Button
            variant="contained"
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              scrollToTop(); // Прокрутка вверх
            }}
            disabled={currentPage >= totalPages}
          >
            <EastIcon sx={{ fontSize: '35px', padding:'10%' }} />
          </Button>
        </Box>
      )}
    </>
  );
};

export default Home;
