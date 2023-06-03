const express = require("express");
var ObjectId = require('mongoose').Types.ObjectId;
const app = express();

const userRoute = express.Router();
let User = require("../model/User");


// Add User
userRoute.route("/add-user", ).post(async (req, res, next) => {
  let checkUser = await User.findOne({
    email: req.body.email,
  })
  if(checkUser) {
    return res.status(400).json({message: 'Email Already Exist'});
  }
  const { image } = req.files;
  image.mv('./uploads/' + image.name);
  req.body.image = image.name
  User.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
    }
  });
});

// Get all Users
userRoute.route("/").get((req, res) => {
  User.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get User
userRoute.route("/read-user/:id").get((req, res) => {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update 
userRoute.route("/update-user/:id").put(async (req, res, next) => {
  let checkUser = await User.findOne({
    email: req.body.email,
    _id: {
      $ne: ObjectId(req.params.id)
    }
  })
  if(checkUser) {
    return res.status(400).json({message: 'Email Already Exist'});
  }
  if(req.files ) {
    const { image } = req.files;
    image.mv('./uploads/' + image.name);
    req.body.image = image.name
  }
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    }
  );
});

// Delete User
userRoute.route("/delete-user/:id").delete((req, res, next) => {
  User.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = userRoute;
