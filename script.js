async function fetchServerStatus() {
    try {
        const response = await fetch('http://yourstop.online:55555/status');
        const data = await response.json();

        document.getElementById('motd').textContent = data.motd || 'Нет данных';
        document.getElementById('online').textContent = data.online || 0;
        document.getElementById('maxPlayers').textContent = data.maxPlayers || 0;
        document.getElementById('tps').textContent = data.tps ? data.tps.toFixed(2) : '—';
        document.getElementById('version').textContent = data.version || '—';
        document.getElementById('ping').textContent = data.ping?.ms || '—';

        // Список игроков
        const playerList = document.getElementById('playerList');
        playerList.innerHTML = '';
        if(data.players && data.players.length > 0) {
            data.players.forEach(player => {
                const li = document.createElement('li');
                li.textContent = player;
                playerList.appendChild(li);
            });
        } else {
            playerList.innerHTML = '<li>Игроки отсутствуют</li>';
        }

    } catch (err) {
        console.error(err);
        document.getElementById('motd').textContent = 'Сервер недоступен';
    }
}

// Подключение к серверу (открывает Minecraft)
document.getElementById('connectBtn').addEventListener('click', () => {
    window.location.href = 'minecraft://yourstop.online:25565';
});

// Новости (можно заменить на реальный API)
const newsList = document.getElementById('newsList');
newsList.innerHTML = `
<li>Запуск нового вайпа! 🎉</li>
<li>Добавлена поддержка Bedrock игроков через Geyser!</li>
<li>Оптимизация сервера и улучшение производительности TPS.</li>
`;

fetchServerStatus();
setInterval(fetchServerStatus, 5000);
