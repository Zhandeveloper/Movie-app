import { Box, Button, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import '../index.scss';

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

interface Video {
  url: string;
  name: string;
  site: string;
}

export interface Staff {
  staffId: number;
  nameRu: string;
  nameEn: string;
  description?: string;
  posterUrl?: string;
  professionText?: string;
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
    return 'Фильм';
  }
  if (content === 'TV_SERIES') {
    return 'Сериал';
  } else {
    return 'Неизвестно';
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
  const [staff, setStaff] = useState<Staff[]>([]);
  const [youtubeTrailers, setYoutubeTrailers] = useState<Video[]>([]);

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

  //Запрос для получение актерского состава фильма
  const fetchStaff = async (id: string) => {
    try {
      const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${id}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setStaff(data.slice(0, 20));
    } catch (error) {
      console.error('Ошибка при загрузке данных актерского состава:', error);
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
      fetchStaff(id);
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
      <header style={{ display: 'flex' }}>
        <div style={{ marginLeft: '2%' }}>
          <h1>{film.nameRu}</h1>
          <img src={film.posterUrl} alt={film.nameRu} style={{ width: '450px' }} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '30px',
            marginLeft: '12%',
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
        </div>
      </header>
      <section style={{ fontSize: '32px' }}>
        <p>{film.description || 'Описание отсутствует.'}</p>
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
            lineHeight: 20,
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
          <PlayArrowIcon />
          Смотреть
        </Button>

        <Button
          sx={{
            color: 'black',
            height: 52,
            marginRight: 8,
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 20,
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
          <PlayArrowIcon />
          Imdb
        </Button>

        <Button
          sx={{
            color: 'white',
            height: 52,
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 20,
            borderRadius: '1000px',
            background: 'linear-gradient(135deg, #0066ff 69.93%, #00c2ff)',
            transition: 'background .2s ease, transform .2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={fetchSimilarMovies}
          disabled={loadingSimilar}
        >
          {loadingSimilar ? 'Загрузка...' : showSimilarMovies ? 'Скрыть' : 'Похожие фильмы'}
        </Button>
      </section>
      {showSimilarMovies && (
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px' }}>Похожие фильмы:</h2>
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
      {youtubeTrailers.length > 0 && (
        <section
          style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <>
            {youtubeTrailers.map((video) => {
              const embedUrl = video.url
                .replace('/v/', '/embed/')
                .replace('www.youtube.com/v/', 'www.youtube.com/embed/');

              return (
                <>
                  <Button
                    sx={{
                      color: 'white',
                      height: 52,
                      padding: '14px 28px',
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: 20,
                      borderRadius: '1000px',
                      background: 'linear-gradient(135deg,rgb(133, 45, 241) 69.93%,rgb(10, 32, 173))',
                      transition: 'background .2s ease, transform .2s ease',
                      marginBottom: '9px',
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
                    {video.name}
                  </Button>
                  <div
                    style={{
                      width: '75%',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '15px',
                      textAlign: 'center',
                    }}
                  >
                    <iframe
                      width="100%"
                      src={embedUrl}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: '4px', height: '750px' }}
                    />
                  </div>
                </>
              );
            })}
          </>
        </section>
      )}
      <h1>Киногруппа:</h1>
      {staff && staff.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {staff.map((item) => (
            <div
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
                key={item.staffId}
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
        <h2>Нету данных</h2>
      )}
    </div>
  );
};

export default MovieCard;
