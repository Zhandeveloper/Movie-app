import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Search from './Search';
import { Film } from '../pages/Home';
interface NavbarProps {
  onCategoryChange: (category: string) => void;
  onSearch: (films: Film[]) => void; // Передаём функцию поиска
}

const Navbar: React.FC<NavbarProps> = ({ onCategoryChange, onSearch }) => {
  return (
    <Box sx={{ flexGrow: 1, margin:0, padding:0 }}>
      <AppBar position="static" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', width: '90%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ width:{ xs: '90%', xl: '70%' } }}>
            <Search onSearch={onSearch} /> {/* Передаём в `Search` */}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '25px', flexWrap: 'wrap' }}>
            <Button
              color="inherit"
              sx={{ fontSize: '21px', textTransform: 'capitalize' }}
              onClick={() => onCategoryChange('TOP_POPULAR_ALL')}
            >
              Топ популярных
            </Button>
            <Button
              color="inherit"
              sx={{ fontSize: '21px', textTransform: 'capitalize' }}
              onClick={() => onCategoryChange('VAMPIRE_THEME')}
            >
              Про Вампиров
            </Button>
            <Button
              color="inherit"
              sx={{ fontSize: '21px', textTransform: 'capitalize' }}
              onClick={() => onCategoryChange('COMICS_THEME')}
            >
              По комиксам
            </Button>
            <Button
              color="inherit"
              sx={{ fontSize: '21px', textTransform: 'capitalize' }}
              onClick={() => onCategoryChange('TOP_250_MOVIES')}
            >
              Лучшие фильмы
            </Button>
            <Button
              color="inherit"
              sx={{ fontSize: '21px', textTransform: 'capitalize' }}
              onClick={() => onCategoryChange('TOP_250_TV_SHOWS')}
            >
              Лучшие сериалы
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Navbar;
