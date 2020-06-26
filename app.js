const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const vendorRouter = require('./routes/vendorRoutes');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.use(cookieParser());

//routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/vendor', vendorRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
