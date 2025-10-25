// Configuration
const SERVER = 'yourstop.online';
const SIMPLE_URL = `https://api.mcsrvstat.us/simple/${SERVER}`; // 200 if online, 404 if offline
const JSON_URL = `https://api.mcsrvstat.us/3/${SERVER}`; // full JSON
const REFRESH_SECONDS = 20; // polling interval

// DOM
const statusBadge = document.getElementById('status-badge');
const motdEl = document.getElementById('motd');
const verEl = document.getElementById('ver');
const playersEl = document.getElementById('players');
const pingEl = document.getElementById('ping');
const ipDisplay = document.getElementById('ip-display');
const ipLarge = document.getElementById('ip-large');

ipDisplay.textContent = SERVER;
ipLarge.textContent = SERVER;

// Copy IP
document.getElementById('copy-ip').addEventListener('click', async ()=>{
  try{ await navigator.clipboard.writeText(SERVER); alert('IP скопирован: '+SERVER);}catch(e){prompt('Скопируйте IP вручную', SERVER)}
});

// Join helper
document.getElementById('join').addEventListener('click', ()=>{
  alert('Откройте Minecraft → Multiplayer → Add Server → введите "'+SERVER+'" и нажмите Join.');
});

// Check online via simple endpoint
async function checkOnline(){
  try{
    const res = await fetch(SIMPLE_URL, {cache:'no-store'});
    if(res.status===200){
      setOnline();
      fetchDetails();
    } else if(res.status===404){
      setOffline();
    } else {
      setUnknown();
    }
  }catch(err){
    console.error('Network error', err);
    setUnknown();
  }
}
function setOnline(){
  statusBadge.className='status-badge online';
  statusBadge.textContent='ONLINE';
}
function setOffline(){
  statusBadge.className='status-badge offline';
  statusBadge.textContent='OFFLINE';
  motdEl.textContent='Сервер офлайн';
  verEl.textContent='Версия: —';
  playersEl.textContent='0 онлайн';
  pingEl.textContent='—';
}
function setUnknown(){
  statusBadge.className='status-badge offline';
  statusBadge.textContent='НЕИЗВЕСТНО';
  motdEl.textContent='Не удалось определить статус';
}

// Fetch details from JSON endpoint (MOTD, players, version, ping)
async function fetchDetails(){
  try{
    const r = await fetch(JSON_URL, {cache:'no-store'});
    if(!r.ok) return;
    const data = await r.json();
    if(!data.online){ setOffline(); return; }
    const motd = (data.motd && data.motd.clean && data.motd.clean.join(' ')) || data.hostname || 'Your Stop';
    motdEl.textContent = motd.split('\n')[0];
    verEl.textContent = 'Версия: ' + (data.version || '—');
    if(data.players && data.players.list && data.players.list.length){
      playersEl.textContent = data.players.list.slice(0,12).join(', ');
    } else {
      playersEl.textContent = (data.players && data.players.online ? data.players.online+' онлайн' : '0 онлайн');
    }
    pingEl.textContent = (data.debug && data.debug.ping) ? data.debug.ping + ' ms' : (data.latency? data.latency+' ms' : '—');
  }catch(e){console.error('Details error', e)}
}

// Initial + interval
checkOnline();
setInterval(checkOnline, REFRESH_SECONDS*1000);

// Small pulse animation on status change
(function(){ let last = null; setInterval(()=>{ const now = statusBadge.textContent; if(last && now!==last){ statusBadge.animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:450}); } last = now; },300); })();
