import app from './app'

app.get('/', (req, res) => {
  res.send('Sparkel Backend - 0.0.1');
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening at http://localhost:${process.env.PORT || 8080}`);
});