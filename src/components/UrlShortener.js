import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Box, Typography, Alert, Card, CardContent, Chip } from '@mui/material';
import { ContentCopy, Link } from '@mui/icons-material';
import Log from '../utils/logger';
import { saveUrls, loadUrls, generateShortCode, isValidUrl } from '../utils/storage';

const UrlShortener = () => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', customCode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', customCode: '' }]);
      Log('frontend', 'info', 'component', 'Added new URL field');
    }
  };

  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const validateInputs = () => {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      if (!url.longUrl.trim()) continue;
      
      if (!isValidUrl(url.longUrl)) {
        setError(`Invalid URL format at position ${i + 1}`);
        return false;
      }
      
      if (url.validity && (isNaN(url.validity) || parseInt(url.validity) <= 0)) {
        setError(`Invalid validity period at position ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const shortenUrls = async () => {
    setError('');
    
    if (!validateInputs()) {
      Log('frontend', 'error', 'component', 'URL validation failed');
      return;
    }

    const existingUrls = loadUrls();
    const newResults = [];
    const usedCodes = new Set(existingUrls.map(u => u.shortCode));

    for (const url of urls) {
      if (!url.longUrl.trim()) continue;

      let shortCode = url.customCode || generateShortCode();
      
      while (usedCodes.has(shortCode)) {
        shortCode = generateShortCode();
      }
      
      usedCodes.add(shortCode);
      
      const validity = parseInt(url.validity) || 30;
      const expiryDate = new Date(Date.now() + validity * 60000);
      
      const shortenedUrl = {
        id: Date.now() + Math.random(),
        longUrl: url.longUrl,
        shortCode,
        shortUrl: `http://localhost:3000/${shortCode}`,
        createdAt: new Date(),
        expiryDate,
        clicks: 0,
        clickData: []
      };

      newResults.push(shortenedUrl);
      existingUrls.push(shortenedUrl);
    }

    saveUrls(existingUrls);
    setResults(newResults);
    setUrls([{ longUrl: '', validity: '', customCode: '' }]);
    
    Log('frontend', 'info', 'component', `Successfully shortened ${newResults.length} URLs`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Log('frontend', 'info', 'component', 'URL copied to clipboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          URL Shortener
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {urls.map((url, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>URL {index + 1}</Typography>
            <TextField
              fullWidth
              label="Long URL"
              value={url.longUrl}
              onChange={(e) => updateUrl(index, 'longUrl', e.target.value)}
              sx={{ mb: 2 }}
              placeholder="https://example.com"
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Validity (minutes)"
                type="number"
                value={url.validity}
                onChange={(e) => updateUrl(index, 'validity', e.target.value)}
                placeholder="30"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Custom Short Code"
                value={url.customCode}
                onChange={(e) => updateUrl(index, 'customCode', e.target.value)}
                placeholder="optional"
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {urls.length < 5 && (
            <Button variant="outlined" onClick={addUrlField}>
              Add Another URL
            </Button>
          )}
          <Button variant="contained" onClick={shortenUrls}>
            Shorten URLs
          </Button>
        </Box>

        {results.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>Results</Typography>
            {results.map((result) => (
              <Card key={result.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Link color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {result.longUrl}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      {result.shortUrl}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(result.shortUrl)}
                    >
                      Copy
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`Created: ${result.createdAt.toLocaleString()}`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Expires: ${result.expiryDate.toLocaleString()}`} 
                      size="small" 
                      variant="outlined" 
                      color="warning"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UrlShortener;