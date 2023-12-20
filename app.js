const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const bcrypt = require('bcrypt');
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb+srv://nikapairazian:Edonika135@cluster.g7prdh8.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(mongoURI);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  status: String,
  lastLogin: Date,
  registrationDate: Date,
});

app.use(cors());

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Подключено к MongoDB');
});

db.on('error', (err) => {
  console.error('Ошибка подключения к MongoDB:', err);
});

db.on('disconnected', () => {
  console.log('Отключено от MongoDB');
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('Соединение с MongoDB закрыто');
    process.exit(0);
  });
});


app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const User = mongoose.model('User', userSchema);
app.get('/', (req,res) => {
  res.sendFile('/index.html')
})


app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Ошибка получения пользователей', details: error.message });
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body)
  const now = new Date();

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        email,
        password: hashedPassword,
        status: 'Активен',
        lastLogin: now,
        registrationDate: now,
      });

      await newUser.save();
      res.status(200).json({ message: 'Регистрация успешна' });
    } else {
      res.json({ message: 'Пользователь уже существует' });
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка регистрации', details: error.message });
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        if (user.status === 'Активен') {
          currentUser = user;
          res.status(200).json({ message: 'Вход успешен' });
        } else {
          res.status(401).json({ error: 'Учетная запись заблокирована' });
        }
      } else {
        res.status(401).json({ error: 'Неверные учетные данные' });
      }
    } else {
      res.status(401).json({ error: 'Пользователя не существует' });
    }
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка входа', details: error.message });
  }
});
async function updatedInfo(req, res) {
  try {
    const user = await User.findById(currentUser._id);
    console.log(user)

    if (user) {
      if (user.status === 'Активен') {
        return res.status(200).json(user);
      }
    }

    return res.status(200).json({ redirectTo: '/index.html' });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка', details: error.message });
  }
}

app.delete('/users/:Username', async (req, res) => {
  const username = req.params.Username;

  try {
    const result = await User.deleteOne({ username });
    console.log(result)
    if (result.deletedCount > 0) {
      await updatedInfo(req, res);
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ error: 'Ошибка при удалении пользователя', details: error.message });
  }
});

app.put('/users/block/:username', async (req, res) => {
  const blockingUsername = req.params.username;

  try {
    const result = await User.updateOne({ username: blockingUsername }, { $set: { status: 'Заблокирован' } });
console.log(result)
    if (result.modifiedCount > 0) {
      await updatedInfo(req, res);
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Ошибка при блокировке пользователя:', error);
    res.status(500).json({ error: 'Ошибка при блокировке пользователя', details: error.message });
  }
});

app.put('/users/unblock/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const result = await User.updateOne({ username }, { $set: { status: 'Активен' } });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Пользователь успешно разблокирован' });
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Ошибка при разблокировке пользователя:', error);
    res.status(500).json({ error: 'Ошибка при разблокировке пользователя', details: error.message });
  }
});
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
