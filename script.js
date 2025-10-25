const apiUrl = "https://api.mcsrvstat.us/2/yourstop.online";

// Получение статуса сервера
async function fetchServerStatus() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // MOTD
        const motd = data.motd ? data.motd.clean.join(' ') : "Сервер недоступен";
        document.getElementById('motd').textContent = motd;

        // Онлайн игроков
        document.getElementById('online').textContent = data.players.online || 0;
        document.getElementById('maxPlayers').textContent = data.players.max || 0;

        // TPS
        document.getElementById('tps').textContent = data.tps || "—";

        // Версия
        document.getElementById('version').textContent = data.version || "—";

        // Игроки онлайн
        const playerList = document.getElementById('playerList');
        playerList.innerHTML = '';
        if(data.players.list && data.players.list.length > 0){
            data.players.list.forEach(p => {
                const li = document.createElement('li');
                li.textContent = p;
                playerList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Нет игроков онлайн';
            playerList.appendChild(li);
        }

        // Новости (пример статичных новостей)
        const newsList = document.getElementById('newsList');
        newsList.innerHTML = '';
        const news = [
            "Сервер запущен! Добро пожаловать!",
            "Добавлены новые мини-ивенты каждый выходной!",
            "Следующий вайп планируется через 30 дней."
        ];
        news.forEach(n => {
            const li = document.createElement('li');
            li.textContent = n;
            newsList.appendChild(li);
        });

    } catch (err) {
        console.error("Ошибка при загрузке статуса сервера:", err);
    }
}

// Обновляем каждые 15 секунд
fetchServerStatus();
setInterval(fetchServerStatus, 15000);
