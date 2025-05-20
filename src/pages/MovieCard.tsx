import { Box, Button, IconButton, Typography } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import HomeIcon from '@mui/icons-material/Home';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import '../index.scss';
import MovieReviews from '../components/MovieReviews';
import MovieStaff from '../components/MovieStaff';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MovieFacts from '../components/MovieFacts';
import RelatedMovies from '../components/RelatedMovies';
import BudgetMovie from '../components/BudgetMovie';

interface MovieCardData {
  kinopoiskId: number;
  nameRu: string;
  description?: string;
  genres?: { genre: string }[];
  countries?: { country: string }[];
  posterUrl?: string;
  ratingKinopoisk?: number;
  ratingImdb?: number;
  imdbId?: string;
  filmLength?: number;
  year?: number;
  nameOriginal?: string;
  type?: string;
  ratingAgeLimits?: string;
}

interface SimilarMovie {
  filmId: number;
  nameRu: string;
  nameEn: string;
  nameOriginal: string;
  posterUrlPreview: string;
  relationType: string;
}

export interface Video {
  url: string;
  name: string;
  site: string;
}

// Вспомогательные функции
const formatDuration = (minutes?: number): string => {
  if (!minutes) return 'Нет данных';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} мин`;
  }

  return `${hours} ч ${remainingMinutes} мин`;
};

const typeContentHandler = (content?: string): string => {
  if (content === 'FILM') {
    return 'Фильмы';
  } else if (content === 'TV_SERIES') {
    return 'Сериалы';
  } else if (content === 'TV_SHOW') {
    return 'ТВ-шоу';
  } else if (content === 'MINI_SERIES') {
    return 'Мини-сериалы';
  } else {
    return 'Неизвестно';
  }
};

const typeSingleContentHandler = (content?: string): string => {
  if (content === 'FILM') {
    return 'фильме';
  } else if (content === 'TV_SERIES') {
    return 'сериале';
  } else if (content === 'TV_SHOW') {
    return 'ТВ-шоу';
  } else if (content === 'MINI_SERIES') {
    return 'мини-сериалы';
  } else {
    return 'неизвестно';
  }
};


const AgeHandler = (age?: string): string => {
  switch (age) {
    case 'age18':
      return '18 лет';
    case 'age16':
      return '16 лет';
    case 'age12':
      return '12 лет';
    case 'age6':
      return '6 лет';
    default:
      return 'Неизвестно';
  }
};

const MovieCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<MovieCardData | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [showSimilarMovies, setShowSimilarMovies] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [errorSimilar, setErrorSimilar] = useState('');

  const [youtubeTrailers, setYoutubeTrailers] = useState<Video[]>([]);

  const navigate = useNavigate(); // Используем хук для навигации
  // Загрузка данных о фильме
  const fetchMovieCard = async (id: string) => {
    try {
      const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setFilm(data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  // Загрузка похожих фильмов
  const fetchSimilarMovies = async () => {
    if (showSimilarMovies) {
      setShowSimilarMovies(false); // Если уже показаны, скрываем
    } else {
      setLoadingSimilar(true);
      setErrorSimilar('');
      try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/similars`, {
          method: 'GET',
          headers: {
            'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Ошибка загрузки похожих фильмов');

        const data = await response.json();
        setSimilarMovies(data.items.slice(0, 20)); // Берем первые 10 фильмов
        setShowSimilarMovies(true); // Показываем блок
      } catch (err) {
        console.log('Ошибка загрузке похожих фильмов:', err);
      } finally {
        setLoadingSimilar(false);
      }
    }
  };

  const fetchVideos = async (id: string) => {
    try {
      const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/videos`, {
        headers: {
          'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      // Фильтруем видео
      const trailers = data.items.filter((video: Video) => {
        const isYoutube = video.site === 'YOUTUBE';
        const isTrailer = video.name.toLowerCase().includes('трейлер');
        return isYoutube && isTrailer;
      });

      setYoutubeTrailers(trailers.slice(0, 1));
    } catch (error) {
      console.error('Ошибка при загрузке видео:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMovieCard(id);
      fetchVideos(id);
      setShowSimilarMovies(false);
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!film) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={{ fontFamily: 'roboto', color: 'white', backgroundColor: 'rgb(28, 28, 53)' }}>
      <IconButton
        onClick={() => {
          window.history.back();
        }}
        sx={{
          color: 'white',
          background: 'linear-gradient(135deg, #f50 69.93%, #d6bb00)',
          '&:hover': {
            transform: 'scale(1.05)',
            filter: 'brightness(1.1)',
            boxShadow: '0px 5px 10px rgba(56, 46, 46, 0.2)',
          },
        }}
      >
        <KeyboardBackspaceIcon sx={{ fontSize: '30px' }} />
      </IconButton>

      <IconButton
        sx={{ marginLeft: { xs: '30%', sm: '25%', md: '45%', lg: '45%', xl: '45%' } }}
        onClick={() => navigate('/')} // Перенаправляет без перезагрузки
      >
        <HomeIcon
          sx={{
            fontSize: '30px',
            padding: '8px',
            borderRadius: '12px',
            color: 'white',
            background: 'linear-gradient(135deg, #f50 69.93%, #d6bb00)',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
              boxShadow: '0px 5px 10px rgba(56, 46, 46, 0.2)',
            },
          }}
        />
      </IconButton>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row', xl: 'row' } }}>
        <div style={{ marginLeft: '2%' }}>
          <h1>{film.nameRu}</h1>
          <Box
            component="img"
            src={film.posterUrl}
            alt={film.nameRu}
            sx={{ width: { xs: '325px', sm: '450px', md: '450px', lg: '450px', xl: '500px' } }}
          />
        </div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: { xs: '25px', sm: '27px', md: '28px', lg: '30px', xl: '30px' },
            marginLeft: { xs: '0%', sm: '0%', md: '12%', lg: '12%', xl: '12%' },
            '& p': {
              '@media (max-width:600px)': { marginTop: '10px' }, // Только на телефонах
            },
          }}
        >
          <p>Оригинальное название: {film.nameOriginal || 'Неизвестно'}</p>
          <p>Жанры: {film.genres?.map((genre) => genre.genre).join(', ') || 'Неизвестно'}</p>
          <p>Рейтинг Кинопоиск: {film.ratingKinopoisk || 'Нет данных'}</p>
          <p>Рейтинг Imdb: {film.ratingImdb || 'Нет данных'}</p>
          <p>Длительность: {formatDuration(film.filmLength)}</p>
          <p>Год выпуска: {film.year}</p>
          <p>Возрастное ограничение: {AgeHandler(film.ratingAgeLimits)}</p>
          <p>Страны произовдства: {film.countries?.map((country) => country.country).join(', ') || 'Неизвестно'}</p>
          <p>Тип: {typeContentHandler(film.type)}</p>
        </Box>
      </Box>
      <section style={{ fontSize: '27px' }}>
        <BudgetMovie movieId={id} />
        <RelatedMovies movieId={id} />
        <Button
          sx={{
            color: 'white',
            height: 52,
            marginTop: 2,
            marginRight: 8,
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            borderRadius: '1000px',
            background: 'linear-gradient(135deg, #f50 69.93%, #d6bb00)',
            transition: 'background .2s ease, transform .2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={(e) => {
            e.preventDefault();
            window.open(`https://www.kinopoisk.ru/film/${film.kinopoiskId}`);
          }}
        >
          <PlayArrowIcon />В Кинопоиске
        </Button>
        <Button
          sx={{
            color: 'black',
            height: 52,
            marginTop: 2,
            marginRight: 8,
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            borderRadius: '1000px',
            backgroundColor: '#f5c518',
            transition: 'background .2s ease, transform .2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
              boxShadow: '0px 5px 10px rgba(56, 46, 46, 0.2)',
            },
          }}
          onClick={(e) => {
            e.preventDefault();
            if (film.imdbId) {
              window.open(`https://www.imdb.com/title/${film.imdbId}/`);
            } else {
              alert('ID фильма на IMDb неизвестен');
            }
          }}
        >
          <LocalMoviesIcon />
          Imdb
        </Button>
        <Typography sx={{ fontSize: { xs: '24px', sm: '27px', md: '28px', lg: '30px', xl: '30px' } }}>
          {film.description || 'Описание отсутствует.'}
        </Typography>
      </section>
      <section style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <Button
          sx={{
            color: 'white',
            height: 52,
            marginRight: 8,
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            borderRadius: '100px',
            background: 'linear-gradient(135deg, #0066ff 69.93%, #00c2ff)',
            transition: 'background .2s ease, transform .2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={(e) => {
            e.preventDefault();

            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const query = encodeURIComponent(film.nameRu);

            // Глубокая ссылка для мобильных устройств
            const deepLink = `vk://vk.com/video?q=${query}`;
            // Запасная ссылка (если приложение не установлено)
            const fallbackUrl = `https://vk.com/video?q=${query}`;

            if (isMobile) {
              const newTab = window.open(deepLink, '_blank');
              setTimeout(() => {
                if (newTab) {
                  newTab.location.href = fallbackUrl;
                } else {
                  window.location.href = fallbackUrl;
                }
              }, 500);
            } else {
              window.open(fallbackUrl, '_blank');
            }
          }}
        >
          <SlideshowIcon sx={{ marginRight: '2px' }} />
          Смотреть в VK
        </Button>

        <Button
          sx={{
            color: 'white',
            height: 52,
            marginRight: 8,
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,

            borderRadius: '1000px',
            background: 'linear-gradient(135deg,rgb(241, 19, 56) 65.93%,rgb(234, 223, 237))',
            transition: 'background .2s ease, transform .2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={(e) => {
            e.preventDefault();

            const typeMap: Record<string, string> = {
              FILM: 'Фильм',
              TV_SHOW: 'ТВ-шоу',
              TV_SERIES: 'Сериал',
              MINI_SERIES: 'Мини-сериал',
            };

            const type = film.type || '';
            const typeRu = typeMap[type] || '';
            const trailerPart = type === 'TV_SHOW' ? '' : 'трейлер';

            const query = ` ${typeRu} ${film.nameRu} ${trailerPart} `.trim();
            const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

            window.open(url);
          }}
        >
          <YouTubeIcon />
          YouTube
        </Button>

        <Button
          sx={{
            color: 'white',
            height: 52,
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,

            borderRadius: '1000px',
            background: 'linear-gradient(135deg,rgb(177, 22, 234) 22.93%,rgb(14, 169, 235))',
            transition: 'background .2s ease, transform .2s ease',
            display: 'flex', // Добавляем для корректного расположения текста и иконки
            alignItems: 'center',
            gap: '10px', // Отступ между иконкой и текстом
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={fetchSimilarMovies}
          disabled={loadingSimilar}
        >
          {/* Иконка будет отображаться только если не идёт загрузка и не выбрана опция "Скрыть" */}
          {!loadingSimilar && !showSimilarMovies && <MovieIcon sx={{ fontSize: '30px' }} />}

          {/* Текст кнопки */}
          {loadingSimilar ? 'Загрузка...' : showSimilarMovies ? 'Скрыть' : `Похожие ${typeContentHandler(film.type)}`}
        </Button>
      </section>
      {showSimilarMovies && (
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px' }}>Похожие {typeContentHandler(film.type)}:</h2>
          {similarMovies.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                paddingBottom: '20px',
              }}
            >
              {similarMovies.map((movie) => (
                <Link
                  key={movie.filmId}
                  to={`/film/${movie.filmId}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    marginTop: '10px',
                    width: '200px',
                    fontSize: '20px',
                    transition: 'transform 0.2s',
                  }}
                >
                  <div
                    className="similarsMovieCard"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px',
                      height: '100%',
                    }}
                  >
                    <img
                      src={movie.posterUrlPreview}
                      alt={movie.nameRu}
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 8px' }}>{movie.nameRu || movie.nameEn || movie.nameOriginal}</h4>
                      <p style={{ color: 'gray', fontSize: '17px', margin: '0' }}>{movie.nameOriginal}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>Нету данных для похожих фильмов</p> // Сообщение, если массив пустой
          )}
        </section>
      )}
      {errorSimilar && <div style={{ color: 'red', marginTop: '20px' }}>Ошибка: {errorSimilar}</div>}
      <section
        style={{
          marginTop: '10px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {youtubeTrailers.length > 0 ? (
          <>
            {youtubeTrailers.map((video) => {
              const embedUrl = video.url
                .replace('/v/', '/embed/')
                .replace('www.youtube.com/v/', 'www.youtube.com/embed/');

              return (
                <Box
                  key={video.url}
                  sx={{
                    width: { xl: '75%', lg: '95%', md: '95%', sm: '100%', xs: '100%' },
                    textAlign: 'center',
                  }}
                >
                  {/* Обертка для центрирования кнопки */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      sx={{
                        color: 'white',
                        height: 45,
                        padding: '10px 20px',
                        fontSize: 16,
                        fontWeight: 550,
                        lineHeight: 1,
                        borderRadius: '1000px',
                        background: 'linear-gradient(135deg,rgb(133, 45, 241) 69.93%,rgb(10, 32, 173))',
                        transition: 'background .2s ease, transform .2s ease',
                        marginBottom: '15px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        minWidth: '120px',
                        maxWidth: '90vw',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          filter: 'brightness(1.1)',
                          boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(video.url);
                      }}
                    >
                      <LiveTvIcon sx={{ marginRight: '4px' }} />
                      {video.name}
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: { xl: '14px', lg: '12px', md: '12px', sm: '10px', xs: '3px' },
                    }}
                  >
                    <Box
                      component="iframe"
                      src={embedUrl}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      width="100%"
                      sx={{
                        borderRadius: '4px',
                        height: { xl: '750px', lg: '750px', md: '650px', sm: '450px', xs: '400px' },
                      }}
                    />
                  </Box>
                </Box>
              );
            })}

            <Button
              sx={{
                color: 'white',
                height: 52,
                marginTop: '15px',
                padding: '14px 28px',
                fontSize: 16,
                fontWeight: 600,

                borderRadius: '1000px',
                background: 'linear-gradient(135deg,rgb(213, 34, 233) 1.93%,rgb(235, 197, 27))',
                transition: 'background .2s ease, transform .2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  filter: 'brightness(1.1)',
                  boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Link
                key={film.kinopoiskId}
                to={`/videos/${film.kinopoiskId}`}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                Все Видео
              </Link>
            </Button>
          </>
        ) : (
          <Button
            sx={{
              color: 'white',
              height: 52,
              marginTop: '15px',
              padding: '14px 28px',
              fontSize: 16,
              fontWeight: 600,

              borderRadius: '1000px',
              background: 'linear-gradient(135deg,rgb(213, 34, 233) 1.93%,rgb(235, 197, 27))',
              transition: 'background .2s ease, transform .2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                filter: 'brightness(1.1)',
                boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <Link
              key={film.kinopoiskId}
              to={`/videos/${film.kinopoiskId}`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              Все Видео
            </Link>
          </Button>
        )}
      </section>
      <MovieStaff movieId={id} />
      <section>
        <Typography variant="h5" gutterBottom>
          {`Факты о ${typeSingleContentHandler(film.type)}:`}
        </Typography>
        <MovieFacts movieId={id} />
      </section>
      <section>
        <MovieReviews movieId={id} />
      </section>
    </div>
  );
};

export default MovieCard;
