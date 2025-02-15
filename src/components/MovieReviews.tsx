import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

interface Review {
  authorId:number;
  author: string;
  date: string;
  description: string;
}

interface MovieReviewsProps {
  movieId?: string;
}

const removeHtmlTags = (text: string) => text.replace(/<\/?[^>]+(>|$)/g, ''); // Убирает все HTML-теги

const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        setReviews(data.items.slice(0, 2)); // Берем первые 2 комментария
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Отзывы
      </Typography>
      {reviews.length === 0 ? (
        <Typography>Отзывов пока нет.</Typography>
      ) : (
        reviews.map((review, index) => (
          <Card key={index} sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ color: 'white' }}>
                {new Date(review.date).toLocaleDateString()}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: 'white', cursor: 'pointer' }}
                onClick={() => window.open(`https://www.kinopoisk.ru/film/${movieId}/reviews/?ord=rating&rnd`, '_blank')}
              >
                {review.author}
              </Typography>

              <Typography variant="body2" color="text.primary" sx={{ color: 'white', fontSize: '20px' }}>
                {removeHtmlTags(review.description)}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MovieReviews;
