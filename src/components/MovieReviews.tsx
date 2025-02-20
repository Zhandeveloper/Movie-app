import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  useMediaQuery,
  Select,
  MenuItem,
} from '@mui/material';

interface Review {
  authorId: number;
  author: string;
  type: string;
  date: string;
  title: string;
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

const removeHtmlTags = (text: string) => text.replace(/<\/?[^>]+(>|$)/g, '');

const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [amountReviews, setAmountReviews] = useState<AmountReviews | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<string>('USER_POSITIVE_RATING_DESC');
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const isMobile = useMediaQuery('(max-width:1000px)');
  const MAX_DESCRIPTION_LENGTH = isMobile ? 200 : 700;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/reviews?page=1&order=${sortOrder}`,
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
        setReviews(data.items);
        setVisibleCount(10);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId, sortOrder]);


  const totalReviews =
  (amountReviews?.totalPositiveReviews ?? 0) +
  (amountReviews?.totalNegativeReviews ?? 0) +
  (amountReviews?.totalNeutralReviews ?? 0);

  const calculatePercentage = (count: number) =>
    totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(2) : '0';

  const toggleExpand = (index: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredReviews = selectedType === 'ALL' ? reviews : reviews.filter((review) => review.type === selectedType);
  const visibleReviews = filteredReviews.slice(0, visibleCount);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Отзывы:
      </Typography>

      {amountReviews && (
        <Box sx={{ mb: 2, color: 'white' }}>
          <Typography variant="h6">
            Всего позитивных отзывов:{' '}
            <span style={{ color: 'lime' }}>
              {amountReviews?.totalPositiveReviews ?? 'Неизвестно'} ({calculatePercentage(amountReviews?.totalPositiveReviews ?? 0)}%)
            </span>
          </Typography>
          <Typography variant="h6">
            Всего негативных отзывов:{' '}
            <span style={{ color: 'red' }}>
              {amountReviews?.totalNegativeReviews ?? 'Неизвестно'} ({calculatePercentage(amountReviews?.totalNegativeReviews ?? 0)}%)
            </span>
          </Typography>
          <Typography variant="h6">
            Всего нейтральных отзывов:{' '}
            <span style={{ color: '#0BB7DB' }}>
              {amountReviews?.totalNeutralReviews ?? 'Неизвестно'} ({calculatePercentage(amountReviews?.totalNeutralReviews ?? 0)}%)
            </span>
          </Typography>
        </Box>
      )}

      <Box sx={{ marginLeft: '10px' }}>
        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          sx={{ mb: 2, backgroundColor: 'white' }}
        >
          <MenuItem value="ALL">Все</MenuItem>
          <MenuItem value="POSITIVE">Позитивные</MenuItem>
          <MenuItem value="NEGATIVE">Негативные</MenuItem>
          <MenuItem value="NEUTRAL">Нейтральные</MenuItem>
        </Select>

        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          sx={{ mb: 2, ml: 2, backgroundColor: 'white' }}
        >
          <MenuItem value="USER_POSITIVE_RATING_DESC">Лучшие отзывы</MenuItem>
          <MenuItem value="DATE_DESC">Новые</MenuItem>
          <MenuItem value="DATE_ASC">Старые</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : visibleReviews.length === 0 ? (
        <Typography>Отзывов пока нет.</Typography>
      ) : (
        <>
          {visibleReviews.map((review, index) => {
            const cleanDescription = removeHtmlTags(review.description);
            const isExpanded = expandedReviews[index];
            const shouldShowButton = cleanDescription.length > MAX_DESCRIPTION_LENGTH;
            const backgroundColor =
              review.type === 'POSITIVE'
                ? 'rgba(51, 165, 43, 0.45)'
                : review.type === 'NEGATIVE'
                ? 'rgba(113, 21, 21, 0.54)'
                : 'rgba(255,255,255,0.1)';

            return (
              <Card key={index} sx={{ mb: 2, backgroundColor, borderRadius: '8px' }}>
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
                  <Typography variant="h6" fontWeight="500" sx={{ color: '#3878EB' }}>
                    {review.title}
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
          })}
          {visibleCount < filteredReviews.length && (
            <Button onClick={() => setVisibleCount((prev) => prev + 5)} variant="contained" sx={{ mt: 2 }}>
              Отоброзить ещё
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default MovieReviews;
