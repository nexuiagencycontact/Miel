const SUPABASE_URL = 'https://smbvusxrjodqthvqqgre.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYnZ1c3hyam9kcXRodnFxZ3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDc5NjYsImV4cCI6MjA5MDc4Mzk2Nn0.p_NPHtVbN6QKfiJHvTx9kfPMK-5YdLMY0QRchfMD6xw';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function checkAccess() {
    if (document.getElementById('admin-code').value === "1234") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        initKanz('fr');
    } else { alert("Code incorrect"); }
}

async function saveProduct() {
    const fileInput = document.getElementById('p-file');
    const file = fileInput.files[0];
    const btn = document.getElementById('btn-save');
    if (!file) return alert("Veuillez sélectionner une image.");

    btn.innerText = "Téléchargement de l'image...";
    btn.disabled = true;

    // 1. Upload Image
    const fileName = `produits/${Date.now()}_${file.name}`;
    const { data: upData, error: upError } = await _supabase.storage.from('photos_kanz_store').upload(fileName, file);

    if (upError) {
        btn.disabled = false;
        return alert("Erreur upload: " + upError.message);
    }

    // 2. URL Publique
    const { data: urlData } = _supabase.storage.from('photos_kanz_store').getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    // 3. Database Insert
    const product = {
        name: document.getElementById('p-name').value,
        description: document.getElementById('p-desc').value,
        category: document.getElementById('p-category').value,
        price: parseFloat(document.getElementById('p-price').value),
        stock: parseInt(document.getElementById('p-stock').value) || 0,
        image_url: imageUrl
    };

    const { error: dbError } = await _supabase.from('products').insert([product]);
    if (dbError) alert(dbError.message);
    else { alert("Produit ajouté !"); location.reload(); }
}

async function initKanz(lang) {
    const { data: products, error } = await _supabase.from('products').select('*').order('id', { ascending: false });
    if (error) return;

    const grid = document.getElementById('product-grid');
    const adminGrid = document.getElementById('admin-product-list');

    if (grid) grid.innerHTML = "";
    if (adminGrid) adminGrid.innerHTML = "";

    products.forEach(p => {
        // Version Admin
        if (adminGrid) {
            const div = document.createElement('div');
            div.className = "glass";
            div.style.padding = "10px";
            div.style.borderRadius = "10px";
            div.innerHTML = `<img src="${p.image_url}" style="width:100%; height:100px; object-fit:cover; border-radius:5px;"><p style="font-weight:bold; margin:5px 0;">${p.name}</p><button onclick="deleteProduct(${p.id})" style="background:#ff4444; color:white; border:none; width:100%; padding:5px; border-radius:5px; cursor:pointer;">Supprimer</button>`;
            adminGrid.appendChild(div);
        }

        // Version Site Public (Bouton Devis & Groupé)
        if (grid) {
            const card = document.createElement('div');
            card.className = "product-card glass";
            card.innerHTML = `
                <img src="${p.image_url}" alt="${p.name}" style="width:100%; border-radius:12px; height:200px; object-fit:cover;">
                <div style="margin-top:15px;">
                    <span style="font-size:0.7rem; background:rgba(201,162,39,0.1); color:var(--primary); padding:4px 10px; border-radius:20px; font-weight:bold;">GROS & DEMI-GROS</span>
                    <h3 style="margin:10px 0 5px 0;">${p.name}</h3>
                    <p style="font-size:0.85rem; color:#666; margin-bottom:10px;">${p.description || ""}</p>
                    <div style="font-weight:bold; color:var(--primary); font-size:1.2rem; margin-bottom:15px;">Dès ${p.price} € <small style="font-size:0.7rem; color:#999;">/ kg</small></div>
                    <a href="#contact-section" style="display:block; text-align:center; background:var(--primary); color:white; padding:12px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:0.9rem;">DEMANDER UN DEVIS</a>
                    <div style="text-align:center; font-size:0.7rem; color:#888; margin-top:8px; font-style:italic;">✨ Idéal pour achats groupés</div>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

async function deleteProduct(id) {
    if (confirm("Supprimer définitivement ?")) {
        await _supabase.from('products').delete().eq('id', id);
        initKanz('fr');
    }
}

document.addEventListener('DOMContentLoaded', () => { if (document.getElementById('product-grid')) initKanz('fr'); });
