import { Box, MenuItem, SelectChangeEvent, Select } from '@mui/material';
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
import Footer from '../components/Footer';

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

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const NameConvertHanlder = (category?: string): string => {
  switch (category) {
    case 'TOP_250_TV_SHOWS':
      return 'Топ лучших сериалов';
    case 'TOP_250_MOVIES':
      return 'Топ лучших фильмов';
    case 'TOP_POPULAR_ALL':
      return 'Топ популярных фильмов и сериалов';
    case 'COMICS_THEME':
      return 'Фильмы по комиксам';
    case 'VAMPIRE_THEME':
      return 'Фильмы про вампиров';
    case 'TOP_POPULAR_MOVIES':
      return 'Топ популярных фильмов';
    default:
      return 'Результаты поиска';
  }
};

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
        margin: { xs: '9px', sm: '9px', md: '9px', lg: '9px', xl: '10px' },
        width: { xs: '270px', sm: '300px', md: '350px', lg: '370px', xl: '400px' },
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
          в кинопоиске
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
  const [isSearch, setIsSearch] = useState<boolean>(false); // Track if results are from search

  useEffect(() => {
    const savedFilms = localStorage.getItem('lastSearchResults');
    if (savedFilms) {
      const parsedFilms = JSON.parse(savedFilms);
      setFilms(parsedFilms);
      setIsSearch(true);
      // Fetch total pages for saved search
      const savedFilters = localStorage.getItem('lastSearchFilters');
      if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        fetchSearchFilms(filters, filters.page || 1);
      }
    } else {
      fetchFilms(category, currentPage);
      setIsSearch(false);
    }
    scrollToTop();
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
      setIsSearch(false);
      localStorage.removeItem('lastSearchResults');
      localStorage.removeItem('lastSearchFilters');
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const fetchSearchFilms = async (filters: any, page: number) => {
    const params = new URLSearchParams();
    if (filters.country) params.append('countries', filters.country.toString());
    if (filters.genre) params.append('genres', filters.genre.toString());
    params.append('order', filters.order || 'RATING');
    params.append('type', filters.type || 'ALL');
    params.append('ratingFrom', filters.ratingFrom || '0');
    params.append('ratingTo', filters.ratingTo || '10');
    params.append('yearFrom', filters.yearFrom || '1000');
    params.append('yearTo', filters.yearTo || '3000');
    if (filters.query && filters.query.trim()) params.append('keyword', filters.query);
    params.append('page', page.toString());

    try {
      const res = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films?${params}`, {
        headers: {
          'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      const formatted: Film[] = data.items.map((film: any) => ({
        kinopoiskId: film.kinopoiskId,
        nameRu: film.nameRu,
        genres: film.genres,
        posterUrlPreview: film.posterUrlPreview,
        ratingKinopoisk: film.ratingKinopoisk ?? undefined,
        ratingImdb: film.ratingImdb ?? undefined,
      }));
      setFilms(formatted);
      setTotalPages(data.totalPages || 1);
      setIsSearch(true);
      localStorage.setItem('lastSearchResults', JSON.stringify(formatted));
      localStorage.setItem('lastSearchFilters', JSON.stringify({ ...filters, page }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (searchResults: Film[], searchTotalPages: number) => {
    setFilms(searchResults);
    setTotalPages(searchTotalPages);
    setCurrentPage(1);
    setIsSearch(true);
    localStorage.setItem('lastSearchResults', JSON.stringify(searchResults));
  };

  const handlePageChange = (event: SelectChangeEvent<number>) => {
    const page = Number(event.target.value);
    setCurrentPage(page);
    if (isSearch) {
      const savedFilters = localStorage.getItem('lastSearchFilters');
      if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        fetchSearchFilms(filters, page);
      }
    }
  };

  return (
    <>
      <Navbar
        onCategoryChange={(newCategory) => {
          setCategory(newCategory);
          localStorage.removeItem('lastSearchResults');
          localStorage.removeItem('lastSearchFilters');
          setIsSearch(false);
          setCurrentPage(1);
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

      {films.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            gap: { xs: '50px', sm: '70px', md: '80px', lg: '100px', xl: '100px' },
            marginTop: '40px',
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1);
              setCurrentPage(newPage);
              if (isSearch) {
                const savedFilters = localStorage.getItem('lastSearchFilters');
                if (savedFilters) {
                  const filters = JSON.parse(savedFilters);
                  fetchSearchFilms(filters, newPage);
                }
              }
            }}
            disabled={currentPage === 1}
          >
            {currentPage > 1 && <WestIcon sx={{ padding: '10px', fontSize: { xs: '25px', xl: '35px' } }} />}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{NameConvertHanlder(isSearch ? 'SEARCH' : category)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: 1 }}>
              <Typography variant="subtitle1">Страница</Typography>
              <Select
                value={currentPage}
                onChange={handlePageChange}
                sx={{
                  color: 'white',
                  border: '1px solid orange',
                  width: '75px',
                  borderRadius: '4px',
                  '& .MuiSelect-icon': { color: 'orange' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'rgb(28, 28, 53)',
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255, 165, 0, 0.2)' },
                      },
                    },
                  },
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <MenuItem key={page} value={page}>
                    {page}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="subtitle1">из {totalPages}</Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              const newPage = currentPage + 1;
              setCurrentPage(newPage);
              if (isSearch) {
                const savedFilters = localStorage.getItem('lastSearchFilters');
                if (savedFilters) {
                  const filters = JSON.parse(savedFilters);
                  fetchSearchFilms(filters, newPage);
                }
              }
            }}
            disabled={currentPage >= totalPages}
          >
            <EastIcon sx={{ padding: '10px', fontSize: { xs: '25px', xl: '35px' } }} />
          </Button>
        </Box>
      )}
      <Footer />
    </>
  );
};

export default Home;