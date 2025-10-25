// Прокси URL — здесь нужно указать ваш работающий сервер Node.js/Render/VPS
const API_URL = 'https://YOUR-PROXY-DOMAIN/api/status';

async function updateStatus() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        document.getElementById('motd').textContent = data.motd.replace(/§[0-9a-fk-or]/g, '');
        document.getElementById('online').textContent = data.online;
        document.getElementById('maxPlayers').textContent = data.maxPlayers;
        document.getElementById('tps').textContent = data.tps.toFixed(2);
        document.getElementById('version').textContent = data.version;

        const playerList = document.getElementById('playerList');
        playerList.innerHTML = '';
        if (data.players.length === 0) {
            playerList.innerHTML = '<li>Нет игроков онлайн</li>';
        } else {
            data.players.forEach(p => {
                const li = document.createElement('li');
                li.textContent = p;
                playerList.appendChild(li);
            });
        }

        // Можно добавить новости, если есть отдельный endpoint
        const newsList = document.getElementById('newsList');
        newsList.innerHTML = '<li>Сайт обновлен!</li>';
    } catch (err) {
        console.error(err);
        document.getElementById('motd').textContent = 'Ошибка';
    }
}

// Обновляем каждые 15 секунд
updateStatus();
setInterval(updateStatus, 15000);
