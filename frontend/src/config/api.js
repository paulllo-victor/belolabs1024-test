// Configuração da API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Configuração dos endpoints
export const ENDPOINTS = {
  SAVE_GAME: '/api/memory/save',
  GET_RESULTS: '/api/memory/results'
};

// Função reutilizável para salvar dados do jogo
export const saveGameData = async (gameData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}${ENDPOINTS.SAVE_GAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Game data saved successfully', data);
    return data;
  } catch (error) {
    console.error('Error saving game data:', error);
    throw error;
  }
}; 