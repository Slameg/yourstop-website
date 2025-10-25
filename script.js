const serverAddress = "yourstop.online"; // Без порта, стандартный 25565

async function fetchServerStatus() {
    try {
        const res = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}`);
        const data = await res.json();

        document.getElementById("motd").textContent = data.motd?.clean?.join(" ") || "Сервер недоступен";
        document.getElementById("online").textContent = data.players?.online || 0;
        document.getElementById("maxPlayers").textContent = data.players?.max || 0;
        document.getElementById("version").textContent = data.version || "—";

        const list = document.getElementById("playerList");
        list.innerHTML = "";
        if (data.players?.list && data.players.list.length > 0) {
            data.players.list.forEach(player => {
                const li = document.createElement("li");
                li.textContent = player;
                list.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "Нет игроков онлайн";
            list.appendChild(li);
        }

    } catch (err) {
        console.error("Ошибка при получении статуса сервера:", err);
        document.getElementById("motd").textContent = "Сервер недоступен";
        document.getElementById("playerList").innerHTML = "<li>Нет данных</li>";
    }
}

document.getElementById("connectBtn").addEventListener("click", () => {
    window.location.href = `minecraft://connect/${serverAddress}`;
});

// Обновление каждые 10 секунд
fetchServerStatus();
setInterval(fetchServerStatus, 10000);
