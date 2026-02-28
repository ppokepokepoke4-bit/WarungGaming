// ===============================
// Script JS Form Top-Up Premium Full Paket + Harga Murah Global
// ===============================

// 20 Game Populer
const games = [
  "MLBB","Free Fire","PUBG","CODM","Roblox",
  "Valorant","Fortnite","FIFA Mobile","Genshin Impact","Apex Legends Mobile",
  "Mobile Legends: Adventure","Ragnarok X","Dragon Raja","Clash of Clans","Clash Royale",
  "Brawl Stars","Summoners War","League of Legends: Wild Rift","Pokemon Unite","Minecraft"
];

// Generate paket lengkap 1–40 per game dengan harga murah
const packagesPerGame = {};
games.forEach(game=>{
  const arr=[];
  for(let i=1;i<=40;i++){
    const amount=i*10; // jumlah DM/Koin
    // Harga realistik ala topup global
    // Misal: 10 DM = 2.000, 20 DM = 3.000 … 70 DM = 11.000
    let price;
    if(amount<=70){
      price = Math.round((amount/70)*11000); // skala 11k untuk 70 DM
    } else {
      price = amount*150; // skala harga lebih murah di paket besar
    }
    price += 2000; // admin 2k
    arr.push({name:`${amount} DM/Koin`, amount:amount, price:price});
  }
  packagesPerGame[game]=arr;
});

// Elemen DOM
const gameSelect = document.getElementById('game-select');
const grid = document.getElementById('package-grid');
const qrisPreviewContainer = document.getElementById('qris-preview');

let selectedPackageDetail = null;

// Generate dropdown game
games.forEach(g=>{
  const opt = document.createElement('option');
  opt.value = g;
  opt.textContent = g;
  gameSelect.appendChild(opt);
});

// Event change game
gameSelect.addEventListener('change',()=>{
  const game = gameSelect.value;
  grid.innerHTML='';
  selectedPackageDetail=null;
  qrisPreviewContainer.style.display='none';
  if(packagesPerGame[game]){
    packagesPerGame[game].forEach(p=>{
      const div = document.createElement('div');
      div.classList.add('package-card');
      div.innerHTML=`<p><strong>${p.name}</strong></p><p>Jumlah: ${p.amount}</p><p>Harga: Rp${p.price.toLocaleString()}</p>`;
      div.addEventListener('click',()=>{
        document.querySelectorAll('.package-card').forEach(c=>c.classList.remove('selected'));
        div.classList.add('selected');
        selectedPackageDetail={...p,game};
      });
      grid.appendChild(div);
    });
  }
});

// Event metode pembayaran
const paymentMethod = document.getElementById('payment-method');
paymentMethod.addEventListener('change',()=>{
  if(paymentMethod.value==='qris'){
    qrisPreviewContainer.style.display='flex';
  }else{
    qrisPreviewContainer.style.display='none';
  }
});

// Event tombol bayar
document.getElementById('pay-btn').addEventListener('click',()=>{
  const id = document.getElementById('player-id').value.trim();
  const phone = document.getElementById('phone-number').value.trim();
  const method = document.getElementById('payment-method').value;
  if(!selectedPackageDetail){
    showToast('Pilih paket dulu!');
    return;
  }
  if(!id){
    showToast('Isi ID / Server!');
    return;
  }
  if(!phone){
    showToast('Isi nomor HP!');
    return;
  }
  if(!method){
    showToast('Pilih metode pembayaran!');
    return;
  }
  const checkout = {...selectedPackageDetail,id,phone,method};
  localStorage.setItem('checkoutData',JSON.stringify(checkout));
  showToast(`Topup akan diproses:\nGame: ${checkout.game}\nPaket: ${checkout.name}\nTotal: Rp${checkout.price.toLocaleString()}\nMetode: ${checkout.method}`);
});

// ===============================
// Toast Notification Function
// ===============================
function showToast(msg){
  let toast = document.querySelector('.toast');
  if(!toast){
    toast = document.createElement('div');
    toast.classList.add('toast');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),3000);
}