// script.js — получает данные с https://api.mcsrvstat.us/2/yourstop.online
const SERVER = 'yourstop.online';
const API = `https://api.mcsrvstat.us/2/${SERVER}`;

const el = {
  statusText: document.getElementById('statusText'),
  playersCount: document.getElementById('playersCount'),
  playersList: document.getElementById('playersList'),
  motdHtml: document.getElementById('motdHtml'),
  version: document.getElementById('version'),
  ping: document.getElementById('ping'),
  copyIp: document.getElementById('copyIp'),
};

async function fetchStatus() {
  try {
    const res = await fetch(API, { cache: 'no-store' });
    if (!res.ok) throw new Error('network');
    const json = await res.json();

    if (json && json.online) {
      el.statusText.textContent = 'Онлайн';
      el.statusText.classList.remove('muted');
      el.playersCount.textContent = json.players?.online || '0';
      el.version.textContent = json.version || '—';
      el.ping.textContent = json.debug?.ping ? json.debug.ping + ' ms' : '—';

      const motd = json.motd?.clean?.join('\n') || json.motd?.raw?.join('\n') || '';
      el.motdHtml.textContent = motd || '—';

      renderPlayers(json.players?.list || []);
    } else {
      setOffline();
    }
  } catch (err) {
    console.error('Ошибка получения статуса:', err);
    setOffline('Ошибка подключения');
  }
}

function setOffline(msg = 'Оффлайн') {
  el.statusText.textContent = msg;
  el.playersCount.textContent = '0';
  el.version.textContent = '—';
  el.ping.textContent = '—';
  el.motdHtml.textContent = 'Сервер недоступен.';
  renderPlayers([]);
}

function renderPlayers(list) {
  el.playersList.innerHTML = '';
  if (!list.length) {
    const li = document.createElement('li');
    li.textContent = 'Нет игроков';
    el.playersList.appendChild(li);
    return;
  }
  list.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    el.playersList.appendChild(li);
  });
}

// копировать IP
el.copyIp.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(SERVER);
    el.copyIp.textContent = 'Скопировано!';
    setTimeout(() => (el.copyIp.textContent = 'Копировать IP'), 2000);
  } catch {
    alert(`IP: ${SERVER}`);
  }
});

// кнопка «Присоединиться»
document.getElementById('join').addEventListener('click', e => {
  e.preventDefault();
  navigator.clipboard?.writeText(SERVER).then(() => {
    alert(`IP скопирован: ${SERVER}\\nОткрой Minecraft и вставь IP в список серверов.`);
  });
});

// автообновление каждые 15 секунд
fetchStatus();
setInterval(fetchStatus, 15000);
