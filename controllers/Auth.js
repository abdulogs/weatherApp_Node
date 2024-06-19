import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

class Auth {
  static async signup(request, response) {
    let {
      firstname,
      lastname,
      email,
      password
    } = request.body;

    try {
      if (await User.findOne({
          where: {
            email
          }
        })) {
        return response.status(400).json({
          msg: "This email already exists. Please try a different email address!",
        });
      } else {
        let user = new User({
          firstname,
          lastname,
          email,
          password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        request.session.user_id = user.id;

        jwt.sign({
            user: {
              id: user.id,
            },
          },
          "weather", {
            expiresIn: 360000
          },
          (err, token) => {
            if (err) throw err;
            response.json({
              firstname,
              lastname,
              email,
              token
            });
          }
        );
      }
    } catch (error) {
      response.status(500).send(error.message);
    }
  }
  static async login(request, response) {
    const {
      email,
      password
    } = request.body;

    try {
      let user = await User.findOne({
        where: {
          email
        }
      });
      if (!user) {
        return response.status(400).json({
          msg: "Invalid Credentials"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(400).json({
          msg: "Invalid Credentials"
        });
      }

      request.session.user_id = user.id;

      jwt.sign({
          user: {
            id: user.id,
          },
        },
        "weather", {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          response.json({
            token
          });
        }
      );
    } catch (error) {
      response.status(500).send(error.message);
    }
  }
  static async logout(request, response) {
    request.session.destroy((error) => {
      if (error) {
        return response.status(500).send(error.message);
      }
      response.status(200).send({
        msg: "Logged out"
      });
    });
  }
  static async authenticate(request, response) {
    try {
      const user = await User.findByPk(request.user.id);
      request.json(user);
    } catch (error) {
      response.status(500).send(error.message);
    }
  }
}

export default Auth;