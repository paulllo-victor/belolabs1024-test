import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Pagination } from '@mui/material';
import { styled } from '@mui/system';
import background from "../assets/images/mode1.gif";

const StyledGameContainer = styled(Box)({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '2rem',
});

const HistoryContainer = styled(Box)({
  backgroundColor: 'rgba(44, 44, 84, 0.95)',
  borderRadius: '15px',
  border: '2px solid #00d9ff',
  padding: '2rem',
  maxWidth: '900px',
  width: '100%',
  marginTop: '2rem',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
});

const PixelTitle = styled(Typography)({
  fontFamily: '"Press Start 2P", cursive',
  color: '#00d9ff',
  textAlign: 'center',
  marginBottom: '2rem',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
});

const PixelButton = styled('button')({
  padding: '10px 20px',
  fontSize: '16px',
  fontFamily: '"Press Start 2P", cursive',
  color: '#fff',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: '2px solid #00d9ff',
  borderRadius: '4px',
  boxShadow: '0 0 10px #00d9ff',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
    boxShadow: '0 0 15px #00d9ff',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 5px #00d9ff',
  },
});

const ResultCard = styled(Box)({
  backgroundColor: 'rgba(26, 26, 46, 0.9)',
  border: '1px solid #00d9ff',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
  color: '#fff',
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '0.8rem',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 217, 255, 0.2)',
  },
});

const StyledPagination = styled(Pagination)({
  marginTop: '2rem',
  '& .MuiPaginationItem-root': {
    color: '#fff',
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '0.8rem',
    '&.Mui-selected': {
      backgroundColor: '#00d9ff',
      color: '#000',
      '&:hover': {
        backgroundColor: '#00d9ff',
      },
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 217, 255, 0.2)',
    },
  },
});

const GameHistory = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/memory/results?page=${page}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        setResults(data.results);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [page]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'normal': return '#FFC107';
      case 'hard': return '#f44336';
      default: return '#fff';
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <StyledGameContainer>
      <PixelButton 
        onClick={() => navigate('/play')} 
        style={{ alignSelf: "flex-start", margin: "16px" }}
      >
        Back
      </PixelButton>

      <PixelTitle variant="h4">Game History</PixelTitle>
      
      <HistoryContainer>
        {loading ? (
          <Typography style={{ color: '#fff', textAlign: 'center' }}>Loading...</Typography>
        ) : results.length === 0 ? (
          <Typography style={{ color: '#fff', textAlign: 'center' }}>No games played yet</Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              {results.map((result, index) => (
                <Grid item xs={12} key={result.id || index}>
                  <ResultCard>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography style={{ color: getDifficultyColor(result.difficulty) }}>
                          {result.difficulty}
                        </Typography>
                        <Typography style={{ opacity: 0.8 }}>
                          {formatDate(result.gameDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography>
                          Failed Attempts: {result.failedAttempts}
                        </Typography>
                        <Typography>
                          Time: {result.timeTaken}s
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography style={{ color: '#00d9ff' }}>
                          Score: {result.score}
                        </Typography>
                        <Typography style={{ color: result.completed ? '#4CAF50' : '#f44336' }}>
                          {result.completed ? '✅ Completed' : '❌ Abandoned'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ResultCard>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center">
                <StyledPagination 
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  size="large"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </HistoryContainer>
    </StyledGameContainer>
  );
};

export default GameHistory; 