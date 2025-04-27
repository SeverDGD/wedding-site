// Дата свадьбы
const weddingDate = new Date('2025-07-24T14:30:00');

// Таймер обратного отсчета
function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').innerText = days;
  document.getElementById('hours').innerText = hours;
  document.getElementById('minutes').innerText = minutes;
  document.getElementById('seconds').innerText = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Генерация календаря
function generateCalendar(year, month) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  daysOfWeek.forEach(day => {
    const dayElem = document.createElement('div');
    dayElem.textContent = day;
    dayElem.style.fontWeight = 'normal';
    calendar.appendChild(dayElem);
  });

  const date = new Date(year, month, 1);
  let startDay = (date.getDay() + 6) % 7;

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    calendar.appendChild(empty);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const dayElem = document.createElement('div');
    dayElem.textContent = i;

    const tempDate = new Date(year, month, i);
    if (tempDate.getDay() === 0 || tempDate.getDay() === 6) {
      dayElem.classList.add('weekend');
    }
    if (i === 24) {
      dayElem.classList.add('special-day');
      dayElem.innerHTML = `<span style="color:#e74c3c;">${i} ❤</span>`;
    }
    calendar.appendChild(dayElem);
  }
}
generateCalendar(2025, 6); // Июль 2025 (месяцы считаются с 0)

// Анимация появления при скролле
const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 50) {
      el.classList.add('show');
    }
  });
});

// Отправка формы в Telegram
const TOKEN = 'ВАШ_ТОКЕН_БОТА'; // сюда вставь токен
const CHAT_ID = 'ВАШ_CHAT_ID';   // сюда вставь chat_id
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

document.getElementById('guestForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const fullname = formData.get('fullname');
  const companion = formData.get('companion');
  const attendance = formData.get('attendance');
  const alcohol = formData.get('alcohol');
  const music = formData.get('music');

  const message = `
<b>📩 Новая заявка на свадьбу!</b>
<b>ФИО:</b> ${fullname}
<b>С кем посетите:</b> ${companion}
<b>Присутствие:</b> ${attendance}
<b>Предпочтения алкоголя:</b> ${alcohol}
<b>Любимый трек:</b> ${music}
  `;

  fetch(URI_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  })
  .then(response => {
    if (response.ok) {
      alert('Спасибо! Ваш ответ отправлен 🎉');
      this.reset();
    } else {
      alert('Ошибка при отправке. Попробуйте позже.');
    }
  })
  .catch(error => {
    alert('Ошибка соединения. Попробуйте позже.');
    console.error('Ошибка:', error);
  });
});
