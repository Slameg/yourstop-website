const API = 'http://yourstop.online:8080/status';

const el = {
  online: document.getElementById('online'),
  tps: document.getElementById('tps'),
  motd: document.getElementById('motd'),
  playersList: document.getElementById('playersList'),
  copyIp: document.getElementById('copyIp'),
  joinBtn: document.getElementById('join')
};

async function fetchStatus(){
  try{
    const res = await fetch(API);
    if(!res.ok) throw new Error('network error');
    const data = await res.json();

    el.online.textContent = `${data.online} / ${data.maxPlayers}`;
    el.tps.textContent = data.tps.toFixed(2);
    el.motd.textContent = data.motd;

    el.playersList.innerHTML = '';
    if(data.players.length === 0){
      const li = document.createElement('li');
      li.textContent = 'Нет игроков';
      el.playersList.appendChild(li);
    } else {
      data.players.forEach(name => {
        const li = document.createElement('li');
        li.textContent = `${name} (${data.ping[name]} ms)`;
        el.playersList.appendChild(li);
      });
    }
  }catch(e){
    console.error('Ошибка API', e);
    el.online.textContent = '—';
    el.tps.textContent = '—';
    el.motd.textContent = 'Сервер недоступен';
    el.playersList.innerHTML = '';
  }
}

// копирование IP
el.copyIp.addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText('yourstop.online');
    el.copyIp.textContent = 'Скопировано!';
    setTimeout(()=>el.copyIp.textContent='Копировать IP',2000);
  }catch{
    alert('IP: yourstop.online');
  }
});

// кнопка Join
el.joinBtn.addEventListener('click', e=>{
  e.preventDefault();
  navigator.clipboard.writeText('yourstop.online').then(()=>{
    alert('IP скопирован! Открой Minecraft и вставь в список серверов.');
  });
});

fetchStatus();
setInterval(fetchStatus, 10000); // обновляем каждые 10 сек
