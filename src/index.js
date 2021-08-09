import 'core-js/stable';
import 'regenerator-runtime/runtime';
import app from './app';

app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${process.env.PORT || 8080}`);
});
