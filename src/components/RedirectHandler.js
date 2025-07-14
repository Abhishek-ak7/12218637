import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { Error } from '@mui/icons-material';
import Log from '../utils/logger';
import { loadUrls, saveUrls } from '../utils/storage';

const RedirectHandler = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    const handleRedirect = () => {
      const urls = loadUrls();
      const urlData = urls.find(u => u.shortCode === shortCode);

      if (!urlData) {
        Log('frontend', 'warn', 'component', `Short code not found: ${shortCode}`);
        return;
      }

      if (new Date() > new Date(urlData.expiryDate)) {
        Log('frontend', 'warn', 'component', `Expired URL accessed: ${shortCode}`);
        return;
      }

      const clickData = {
        timestamp: new Date(),
        source: document.referrer || 'Direct',
        location: 'Local'
      };

      urlData.clicks += 1;
      urlData.clickData = urlData.clickData || [];
      urlData.clickData.push(clickData);

      const updatedUrls = urls.map(u => u.id === urlData.id ? urlData : u);
      saveUrls(updatedUrls);

      Log('frontend', 'info', 'component', `Redirecting to: ${urlData.longUrl}`);
      window.location.href = urlData.longUrl;
    };

    handleRedirect();
  }, [shortCode]);

  const urls = loadUrls();
  const urlData = urls.find(u => u.shortCode === shortCode);

  if (!urlData) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Error color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          URL Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The short URL you're looking for doesn't exist.
        </Typography>
      </Container>
    );
  }

  if (new Date() > new Date(urlData.expiryDate)) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Error color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          URL Expired
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This short URL has expired and is no longer valid.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <CircularProgress size={64} sx={{ mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Redirecting...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        You will be redirected to your destination shortly.
      </Typography>
    </Container>
  );
};

export default RedirectHandler;