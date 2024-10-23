// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import http from 'http';
// import { Server } from 'socket.io';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// // import adminRoutes from './routes/adminRoutes.js';
// import employeeRoutes from './routes/employeeRoutes.js';
// import attendanceRoutes_employee from './routes/attendance_employee.js';
// import salesRoutes from './routes/sales.js';
// import productRoutes from './routes/product_routes.js';
// import meetingRoutes from './routes/meeeting.js';
// import taskEmployeeRoutes from './routes/task_employee.js';
// import notificationRoutes from './routes/notifications.js';
// import teamLeadRoutes from './routes/teamLeadRoutes.js';
// import leadRoutes from './routes/lead.js'
// import usertypeRoute from './routes/usertype.js'
// import notesRouter from './routes/Notes.js'


// dotenv.config();

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(cors({
//   origin: '*',  
// }));

//  app.use(bodyParser.json());
//  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//  const server = http.createServer(app);
//  const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'], 
//   },
//  });

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// // app.use('/api', adminRoutes);
// app.use('/api', employeeRoutes);
// app.use('/api', attendanceRoutes_employee);
// app.use('/api', salesRoutes);
// app.use('/api', productRoutes);
// app.use('/api', meetingRoutes);
// app.use('/api', taskEmployeeRoutes);
// app.use('/api', notificationRoutes);
// app.use('/api', leadRoutes);
// app.use('/api',usertypeRoute)
// app.use('/api',notesRouter)
// app.use('/api',teamLeadRoutes)

// app.use((req, res) => {
//   res.status(404).send({ message :'You are hitting a wrong API for CRM Panel'});
// });





// const PORT =5000; // Use environment variable or default to 5000
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });





import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import attendanceRoutes_employee from './routes/attendance_employee.js';
import salesRoutes from './routes/sales.js';
import productRoutes from './routes/product_routes.js';
import meetingRoutes from './routes/meeeting.js';
import taskEmployeeRoutes from './routes/task_employee.js';
import notificationRoutes from './routes/notifications.js';
import teamLeadRoutes from './routes/teamLeadRoutes.js';
import leadRoutes from './routes/lead.js';
import usertypeRoute from './routes/usertype.js';
import notesRouter from './routes/Notes.js';


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: '*',  
}));

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'], 
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use('/api', adminRoutes);
app.use('/api', employeeRoutes);
app.use('/api', attendanceRoutes_employee);
app.use('/api', salesRoutes);
app.use('/api', productRoutes);
app.use('/api', meetingRoutes);
app.use('/api', taskEmployeeRoutes);
app.use('/api', notificationRoutes);
app.use('/api', leadRoutes);
app.use('/api', usertypeRoute);
app.use('/api', notesRouter);
app.use('/api', teamLeadRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'You are hitting a wrong API for CRM Panel' });
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000
server.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting the server:', err);
  } else {
    console.log(`Server started on port ${PORT}`);
  }
});
