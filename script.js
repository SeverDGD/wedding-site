const weddingDate = new Date('2025-07-24T14:30:00');

// Таймер
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

// Календарь
function generateCalendar(year, month) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  daysOfWeek.forEach(day => {
    const dayElem = document.createElement('div');
    dayElem.textContent = day;
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
generateCalendar(2025, 6);

// Плавная анимация
const scrollElements = document.querySelectorAll('.scroll-reveal');
window.addEventListener('scroll', () => {
  scrollElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('show');
    }
  });
});

// Отправка формы в Telegram
document.getElementById('guestForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const token = 'ТВОЙ_ТОКЕН_БОТА';
  const chatId = 'ТВОЙ_CHAT_ID';

  const formData = new FormData(this);
  let alcohol = [];
  formData.getAll('alcohol').forEach(item => alcohol.push(item));

  const message = `
📋 Новая заявка на участие:
👤 ФИО: ${formData.get('fullname')}
👥 С кем придет: ${formData.get('guests')}
📞 Телефон: ${formData.get('phone')}
✅ Присутствие: ${formData.get('attendance')}
🍷 Алкоголь: ${alcohol.join(', ') || 'Нет предпочтений'}
🎵 Любимый трек: ${formData.get('music')}
`;

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    })
  }).then(response => {
    if (response.ok) {
      alert('Спасибо за подтверждение!');
      document.getElementById('guestForm').reset();
    } else {
      alert('Ошибка отправки, попробуйте позже.');
    }
  });
});
