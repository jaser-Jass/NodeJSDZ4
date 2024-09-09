const express = require('express');
const path = require('path');
const fs = require('fs');

// Создаем экземпляр приложения Express
const app = express();

// Путь к файлу с сохраненными счетчиками
const viewCountFilePath = path.join(__dirname, 'viewcounts.json');

// Функция для чтения файла со счетчиками
function readViewCounts() {
  try {
    const data = fs.readFileSync(viewCountFilePath);
    return JSON.parse(data.toString());
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Если файл не существует, создаем новый объект
      console.log(`Файл со счетчиками не найден, создаю новый...`);
      return {};
    } else {
      throw error;
    }
  }
}

// Функция для записи файла со счетчиками
function writeViewCounts(viewCounts) {
  try {
    fs.writeFileSync(viewCountFilePath, JSON.stringify(viewCounts));
  } catch (error) {
    console.error('Ошибка записи данных в файл:', error);
  }
}

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

// Обработчик главной страницы
app.get('/', async (req, res) => {
  let viewCounts = readViewCounts();
  
  // Увеличиваем счетчик просмотра главной страницы
  viewCounts['/']++;
  
  // Записываем измененный объект в файл
  writeViewCounts(viewCounts);
  
  res.send(`<h1>Главная страница</h1><br/>Просмотрено ${viewCounts['/']} раз.`);
});

// Обработчик страницы "About"
app.get('/about', async (req, res) => {
  let viewCounts = readViewCounts();
  
  // Увеличиваем счетчик просмотра страницы "About"
  viewCounts['/about']++;
  
  // Записываем измененный объект в файл
  writeViewCounts(viewCounts);
  
  res.send(`<h1>Страница About</h1><br/>Просмотрено ${viewCounts['/about']} раз.`);
});

// Слушатель на порту 3000
app.listen(3000, () => {
  console.log('HTTP-сервер запущен на http://localhost:3000');
});
