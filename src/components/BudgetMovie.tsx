import React, { useEffect, useState } from 'react';
import { Button, Typography, List, ListItem, CircularProgress, Alert } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';

interface BudgetMovieProps {
  movieId?: string;
}

interface BudgetProperties {
  type: string;
  amount: number;
  currencyCode?: string;
  name?: string;
  symbol?: string;
}

const CurrencyTypeHandler = (type?: string): string => {
  switch (type) {
    case 'USA':
      return 'Сборы в США';
    case 'WORLD':
      return 'Мировые сборы';
    case 'BUDGET':
      return 'Бюджет';
    case 'RUS':
      return 'Сборы в России';
      case 'MARKETING':
        return 'Траты на маркетинг';
    default:
      return 'Неизвестно';
  }
};

const BudgetMovie: React.FC<BudgetMovieProps> = ({ movieId }) => {
  const [budgetData, setBudgetData] = useState<BudgetProperties[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBudget, setShowBudget] = useState<boolean>(false);

  useEffect(() => {
    if (!movieId) return;

    setLoading(true);
    setError(null);
    setShowBudget(false); // Сбрасываем состояние при смене фильма

    const fetchBudgetData = async () => {
      try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/box_office`, {
          headers: {
            'X-API-KEY': '8c8e1a50-6322-4135-8875-5d40a5420d86',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const data = await response.json();
        // Фильтруем данные: убираем объекты, у которых amount === 0
        const filteredData = data.items.filter((item: BudgetProperties) => item.amount > 0);
        setBudgetData(filteredData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [movieId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Ошибка: {error}</Alert>;
  if (budgetData.length === 0) return null;

  return (
    <div>
      <Button
        sx={{
          margin: '15px 10px',
          fontSize: '15px',
          color: 'white',
          height: 52,
          marginRight: 8,
          padding: '14px 28px',
          fontWeight: 500,
          borderRadius: '12px',
          background: 'linear-gradient(135deg,rgb(10, 113, 216) 9.93%,rgb(129, 15, 216))',
          transition: 'background .2s ease, transform .2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            filter: 'brightness(1.1)',
            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
        variant="contained"
        onClick={() => setShowBudget(!showBudget)}
      >
        {showBudget ? 'Скрыть бюджет' : 'Отобразить бюджет'}
        {!showBudget && <PaidIcon sx={{ marginLeft: '3px' }} />}
      </Button>
      {showBudget && (
        <div>
          <List>
            {budgetData.map((item, index) => (
              <ListItem key={index}>
                <Typography variant="h5">
                  {CurrencyTypeHandler(item.type)}: {item.symbol}
                  {item.amount.toLocaleString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default BudgetMovie;
