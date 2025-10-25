const API_URL = "https://yourstop.online:55555/status";

async function fetchStatus() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // MOTD с удалением символов форматирования Minecraft
        document.getElementById("motd").textContent = data.motd.replace(/§./g, "");

        document.getElementById("online").textContent = data.online;
        document.getElementById("maxPlayers").textContent = data.maxPlayers;
        document.getElementById("tps").textContent = data.tps.toFixed(2);
        document.getElementById("version").textContent = data.version;

        const playerList = document.getElementById("playerList");
        playerList.innerHTML = "";
        if (data.players.length === 0) {
            playerList.innerHTML = "<li>Нет игроков онлайн</li>";
        } else {
            data.players.forEach(p => {
                const li = document.createElement("li");
                li.textContent = p;
                playerList.appendChild(li);
            });
        }
    } catch (err) {
        console.error("Ошибка загрузки статуса сервера:", err);
        document.getElementById("motd").textContent = "Сервер недоступен";
    }
}

// Автообновление каждые 10 секунд
fetchStatus();
setInterval(fetchStatus, 10000);
