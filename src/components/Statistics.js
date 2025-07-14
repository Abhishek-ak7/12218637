import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Card, CardContent, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Timeline, Link } from '@mui/icons-material';
import Log from '../utils/logger';
import { loadUrls } from '../utils/storage';

const Statistics = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const storedUrls = loadUrls();
      setUrls(storedUrls);
      Log('frontend', 'info', 'component', 'Loaded statistics data');
    };
    
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatLocation = (clickData) => {
    return clickData.location || 'Unknown';
  };

  const formatSource = (clickData) => {
    return clickData.source || 'Direct';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <BarChart color="primary" />
          <Typography variant="h4">URL Statistics</Typography>
        </Box>

        {urls.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No URLs have been shortened yet.
          </Typography>
        ) : (
          urls.map((url) => (
            <Card key={url.id} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Link color="primary" />
                  <Typography variant="h6" color="primary">
                    {url.shortUrl}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Original: {url.longUrl}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Created: ${new Date(url.createdAt).toLocaleString()}`} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`Expires: ${new Date(url.expiryDate).toLocaleString()}`} 
                    size="small" 
                    variant="outlined" 
                    color="warning"
                  />
                  <Chip 
                    label={`Total Clicks: ${url.clicks}`} 
                    size="small" 
                    color="primary"
                  />
                  <Chip 
                    label={new Date(url.expiryDate) > new Date() ? 'Active' : 'Expired'} 
                    size="small" 
                    color={new Date(url.expiryDate) > new Date() ? 'success' : 'error'}
                  />
                </Box>

                {url.clickData && url.clickData.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Timeline color="action" />
                      <Typography variant="h6">Click Details</Typography>
                    </Box>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {url.clickData.map((click, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(click.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{formatSource(click)}</TableCell>
                              <TableCell>{formatLocation(click)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {(!url.clickData || url.clickData.length === 0) && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No clicks recorded yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default Statistics;