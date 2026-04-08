const SUPABASE_URL = 'https://smbvusxrjodqthvqqgre.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYnZ1c3hyam9kcXRodnFxZ3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDc5NjYsImV4cCI6MjA5MDc4Mzk2Nn0.p_NPHtVbN6QKfiJHvTx9kfPMK-5YdLMY0QRchfMD6xw';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function initKanz(filter = 'all') {
    const { data: products, error } = await _supabase.from('products').select('*').order('id', { ascending: false });
    if (error) return;

    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = "";

    products.forEach(p => {
        if (filter === 'all' || p.category === filter) {
            const formats = p.formats ? p.formats.split(',') : ["Standard"];
            const optionsHTML = formats.map(f => `<option value="${f.trim()}">${f.trim()}</option>`).join('');

            const card = document.createElement('div');
            card.className = "product-card glass";
            card.innerHTML = `
                <img src="${p.image_url}" alt="${p.name}">
                <div class="card-content">
                    <small class="cat-tag">${p.category.replace('_',' ')}</small>
                    <h3>${p.name}</h3>
                    <div class="pro-selector">
                        <label>Format choisi :</label>
                        <select id="sel-${p.id}">${optionsHTML}</select>
                    </div>
                    <div class="options-pro">
                        <label><input type="checkbox" id="ml-${p.id}"> Option Marque Blanche</label>
                    </div>
                    <div class="price-pro">${p.price}</div>
                    <button onclick="sendWA('${p.name}', ${p.id})" class="btn-wa-order">DEVIS WHATSAPP RAPIDE</button>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

// AUTOMATION : Envoi du message structuré
function sendWA(name, id) {
    const format = document.getElementById(`sel-${id}`).value;
    const whiteLabel = document.getElementById(`ml-${id}`).checked ? "OUI" : "NON";
    const msg = `Bonjour Kanz Store,\nJe souhaite un devis pro pour :\n- Produit : ${name}\n- Format : ${format}\n- Marque Blanche : ${whiteLabel}\nMerci !`;
    window.open(`https://wa.me/33600000000?text=${encodeURIComponent(msg)}`, '_blank');
}

// IA CONSEILLER (Simulation Intelligente)
function askAI() {
    const input = document.getElementById('ai-input').value;
    const responseBox = document.getElementById('ai-response');
    if(!input) return;
    
    responseBox.innerHTML = "<em>L'IA analyse votre demande...</em>";
    setTimeout(() => {
        responseBox.innerHTML = "<strong>Conseil Kanz Pro :</strong> Pour ce produit, je recommande une mise en avant sur vos réseaux avec l'argument 'Récolte 2026'. Le format 250g en pack de 20 est le plus rentable pour débuter.";
    }, 1500);
}

function filterCat(cat) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    initKanz(cat);
}

document.addEventListener('DOMContentLoaded', () => initKanz());
