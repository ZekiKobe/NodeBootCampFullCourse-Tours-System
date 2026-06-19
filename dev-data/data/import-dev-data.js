const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });

// CONNECT TO DB
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log('DB ERROR:', err));

// READ JSON FILES
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA
const importData = async () => {
  try {
    console.log('Starting import...');

    // FIX: passwordConfirm required by schema
    const usersWithConfirm = users.map(user => ({
      ...user,
      passwordConfirm: user.password
    }));

    // 1. USERS
    console.log('Importing users...');
    await User.insertMany(usersWithConfirm, { ordered: false });
    console.log('Users imported');

    // 2. TOURS
    console.log('Importing tours...');
    await Tour.insertMany(tours, { ordered: false });
    console.log('Tours imported');

    // 3. REVIEWS
    console.log('Importing reviews...');
    await Review.insertMany(reviews, { ordered: false });
    console.log('Reviews imported');

    console.log('✅ ALL DATA SUCCESSFULLY LOADED');
  } catch (err) {
    console.log('❌ IMPORT ERROR:', err);
  }

  process.exit();
};

// DELETE DATA
const deleteData = async () => {
  try {
    console.log('Deleting data...');

    await Review.deleteMany();
    await Tour.deleteMany();
    await User.deleteMany();

    console.log('✅ ALL DATA DELETED');
  } catch (err) {
    console.log('❌ DELETE ERROR:', err);
  }

  process.exit();
};

// COMMAND LINE ARGUMENTS
if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}