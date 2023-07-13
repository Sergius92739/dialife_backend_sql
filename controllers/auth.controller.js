import db from "../db_pool.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { unlink } from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class AuthController {
  async register(req, res) {
    try {
      const { login, password, email, age } = req.body;
      const isUsed = await db.query("SELECT * FROM users WHERE login = $1", [
        login,
      ]);

      if (isUsed.rows[0]) {
        return res.json({
          message: "Данный username уже занят.",
        });
      }

      let fileName;

      if (req.files.avatar.size) {
        fileName = Date.now().toString() + req.files.avatar.name;
        const __dirname = dirname(fileURLToPath(import.meta.url));
        req.files.avatar.mv(path.join(__dirname, "..", "uploaded", fileName));
      } else {
        fileName = "";
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const role = password === process.env.ADMIN_PASSWORD ? "admin" : "user";

      const newUser = await db.query(
        "INSERT INTO users (login, password, email, role, avatar, age) values ($1, $2, $3, $4, $5, $6) RETURNING *",
        [login, hash, email, role, fileName, age]
      );

      const token = jwt.sign(
        { id: newUser.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.json({
        newUser: {
          id: newUser.rows[0].id,
          avatar: newUser.rows[0].avatar,
          age: newUser.rows[0].age,
          role: newUser.rows[0].role,
          login: newUser.rows[0].login,
        },
        token,
        message: "Регистрация прошла успешно",
      });
    } catch (error) {
      console.log(error);
      res.json({ message: "Ошибка при регистрации пользователя" });
    }
  }

  async login(req, res) {
    
  }

  async getMe(req, res) {
    try {
      const user = await db.query("SELECT * FROM users WHERE id = $1", [
        req.userId,
      ]);

      if (!user.rows[0]) {
        return res.json({
          message: "Такого юзера не существует.",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.json({
        id: user.rows[0].id,
        avatar: user.rows[0].avatar,
        age: user.rows[0].age,
        role: user.rows[0].role,
        login: user.rows[0].login,
        token,
      });
    } catch (error) {
      console.log("error getMe: ", error);
      res.json({ message: "Нет доступа." });
    }
  }

  async update(req, res) {}
}

const authController = new AuthController();
export default authController;
