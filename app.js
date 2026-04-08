// 1. CONFIGURATION SUPABASE
const SUPABASE_URL = 'https://smbvusxrjodqthvqqgre.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYnZ1c3hyam9kcXRodnFxZ3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDc5NjYsImV4cCI6MjA5MDc4Mzk2Nn0.p_NPHtVbN6QKfiJHvTx9kfPMK-5YdLMY0QRchfMD6xw';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. INITIALISATION DU CATALOGUE (8 CATÉGORIES)
async function initKanz(filter = 'all') {
    const { data: products, error } = await _supabase.from('products').select('*').order('id', { ascending: false });
    if (error) {
        console.error("Erreur de chargement:", error.message);
        return;
    }

    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = "";

    products.forEach(p => {
        // Filtrage dynamique selon la structure demandée
        if (filter === 'all' || p.category === filter) {
            
            // Gestion des formats multiples (ex: "5kg, 10kg, 20kg")
            const formats = p.formats ? p.formats.split(',') : ["Format Standard"];
            const optionsHTML = formats.map(f => `<option value="${f.trim()}">${f.trim()}</option>`).join('');

            const card = document.createElement('div');
            card.className = "product-card glass";
            card.innerHTML = `
                <div class="img-wrapper">
                    <img src="${p.image_url}" alt="${p.name}">
                    <span class="category-badge">${getCategoryName(p.category)}</span>
                </div>
                <div class="card-body">
                    <h3>${p.name}</h3>
                    <p class="description">${p.description || ""}</p>
                    
                    <div class="config-box">
                        <div class="field">
                            <label>Format / Quantité</label>
                            <select id="fmt-${p.id}">${optionsHTML}</select>
                        </div>
                        <div class="options-row">
                            <label><input type="checkbox" id="wl-${p.id}"> Marque Blanche</label>
                            <label><input type="checkbox" id="glass-${p.id}"> Support Verre</label>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="price">Dès ${p.price} €</div>
                        <button onclick="orderWA('${p.name}', ${p.id})" class="btn-primary">DEVIS WHATSAPP</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

// 3. AUTOMATION WHATSAPP (Numéro : 967785048495)
function orderWA(name, id) {
    const fmt = document.getElementById(`fmt-${id}`).value;
    const wl = document.getElementById(`wl-${id}`).checked ? "Oui (Sans Stickers)" : "Non (Avec Stickers)";
    const support = document.getElementById(`glass-${id}`).checked ? "Pot en Verre" : "Bidon/Seau Plastique";
    
    const msg = `Bonjour Kanz Store,\n\nJe souhaite un devis professionnel pour :\n📦 Produit : ${name}\n⚖️ Format : ${fmt}\n🏷️ Marque Blanche : ${wl}\n🏺 Support : ${support}\n\nMerci de me recontacter pour les modalités de paiement et livraison.`;
    
    // Numéro WhatsApp rectifié
    window.open(`https://wa.me/967785048495?text=${encodeURIComponent(msg)}`, '_blank');
}

// Bouton WhatsApp Flottant / Achats Groupés
function orderGenericWA(subject = "Infos Grossiste") {
    const msg = `Bonjour, je vous contacte depuis le site Kanz Store pour le sujet suivant : ${subject}`;
    window.open(`https://wa.me/967785048495?text=${encodeURIComponent(msg)}`, '_blank');
}

// 4. LOGIQUE FILTRES & UI
function filterCat(cat) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    // Gestion de l'événement pour marquer le bouton actif
    if (event) event.target.classList.add('active');
    initKanz(cat);
}

function getCategoryName(cat) {
    const names = {
        'yemen': '1. Miels Yémen',
        'monde': '2. Miels Monde',
        'sante': '3. Santé & Bien-être',
        'gourmand': '4. Miels Gourmands',
        'complements': '5. Compléments',
        'huiles': '6. Huiles',
        'epicerie': '7. Épicerie Fine',
        'cosmetique': '8. Cosmétique'
    };
    return names[cat] || cat;
}

// 5. IA MARKETING GROWTH (Simulation NexUI)
function askKanzIA() {
    const input = document.getElementById('ai-input').value;
    const display = document.getElementById('ai-display');
    if(!input) return;

    display.innerHTML = "<div class='typing'>L'IA analyse vos opportunités de croissance...</div>";
    
    setTimeout(() => {
        display.innerHTML = `<strong>Analyse Kanz Pro :</strong> Pour votre demande "${input}", le meilleur levier est de coupler le <strong>Sidr Maliki</strong> avec une option <strong>Marque Blanche</strong>. Cela vous permet d'augmenter votre marge de 25% en créant votre propre identité de marque.`;
    }, 2000);
}

// 6. ACCÈS ADMIN (Bouton discret)
function checkAccess() {
    const code = document.getElementById('admin-code').value;
    if (code === "2026") { // Code d'accès personnalisé
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else {
        alert("Accès refusé. Identifiant NexUI invalide.");
    }
}

// Chargement au démarrage
document.addEventListener('DOMContentLoaded', () => initKanz());
