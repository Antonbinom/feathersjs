// Инициализируем socket.io, передаем адрес
const socket = io('http://localhost:3030');
// Инициализируем feathers
const app = feathers();

// Устанавливаем связь socket.io между фронтэнд и бэкэнд
app.configure(feathers.socketio(socket));

// При отправке формы
async function sendMessage() {
  // получаем поле для ввода
  const messageInput = document.getElementById('message-text');

  // Создаем новое сообщение с текстом из поля ввода
  await app.service('messages').create({
    text: messageInput.value
  });

  messageInput.value = '';
}

// Функция рендеринга сообщения на странице
function addMessage(message) {
  document.getElementById('main').innerHTML += `<p>${message.text}</p>`;
}

const main = async () => {
  // Получаем весь массив сообщений из сервиса
  const messages = await app.service('messages').find();

  // И рендерим их на странице
  messages.forEach(addMessage);

  // Рендерим новое сообщение в реальном времени
  app.service('messages').on('created', addMessage);
};

main();
