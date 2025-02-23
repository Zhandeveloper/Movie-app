import { Box } from '@mui/material';
import CoPresentIcon from '@mui/icons-material/CoPresent';
const Footer = () => {
  return (
    <Box
      sx={{
        fontFamily: 'roboto',
        color: 'white',
        fontSize: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap:'7px',
        marginTop: '20px',
        borderTop: '4px solid white',
        backgroundColor: 'rgb(20, 43, 127)',
        height:'100px'
      }}
    >
      <CoPresentIcon sx={{fontSize:'32px'}}/> 
      <span>
      
         Author -</span> {/* Обернул в <span>, чтобы правильно выровнять */}
      <a
        href="https://t.me/Zhan2018"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: '#ffa500', marginLeft: '5px' }} 
      >
        Zhan
      </a>
    </Box>
  );
};

export default Footer;
