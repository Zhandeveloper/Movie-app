import { Box, Button, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Film {
  filmId: number;
  nameRu: string;
  nameEn: string;
  rating: string;
  general: boolean;
  description: string;
  professionKey: 'DESIGN' | 'DIRECTOR' | 'EDITOR' | 'OPERATOR' | 'PRODUCER';
}

interface Person {
  personId: number;
  webUrl?: string;
  nameRu?: string;
  nameEn?: string;
  sex?: 'MALE' | 'FEMALE';
  posterUrl?: string;
  growth?: number;
  birthday?: string;
  death?: string | null;
  age?: number;
  birthplace?: string;
  deathplace?: string | null;
  spouses?: {
    personId: number;
    name: string;
    divorced: boolean;
    divorcedReason: string;
    sex: 'MALE' | 'FEMALE';
    children: number;
    webUrl: string;
    relation: string;
  }[];
  hasAwards?: number;
  profession?: string;
  facts?: string[];
  films: Film[];
}

const StaffCard = () => {
  function formatDate(birthday: string): string {
    const date = new Date(birthday);
    if (isNaN(date.getTime())) {
      throw new Error('Некорректная дата');
    }

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const { id } = useParams();
  const [person, setPerson] = useState<Person | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const filmsPerPage = 10;

  const sortFilmsByRating = (films: Film[]) => {
    return films.sort((a, b) => {
      const ratingA = a.rating ? parseFloat(a.rating) : 0;
      const ratingB = b.rating ? parseFloat(b.rating) : 0;
      return ratingB - ratingA;
    });
  };

  const sortedFilms = sortFilmsByRating(person?.films || []);
  const startIndex = currentPage * filmsPerPage;
  const endIndex = startIndex + filmsPerPage;
  const currentFilms = sortedFilms.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (endIndex < (person?.films.length || 0)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPersonData(Number(id));
    }
  }, [id]);

  const fetchPersonData = async (id: number) => {
    try {
      const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff/${id}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setPerson(data);
    } catch (error) {
      console.error('Ошибка загрузки данных человека:', error);
    }
  };

  return (
    <Box sx={{ fontFamily: 'roboto', color: 'white', backgroundColor: 'rgb(28, 28, 53)' }}>
      <IconButton
        onClick={() => window.history.back()}
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
        <KeyboardBackspaceIcon sx={{ fontSize: '37px' }} />
      </IconButton>
      <Box sx={{ marginLeft: '1%', display: 'flex' }}>
        {person ? (
          <>
            <div>
              <Typography variant="h2" gutterBottom>
                {person.nameRu || person.nameEn}
              </Typography>
              <img src={person.posterUrl} alt={person.nameRu} />
              <Typography variant="h5">Профессия: {person.profession}</Typography>
              <Button
                sx={{
                  color: 'white',
                  height: 52,
                  margin: '4px',
                  padding: '14px 28px',
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: 20,
                  borderRadius: '1000px',
                  background: 'linear-gradient(135deg, #f50 69.93%, #d6bb00)',
                  transition: 'background .2s ease, transform .2s ease',
                  textTransform: 'none',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'brightness(1.1)',
                    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
                  },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`https://www.kinopoisk.ru/name/${person.personId}`);
                }}
              >
                <PersonIcon sx={{ marginRight: '4px' }} /> В Кинопоиске
              </Button>
            </div>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: '30px',
                marginLeft: '8%',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <p>Возраст: {person.age} лет</p>
              <p>Место рождения: {person.birthplace}</p>
              <p>Дата рождения: {person.birthday ? formatDate(person.birthday) : 'Неизвестно'}</p>
              <p>Рост: {person.growth === 0 ? 'неизвестно' : `${person.growth} см`}</p>
            </Box>
          </>
        ) : (
          <Typography variant="h6">Загрузка данных...</Typography>
        )}
      </Box>
      <section
        style={{
          margin: '5px',
          marginTop: '1.5%',
          display: 'flex',
          border: '2px solid white',
          flexDirection: 'column',
          padding: '16px',
          borderRadius: '12px',
        }}
      >
        {person?.films && person.films.length > 0 ? (
          <>
            <Typography variant="h5" gutterBottom>
              Фильмы с участием:
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '8px 0' }}>
              {currentFilms
                .filter((film, index, self) => index === self.findIndex((f) => f.nameRu === film.nameRu)) // Убираем дубликаты по названию фильма
                .map((film, index) => (
                  <Box
                    key={index}
                    sx={{
                      minWidth: '200px',
                      flexShrink: 0,
                      padding: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background .2s ease, transform .2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        filter: 'brightness(1.1)',
                        boxShadow: '0px 5px 10px rgba(56, 46, 46, 0.2)',
                      },
                    }}
                  >
                    <Link
                      to={`/film/${film.filmId}`}
                      style={{ textDecoration: 'none', color: 'white', display: 'block' }}
                    >
                      <Typography variant="subtitle1">{film.nameRu || 'Название неизвестно'}</Typography>
                      <Typography variant="body2">Рейтинг: {film.rating || 'нет'}</Typography>
                    </Link>
                  </Box>
                ))}
            </div>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <IconButton onClick={handlePrevious} disabled={currentPage === 0}>
                <ArrowBackIosIcon sx={{ fontSize: '30px', color: 'white' }} />
              </IconButton>
              <Typography sx={{ color: 'white', margin: '0 15px' }}>
                Страница {currentPage + 1} из {Math.ceil(person.films.length / filmsPerPage)}
              </Typography>
              <IconButton onClick={handleNext} disabled={endIndex >= person.films.length}>
                <ArrowForwardIosIcon sx={{ fontSize: '30px', color: 'white' }} />
              </IconButton>
            </Box>
          </>
        ) : (
          <Typography variant="h5">Нет данных о фильмах</Typography>
        )}
      </section>

      <section>
        {person?.facts && person.facts.length > 0 && (
          <Box
            sx={{
              marginTop: '2%',
              width: '100%',
              fontSize: '26px',
              marginLeft: '0%',
            }}
          >
            <h3 style={{ margin: 5 }}>Интересные факты:</h3>
            <ul style={{ listStyleType: 'none' }}>
              {person.facts.map((fact, index) => (
                <li key={index} style={{ marginTop: '1.5%' }}>
                  {`${index + 1}) ${fact}`}
                </li>
              ))}
            </ul>
          </Box>
        )}
      </section>
    </Box>
  );
};

export default StaffCard;
