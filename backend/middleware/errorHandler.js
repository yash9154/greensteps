export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.message === 'Unauthorized') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.message === 'Forbidden') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (err.message === 'Not Found') {
    return res.status(404).json({ error: 'Not Found' });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
};

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
};
