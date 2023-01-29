// получаем библитеку feathers
const feathers = require('@feathersjs/feathers')

// инициализируем feathers в переменной app
const app = feathers()

// создаем сервис сообщений
class MessageService {
  constructor () {
    // с массивом в котором будут храниться сообщения
    this.messages = []
  }

  // методом для получения сообщений
  async find() {
    // который возвращает массив messages
    return this.messages
  }

  // методом для создания нового сообщения и добавления его в массив сообщений messages
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

// регестрируем сервис в app
app.use('messages', new MessageService())
// при вызове метода created внутри сервиса messages выводим в консоль сообщение
app.service('messages').on('created', (message) => {
  console.log('A new message was created', message);
})

// метод main
const main = async () => {
  // вызываем метод create в котором передаем объект с текстом сообщения
  await app.service('messages').create({
    text: 'Hello Anton!'
  })

  await app.service('messages').create({
    text: 'How are you?'
  })

  // в переменной messages получаем массив сообщений вызывая метод find в
  const messages = await app.service('messages').find();
  console.log('All my messages:', messages);
}


main()
