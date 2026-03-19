import express from 'express'
import cors from 'cors'
import { connectDb } from './Utils/db.js'
import dotenv from 'dotenv'
import projectRoutes from './Routes/projectRoutes.js'
import taskRoutes from './Routes/taskRoutes.js'

dotenv.config({})
const app = express();

// CORS — allow all origins for development
app.use(cors());

app.use(express.json())

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

const Port = process.env.PORT || 8000;
app.listen(Port, () => {
  connectDb();
  console.log(`Server is Running On Port ${Port}`);
});