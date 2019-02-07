const db = require('../config/db.config.js');
const User = db.users;
const md5 = require('md5')
// Post a User
exports.create = (req, res) => {	
	let User = req.body;
	User.create(User).then(result => {	
		res.json(result);
	});
};


exports.authenticate = (req, res) => {
    console.log("id", req.body.id, req.body.password)
    User.findByPk().then
    .then(User => {
        if (!User) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            // check if password matches
            User.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                // if user is found and password is right create a token
                var token = jwt.sign(User.toJSON(), config.secret);
                // return the information including token as JSON
                res.json({success: true, token: 'JWT ' + token});
              } else {
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
              }
            });
        }
    });
};

exports.findAll = (req, res) => {
	User.findAll().then(users => {
		console.log(users);
	  res.json(users);
	});
};

// Find a User by Id
exports.findById = (req, res) => {	
	User.findById(req.params.userId).then(User => {
		res.json(User);
	})
};
 
// Update a User
exports.update = (req, res) => {
	let User = req.body;
	console.log("Update",User)
	let id = req.body.roll_no;
	User.update(User, 
					 { where: {roll_no: id} }
				   ).then(() => {
						 res.status(200).json({msg:"updated successfully a User with id = " + id});
				   });	
};
 
// Delete a User by Id
exports.delete = (req, res) => {
	const id = req.params.userId;
	User.destroy({
	  where: { roll_no: id }
	}).then(() => {
	  res.status(200).json({msg:'deleted successfully a User with id = ' + id});
	});
};