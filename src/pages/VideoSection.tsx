import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Video } from './MovieCard';
import { Box, Button, IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const VideosSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/videos`, {
          headers: {
            'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setVideos(data.items);
      } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideos();
    }
  }, [id]);

  return (
    <div style={{backgroundColor: 'rgb(28, 28, 53)',}}>
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
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'roboto',
          fontSize: '30px',
        }}
      >
        {loading ? (
          <p>Загрузка...</p>
        ) : videos.length > 0 ? (
          videos.slice(0, 20).map((video) => (
            <React.Fragment key={video.name}>
              {video.site === 'YOUTUBE' ? (
                <>
                  <Button
                    sx={{
                      color: 'white',
                      height: 52,
                      padding: '14px 28px',
                      fontSize: 16,
                      fontWeight: 550,
                      lineHeight: 20,
                      borderRadius: '1000px',
                      background: 'linear-gradient(135deg,rgb(241, 19, 56) 65.93%,rgb(234, 223, 237))',
                      transition: 'background .2s ease, transform .2s ease',
                      marginBottom: '15px',
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
                    {video.name} - YT
                  </Button>
                  <div
                    style={{
                      width: '75%',
                      height: '700px',
                      marginBottom: '3%',
                      textAlign: 'center',
                      border: '2px solid white',
                      borderRadius: '10px',
                      padding: '2px',
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.url.split('v=')[1]}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: '25px' }}>
                  <Button
                    sx={{
                      color: 'white',
                      height: 45,
                      padding: '14px 28px',
                      fontSize: 16,
                      fontWeight: 550,
                      lineHeight: 12,
                      borderRadius: '1000px',
                      background: 'linear-gradient(135deg,rgb(213, 34, 233) 1.93%,rgb(235, 197, 27))',
                      transition: 'background .2s ease, transform .2s ease',
                      marginBottom: '15px',
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
                    {video.name} - KinopoiskWidget
                  </Button>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <p>Видео не найдено.</p>
        )}
      </Box>
    </div>
  );
};

export default VideosSection;
