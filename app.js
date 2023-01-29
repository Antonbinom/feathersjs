const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

// создаем сервис сообщений
class MessageService {
  constructor () {
    // с массивом в котором будут храниться создаваемые сообщения
    this.messages = []
  }

  // метод для получения сообщений
  async find() {
    // который возвращает массив messages
    return this.messages
  }

  // метод для создания нового сообщения и добавления его в массив сообщений messages
  async create(data) {
    // модель сообщения
    const message = {
      id: this.messages.length,
      text: data.text
    }
    this.messages.push(message)
    return message
  }
}

//Создает приложение Feathers, совместимое с ExpressJS.
const app = express(feathers())

//middleware
// HTTP парсер
app.use(express.json())
// Парсинг для URL параметров
app.use(express.urlencoded({ extended: true }))
// Размещаем статические файлы из корня
app.use(express.static(__dirname))
// Подключаем поддержку rest api
app.configure(express.rest())
// Подключаем socket.io
app.configure(socketio())

// регестрируем сервис в app
// json будет отображаться на роуте messages
app.use('/messages', new MessageService())
// Регистрируем обработчик ошибок
app.use(express.errorHandler)

// Создаем новый канал для всех
app.on('connection', connection => {
  app.chanel('everybody').join(connection)
})
// Отображаем все изменения для всех
app.publish(() => app.channel('everybody'))

app.listen(3030).on('listening', () => {
  console.log('Feathers server listening on http://localhost:3030');
})

app.service('messages').create({
  text: 'Hello, how is it going?'
})
