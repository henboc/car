// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http'); 
const cors = require('cors'); 
const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());
const bodyParser = require('body-parser');
const UserRoutes = require('./routes/UserRoutes');
const ProjectRoutes = require('./routes/ProjectRoutes');
const QuestionRoutes = require('./routes/QuestionRoutes');
const AnswerRoutes = require('./routes/AnswerRoutes');
const AnsweredRoutes = require('./routes/AnsweredRoutes');
const NewQuestionRoutes = require('./routes/NewQuestionRoutes');
const GoRoutes = require('./routes/GoRoutes');
const AuthRoutes = require('./routes/authRoutes');
const AlgoRoutes = require('./routes/algoritmsRoutes');
const SummaryRoutes = require('./routes/SummaryRoutes');
const PDFSummaryRoutes = require('./routes/PDFSummaryRoutes');
const UserImageRoutes = require('./routes/UserImageRoutes');
const GraphRoutes = require('./routes/GraphRoutes');
const ProjectGoGate = require('./routes/ProjectGoGateRoutes');
const PrototypeRoutes = require('./routes/PrototypeRoutes');
const PitchDeckRoutes =require('./routes/PitchDeckRoutes');
const HubRoutes =require('./routes/HubRoutes');
const ShareRoutes =require('./routes/ShareRoutes');
const BrandRoutes =require('./routes/BrandRoutes');
const TeamRoutes =require('./routes/TeamRoutes');
const FeedbackRoutes =require('./routes/FeedbackRoutes');
const ScrapRoutes =require('./routes/ScrapRoutes');
const KpiRoutes =require('./routes/KpiRoutes');
const FinishedRoutes =require('./routes/FinishedRoutes');
const Timeline =require('./routes/TimelineRoutes');
const Chat =require('./routes/ChatRoutes');
const Video =require('./routes/VideoRoutes');
const Quote =require('./routes/QuoteRoutes');
const Streak =require('./routes/StreakRoutes');
const Noti =require('./routes/NotificationRoutes');
const UserChecker =require('./routes/UserCheckerRoutes');
const dcfRoutes =require('./routes/FileRoutes');
const WaitlistRoutes =require('./routes/UserWaitlistRoutes');
const EnteredPhaseRoutes =require('./routes/EnteredPhaseRoutes');
const AccelerateRoutes =require('./routes/AccelerateRoutes');
const MailRoutes =require('./routes/MailRoutes');
const fileUpload = require('express-fileupload');
const { setupWebSocket } = require('./controllers/websocket'); 
//Admin

const AdminUserRoutes = require('./routes/Admin/AdminUserRoutes');
const AdminAuthRoutes = require('./routes/Admin/AdminAuthRoutes');
const AdminCustomerRoutes = require('./routes/Admin/UserRoutes');

//Transfer

const TransferRoutes = require('./routes/Transfer/TransferRoutes');

const winston = require('winston');
const EnteredPhase = require('./models/EnteredPhaseModel');

// Define the logger configuration
const logger = winston.createLogger({
  level: 'error', // Set log level to 'error'
  format: winston.format.json(), // Use JSON format
  transports: [
    // Log errors to console
    new winston.transports.Console(),
    // Optionally, log errors to a file
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

// Example middleware to log errors
function logErrors(err, req, res, next) {
  logger.error(err.stack); // Log the error stack trace
  next(err); // Pass the error to the default Express error handler
}

// Example Express error handler
function errorHandler(err, req, res, next) {
  res.status(500).json({ error: 'Internal Server Error' }); // Respond with a generic error message
}


dotenv.config();


const PORT = process.env.PORT || 3001;


app.use(logErrors);
// app.use((res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("route");

app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('public'))


app.use('/api/user', UserRoutes);
app.use('/api/project', ProjectRoutes);
app.use('/api/question', QuestionRoutes);
app.use('/api/answer', AnswerRoutes);
app.use('/api/answered', AnsweredRoutes);
app.use('/api/new', NewQuestionRoutes);
app.use('/api/gates', GoRoutes);
app.use('/api/algo', AlgoRoutes);
app.use('/api/summary', SummaryRoutes);
app.use('/api/pdf', PDFSummaryRoutes);
app.use('/api/user/image', UserImageRoutes);
app.use('/api/', GraphRoutes);
app.use('/api/project', ProjectGoGate);
app.use('/api/pitchDeck/upload', PitchDeckRoutes);
app.use('/api/prototype/upload', PrototypeRoutes);
app.use('/api/hub', HubRoutes);
app.use('/api/share', ShareRoutes);
app.use('/api/team', TeamRoutes);
app.use('/api/feedback', FeedbackRoutes);
app.use('/api/scrap', ScrapRoutes);
app.use('/api/kpi', KpiRoutes);
app.use('/api/timeline', Timeline);
app.use('/api/video', Video);
app.use('/api/quote', Quote);
app.use('/api/streak', Streak);
app.use('/api/chat', Chat);
app.use('/api/checker', UserChecker);
app.use('/api/brand', BrandRoutes);
app.use('/api/finished', FinishedRoutes);
app.use('/api', AuthRoutes);
app.use('/api/noti', Noti);
app.use('/api/file', dcfRoutes);
app.use('/api/entered', EnteredPhaseRoutes);
app.use('/api/waitlist', WaitlistRoutes);
app.use('/api/accelerate', AccelerateRoutes);
app.use('/api/mail', MailRoutes);

//Admin
app.use('/api/admin', AdminUserRoutes);
app.use('/api/admin/login', AdminAuthRoutes);
app.use('/api/admin/customer', AdminCustomerRoutes);

app.use(errorHandler);
//Transfer
app.use('/api/transfer', TransferRoutes);

const server = http.createServer(app);

setupWebSocket(server);

// app.listen(PORT, () => {
//   //setupWebSocket(app);
//   console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
