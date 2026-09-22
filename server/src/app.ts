import express from 'express';
import branchesRoutes from './routes/BranchesRoutes';
import lessonsRoutes from './routes/LessonsRountes';
import usersRoutes from './routes/UsersRoutes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/branches', branchesRoutes);
app.use('/lessons', lessonsRoutes);
app.use('/users', usersRoutes);

export default app;

app.listen(3000, "0.0.0.0", () => {
    console.log('Server is running on port 3000');
});
