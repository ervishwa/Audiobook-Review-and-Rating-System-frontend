import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const AudiobookList = () => {
  const [audiobooks, setAudiobooks] = useState([]);

  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const response = await axios.get('http://localhost:5001/audiobooks');
        setAudiobooks(response.data);
      } catch (error) {
        console.error('Error fetching audiobooks:', error);
      }
    };

    fetchAudiobooks();
  }, []);

  return (
    <Box>
      <Typography variant="h4">Audiobook List</Typography>
      {audiobooks.map((audiobook) => (
        <Box key={audiobook._id} sx={{ mb: 2 }}>
          <Typography variant="h6">
            <Link to={`/audiobooks/${audiobook._id}`} style={{ textDecoration: 'none' }}>
              {audiobook.title}
            </Link>
          </Typography>
          <Typography variant="body2">{audiobook.author}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AudiobookList;
