import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import postRoutes from './routes/post.routes';

dotenv.config();

const app = express();

app.set('trust proxy', 1);
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ message: 'Malformed JSON body' });
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send('Sparkel Backend - 0.0.1');
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);

export default app;
