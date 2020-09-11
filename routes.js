'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const router = express.Router();
const { models } = require('./db');

// Get references to our models.
const { User, Course } = models;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}


const authenticateUser = async (req, res, next) => {
    let message = null;
  
    const credentials = auth(req);
    let users = await User.findAll();
    
    if (credentials) {
      const user = users.find(u => u.emailAddress === credentials.name);
  
     
      if (user) {
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);
  
      
        if (authenticated) {
          req.currentUser = user;
          console.log(`Authentication successful for: ${user.emailAddress}`);

        } else {
          message = `Authentication failure for: ${user.emailAddress}`;
        }
      } else {
        message = `User not found for email: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    if (message) {
      console.warn(message);
  
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }
  };

  router.get('/users', authenticateUser,  asyncHandler(async (req, res) => {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']});
    res.json({
      users
    });
  }));


// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  const user = await User.build(req.body);
  user.password = bcryptjs.hashSync(user.password);
  await user.save();
  res.location('/');
  // Set the status to 201 Created and end the response.
  return res.status(201).end();
}));

router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll(
    {
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
          as: 'userIdentity'
        },
      ],
    });
    res.json({
      courses
    });
  }));

  router.get('/courses/:id',  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
          as: 'userIdentity'
        },
      ],
    });
    res.json({
      course
    });
  }));

  // Route that creates a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.location('/courses/'+course.id);
  // Set the status to 201 Created and end the response.
  return res.status(201).end();
}));

  // Route that updates a course
  router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  
    const course = await Course.findByPk(req.params.id);
    if(req.currentUser.id === course.userId){
      await course.update(req.body);
      return res.status(204).end();
    } else{
      return res.status(403).end();
    }
  }));

  // Route that deletes a course
  router.delete('/courses/:id', authenticateUser, asyncHandler(async (req ,res) => {
    const course = await Course.findByPk(req.params.id);
    if(req.currentUser.id === course.userId){
      await course.destroy();
      return res.status(204).end();
    } else{
      return res.status(403).end();
    }
  }));
module.exports = router;