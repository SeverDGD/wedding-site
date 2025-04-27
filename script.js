const weddingDate = new Date('2025-07-24T14:30:00');

// Обновление таймера
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

generateCalendar(2025, 6); // Июль (месяцы в JS с нуля)

// Анимация при скролле
const sections = document.querySelectorAll('.scroll-animation');
window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight * 0.9;
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add('show');
    }
  });
});

// Отправка формы в Telegram
document.getElementById('guestForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const alcoholPreferences = [];
  document.querySelectorAll('input[name="alcohol"]:checked').forEach(el => alcoholPreferences.push(el.value));

  const message = `
Новое подтверждение участия:

ФИО: ${formData.get('fullname')}
Гость с вами: ${formData.get('guestname')}
Телефон: ${formData.get('phone')}
Будет присутствовать: ${formData.get('attendance')}
Предпочтения алкоголя: ${alcoholPreferences.join(', ') || 'Нет'}
Любимый трек: ${formData.get('music')}
  `;

  const token = 'ТВОЙ_BOT_TOKEN';
  const chatId = 'ТВОЙ_CHAT_ID';
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });

  alert('Спасибо за подтверждение!');
  e.target.reset();
});
