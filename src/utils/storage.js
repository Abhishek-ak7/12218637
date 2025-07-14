export const saveUrls = (urls) => {
  localStorage.setItem('shortenedUrls', JSON.stringify(urls));
};

export const loadUrls = () => {
  const stored = localStorage.getItem('shortenedUrls');
  return stored ? JSON.parse(stored) : [];
};

export const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};