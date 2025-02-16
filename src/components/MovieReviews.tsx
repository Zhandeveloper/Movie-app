import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, Button, useMediaQuery } from '@mui/material';

interface Review {
  authorId: number;
  author: string;
  date: string;
  description: string;
}

interface AmountReviews {
  totalPositiveReviews: number;
  totalNegativeReviews: number;
  totalNeutralReviews: number;
}

interface MovieReviewsProps {
  movieId?: string;
}

const removeHtmlTags = (text: string) => text.replace(/<\/?[^>]+(>|$)/g, ''); // Убирает HTML-теги

const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [amountReviews, setAmountReviews] = useState<AmountReviews | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});

  const isMobile = useMediaQuery('(max-width:1000px)'); // Определяем мобильное устройство
  const MAX_DESCRIPTION_LENGTH = isMobile ? 200 : 700; // 200 символов для телефонов, 700 для ПК

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/reviews?page=1&order=USER_POSITIVE_RATING_DESC`,
          {
            method: 'GET',
            headers: {
              'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) throw new Error('Ошибка загрузки отзывов');

        const data = await response.json();
        setAmountReviews({
          totalPositiveReviews: data.totalPositiveReviews,
          totalNegativeReviews: data.totalNegativeReviews,
          totalNeutralReviews: data.totalNeutralReviews,
        });
        setReviews(data.items.slice(0, 10)); 
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  const toggleExpand = (index: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Отзывы
      </Typography>
      <Typography variant="h6">Всего позитивных отзывов: <span style={{color:'lime'}}>{amountReviews?.totalPositiveReviews ?? 'Неизвестно'}</span></Typography>
      <Typography variant="h6">Всего негативных отзывов: <span style={{color:'red'}}>{amountReviews?.totalNegativeReviews ?? 'Неизвестно'}</span></Typography>
      <Typography variant="h6">Всего нейтральных отзывов: <span style={{color:'#0BB7DB'}}>{amountReviews?.totalNeutralReviews ?? 'Неизвестно'}</span></Typography>

      {reviews.length === 0 ? (
        <Typography>Отзывов пока нет.</Typography>
      ) : (
        reviews.map((review, index) => {
          const cleanDescription = removeHtmlTags(review.description);
          const isExpanded = expandedReviews[index];
          const shouldShowButton = cleanDescription.length > MAX_DESCRIPTION_LENGTH;

          return (
            <Card key={index} sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ color: 'white' }}>
                  {new Date(review.date).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: 'white', cursor: 'pointer' }}
                  onClick={() =>
                    window.open(`https://www.kinopoisk.ru/film/${movieId}/reviews/?ord=rating&rnd`, '_blank')
                  }
                >
                  {review.author}
                </Typography>
                <Typography variant="body2" color="text.primary" sx={{ color: 'white', fontSize: '20px' }}>
                  {isExpanded ? cleanDescription : `${cleanDescription.slice(0, MAX_DESCRIPTION_LENGTH)}...`}
                </Typography>
                {shouldShowButton && (
                  <Button onClick={() => toggleExpand(index)} color="primary">
                    {isExpanded ? 'Скрыть' : 'Показать еще'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default MovieReviews;
