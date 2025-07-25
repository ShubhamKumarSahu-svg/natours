const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //^ 1) Get tour data from collection
  const tours = await Tour.find();
  //^ 2)Build Template
  //^ 3) Render the template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //^ 1) Get the data, for the req tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }
  //^ 2)Build Template
  //^ 3) Render the template using tour data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login Form'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup Form'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Account Page'
  });
};

exports.getMyTours = catchAsync(async (req, res) => {
  // 1) find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2) find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Account Page',
    user: updatedUser
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your Booking was successfull! Please check your email for confirmation. If your booking dosen't show here immediatly, please come back later.";
  }

  next();
};
