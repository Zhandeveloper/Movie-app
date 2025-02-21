import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface MoviesFactsProps {
  movieId?: string;
}

interface Fact {
  text: string;
  type?: string;
  spoiler: boolean;
}

const removeHtmlTags = (text: string) => {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.body.textContent || '';
};

const MovieFacts: React.FC<MoviesFactsProps> = ({ movieId }) => {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [expandedFacts, setExpandedFacts] = useState<{ [key: number]: boolean }>({});
  const [maxLength, setMaxLength] = useState(700);

  useEffect(() => {
    if (!movieId) return;
    const fetchMovieFacts = async (id: string) => {
      try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/facts`, {
          method: 'GET',
          headers: {
            'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setFacts(data.items || []);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchMovieFacts(movieId);
  }, [movieId]);

  useEffect(() => {
    const handleResize = () => {
      setMaxLength(window.innerWidth < 768 ? 50 : 700);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedFacts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Box>
      {facts.length > 0 ? (
        <>
          {facts.slice(0, visibleCount).map((fact, index) => {
            const text = removeHtmlTags(fact.text);
            const isExpanded = expandedFacts[index];
            const displayText = fact.spoiler 
              ? isExpanded 
                ? text 
                : text.slice(0, 10) + '...'
              : isExpanded 
                ? text 
                : text.length > maxLength
                  ? text.slice(0, maxLength) + '...'
                  : text;
            const shouldShowButton = text.length > maxLength && !fact.spoiler;

            return (
              <Card
                key={index}
                sx={{ mb: 2.5, backgroundColor: fact.spoiler ? 'rgba(255, 0, 0, 0.1)' : 'rgb(28, 28, 53)' }}
              >
                <CardContent sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  {fact.spoiler && (
                    <Typography variant="body2" color="red" fontWeight="bold">
                      СПОЙЛЕР
                    </Typography>
                  )}
                  <Typography
                    variant="body1"
                    sx={{ fontSize: '20px', cursor: fact.spoiler ? 'pointer' : 'default' }}
                    onClick={() => fact.spoiler && toggleExpand(index)}
                  >
                    {`${index + 1}) `}
                    {displayText}
                  </Typography>
                  {!fact.spoiler && shouldShowButton && (
                    <Button onClick={() => toggleExpand(index)} sx={{ mt: 1 }}>
                      {isExpanded ? 'Скрыть' : 'Развернуть'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {visibleCount < facts.length && (
            <Button onClick={() => setVisibleCount((prev) => prev + 5)} variant="contained" sx={{ mt: 2 }}>
              Показать еще факты
            </Button>
          )}
        </>
      ) : (
        <Typography>Фактов пока нет.</Typography>
      )}
    </Box>
  );
};

export default MovieFacts;
