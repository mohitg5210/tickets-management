const userService = require('../../services/user');
const config = require("../../config/config");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

class adminController {

  async login(req, res) {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    userService.findByEmail(req.body.email)
      .then(user => {
        //console.log(user);
        if (!user) {
          return res.status(403).send({ message: "Email or password is incorrect." });
        }else if (user.role.name  != "Admin" && user.role.name  != "Operation Manager") {
          return res.status(403).send({ message: "Email or password is incorrect." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(403).send({
            accessToken: null,
            message: "Email or password is incorrect."
          });
        }
  
        var token = jwt.sign({ id: user.id, userType:user.role.name }, config.secret, {
          expiresIn: 86400 //24hours
        });
        res.status(200).send({
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.role.name,
          accessToken: token
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };

  async getOperationManagers(req, res, next) {
    try {
      const user = await userService.getOperationManagers();
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  
}

module.exports = new adminController();
