// ==============================================================
// 🌐 GLOBAL CORE STATE MANAGEMENT
// ==============================================================
let map;
let markerLayer;
let allHostels = [];
let ownerHostels = []; 
let currentLoginRole = 'student'; 

if (localStorage.getItem('owner_created_hostels')) {
    ownerHostels = JSON.parse(localStorage.getItem('owner_created_hostels'));
}

// ==============================================================
// 🗺️ MAP ENGINE ARCHITECTURE
// ==============================================================
function initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement && !map) {
        map = L.map('map').setView([20.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        markerLayer = L.layerGroup().addTo(map);
    }
}

// ==============================================================
// ⚡ CORE DATA SYNC PIPELINE
// ==============================================================
async function fetchHostels() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/hostels');
        const data = response.ok ? await response.json() : [];
        allHostels = [...data, ...ownerHostels]; 
    } catch (e) {
        allHostels = [...ownerHostels];
    }

    if (document.getElementById('ownerListings')) {
        renderOwnerInventoryManagement();
    }
    if (document.getElementById('hostelList')) {
        initMap();
        renderGlobalHostels(allHostels);
        // Automatically set the results count text on initial load
        updateResultsCount(allHostels.length);
    }
    if (document.getElementById('detailName')) {
        renderHostelDetails();
    }
}

// ==============================================================
// 👥 STUDENT VIEWS: PORTAL RENDERING ENGINE
// ==============================================================
function renderGlobalHostels(hostelsList) {
    const hostelContainer = document.getElementById('hostelList');
    if (!hostelContainer) return;
    hostelContainer.innerHTML = '';

    if (markerLayer) markerLayer.clearLayers();
    const mapBounds = [];

    hostelsList.forEach(hostel => {
        const imageSrc = hostel.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
        
        const hostelPrice = hostel.price || 0;
        const hostelType = hostel.type || 'Co-ed';
        const hostelAddress = hostel.address || 'Location Not Listed';

        const card = document.createElement('div');
        card.className = 'hostel-card';
        card.innerHTML = `
            <div class="hostel-image-wrapper">
                <img src="${imageSrc}" class="hostel-image" alt="${hostel.name}">
                <span class="hostel-badge">${hostelType}</span>
            </div>
            <div class="hostel-info">
                <h3 class="hostel-name">${hostel.name}</h3>
                <p class="hostel-location">📍 ${hostelAddress}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span><strong>₹${parseInt(hostelPrice).toLocaleString()}</strong>/mo</span>
                    <button class="btn btn-primary" onclick="window.location.href='hostel-detail.html?id=${hostel.id}'">View Details</button>
                </div>
            </div>
        `;
        hostelContainer.appendChild(card);

        if (map && markerLayer) {
            const lat = parseFloat(hostel.latitude) || hostel.lat || (20.5937 + (Math.random() - 0.5) * 0.2);
            const lng = parseFloat(hostel.longitude) || hostel.lng || (78.9629 + (Math.random() - 0.5) * 0.2);
            
            mapBounds.push([lat, lng]);

            const marker = L.marker([lat, lng]).bindPopup(`
                <b>${hostel.name}</b><br>
                ${hostelAddress}<br>
                Rent: ₹${parseInt(hostelPrice).toLocaleString()}/mo<br>
                <a href="hostel-detail.html?id=${hostel.id}" style="color:var(--primary); font-weight:600;">View Full Specs</a>
            `);
            markerLayer.addLayer(marker);
        }
    });

    // Automatically zoom/pan map to fit the current filtered hostels
    if (map && mapBounds.length > 0) {
        map.fitBounds(mapBounds, { padding: [40, 40], maxZoom: 14 });
    }
}

function updateResultsCount(count) {
    const counterEl = document.getElementById('resultsCount');
    if (counterEl) {
        counterEl.innerText = `${count} Hostel${count !== 1 ? 's' : ''} Available`;
    }
}

// ==============================================================
// 🔍 ADVANCED FILTERING ENGINE (MATCHES STUDENT-DASHBOARD.HTML)
// ==============================================================
window.applyAdvancedFilters = function() {
    let filtered = [...allHostels];

    // 1. College / Name / Location Search Input Filter
    const searchInput = document.getElementById('searchCollege');
    if (searchInput && searchInput.value.trim() !== '') {
        const query = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(h => 
            (h.name && h.name.toLowerCase().includes(query)) || 
            (h.address && h.address.toLowerCase().includes(query))
        );
    }

    // 2. Hostel Type Radio Buttons Filter
    const selectedRadio = document.querySelector('input[name="hType"]:checked');
    if (selectedRadio && selectedRadio.value !== 'all') {
        const typeValue = selectedRadio.value.toLowerCase();
        filtered = filtered.filter(h => h.type && h.type.toLowerCase() === typeValue);
    }

    // 3. Price Range Slider Filter
    const priceSlider = document.getElementById('priceRange');
    if (priceSlider) {
        const maxPrice = parseInt(priceSlider.value);
        filtered = filtered.filter(h => parseInt(h.price || 0) <= maxPrice);
    }

    // 4. Room Configuration Filter (AC / Non-AC)
    const acSelect = document.getElementById('acFilter');
    if (acSelect && acSelect.value !== 'all') {
        const targetAc = acSelect.value.toLowerCase(); // 'ac' or 'non-ac'
        filtered = filtered.filter(h => {
            const currentAc = h.ac ? h.ac.toLowerCase() : '';
            return currentAc.includes(targetAc);
        });
    }

    // 5. Bed Setup Layout Filter (Single / Double / Multiple)
    const bedSelect = document.getElementById('bedFilter');
    if (bedSelect && bedSelect.value !== 'all') {
        const targetBed = bedSelect.value.toLowerCase();
        filtered = filtered.filter(h => {
            const currentBed = h.beds ? h.beds.toLowerCase() : '';
            return currentBed.includes(targetBed);
        });
    }

    // 6. Dynamic Checked Amenities Tags Filter Array
    const checkedCheckboxes = document.querySelectorAll('.amenity-cb:checked');
    if (checkedCheckboxes.length > 0) {
        const requiredAmenities = Array.from(checkedCheckboxes).map(cb => cb.value.toLowerCase());
        filtered = filtered.filter(h => {
            // Check into stringified fields from server or object fields from owner dashboard
            const sourceString = (h.amenities || '') + ' ' + (h.water_quality || '') + ' ' + (h.mess_quality || '');
            const normalizedSource = sourceString.toLowerCase();
            return requiredAmenities.every(amenity => normalizedSource.includes(amenity));
        });
    }

    // Re-render components with newly synced records
    renderGlobalHostels(filtered);
    updateResultsCount(filtered.length);
};

// Reset Filter Values back to default state seamlessly
window.resetFilters = function() {
    if (document.getElementById('searchCollege')) document.getElementById('searchCollege').value = '';
    
    const defaultRadio = document.querySelector('input[name="hType"][value="all"]');
    if (defaultRadio) defaultRadio.checked = true;

    const priceSlider = document.getElementById('priceRange');
    if (priceSlider) {
        priceSlider.value = 25000;
        document.getElementById('priceVal').innerText = "Up to ₹25,000";
    }

    if (document.getElementById('acFilter')) document.getElementById('acFilter').value = 'all';
    if (document.getElementById('bedFilter')) document.getElementById('bedFilter').value = 'all';

    document.querySelectorAll('.amenity-cb').forEach(cb => cb.checked = false);

    renderGlobalHostels(allHostels);
    updateResultsCount(allHostels.length);
};

// ==============================================================
// 📋 HOSTEL DETAILS SPECIFICATION VIEWPORT
// ==============================================================
function renderHostelDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const hostelId = urlParams.get('id');
    if (!hostelId) return;

    const hostel = allHostels.find(h => String(h.id) === String(hostelId));
    if (!hostel) return;

    if (document.getElementById('detailName')) document.getElementById('detailName').innerText = hostel.name;
    if (document.getElementById('detailLocation')) document.getElementById('detailLocation').innerText = hostel.address;
    if (document.getElementById('detailPrice')) document.getElementById('detailPrice').innerText = `₹${parseInt(hostel.price || 0).toLocaleString()}/month`;
    
    if (document.getElementById('detailWater')) document.getElementById('detailWater').innerText = hostel.water_quality || hostel.amenities || 'Verified Safe';
    if (document.getElementById('detailMess')) document.getElementById('detailMess').innerText = hostel.mess_quality || 'Available';
    if (document.getElementById('detailCurfew')) document.getElementById('detailCurfew').innerText = hostel.curfew || 'Flexible';

    const galleryContainer = document.getElementById('detailGallery');
    if (galleryContainer) {
        galleryContainer.innerHTML = `
            <div style="width: 100%; height: 420px; border-radius: 12px; overflow: hidden;">
                <img src="${hostel.image}" style="width: 100%; height: 100%; object-fit: cover;" alt="${hostel.name}">
            </div>
        `;
    }

    const blueprintsContainer = document.getElementById('blueprintsContainer');
    if (blueprintsContainer) {
        const specs = hostel.room_specs || { size: hostel.beds || 'Double Bed', bed_type: hostel.ac || 'Non-AC', ac: hostel.ac || 'Non-AC', sharing: hostel.type || 'Standard' };
        const blueprints = [
            { label: "Room Config", value: specs.size || 'Standard Layout', icon: "📐" },
            { label: "Bed Architecture", value: specs.bed_type || 'Standard Architecture', icon: "🛏️" },
            { label: "AC Configuration", value: hostel.ac || specs.ac || 'Non-AC Spec', icon: "❄️" },
            { label: "Sharing Layout", value: hostel.beds || specs.sharing || 'Standard Room', icon: "👥" }
        ];

        blueprintsContainer.innerHTML = blueprints.map(spec => `
            <div class="spec-card">
                <div class="spec-icon">${spec.icon}</div>
                <div class="spec-info">
                    <span class="spec-label">${spec.label}</span>
                    <span class="spec-value">${spec.value}</span>
                </div>
            </div>
        `).join('');
    }
}

// ==============================================================
// 🏢 OWNER PORTAL: WORKFLOWS & MANAGEMENT ENTRIES
// ==============================================================
function renderOwnerInventoryManagement() {
    const managerGrid = document.getElementById('ownerListings');
    if (!managerGrid) return;

    if (ownerHostels.length === 0) {
        managerGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; border: 1px dashed var(--border); border-radius: 12px; width:100%;">
                <p style="color: var(--text-muted); font-size: 1.1rem; margin: 0;">No active properties found in your dashboard listings.</p>
            </div>
        `;
        return;
    }

    managerGrid.innerHTML = ownerHostels.map(hostel => {
        const coverSrc = hostel.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
        const acVal = hostel.room_specs ? hostel.room_specs.ac : (hostel.ac || 'Non-AC');
        return `
            <div class="inventory-management-card">
                <img src="${coverSrc}" class="inventory-card-cover" alt="Cover Space">
                <div class="inventory-card-body">
                    <h3 style="margin: 0 0 6px 0; font-size: 1.25rem; color: var(--text-main);">${hostel.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0 0 12px 0;">📍 ${hostel.address}</p>
                    
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                        <span class="feature-tag" style="font-size: 0.75rem;">${hostel.type}</span>
                        <span class="feature-tag" style="font-size: 0.75rem;">${acVal}</span>
                        <span class="feature-tag" style="font-size: 0.75rem; background: rgba(124,58,237,0.1); color:#a78bfa;">₹${parseInt(hostel.price).toLocaleString()}/mo</span>
                    </div>

                    <div class="inventory-meta-row">
                        <button type="button" class="btn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; font-size: 0.85rem; padding: 0.55rem; width: 100%;" onclick="deletePropertyIndex(${hostel.id})">Delete Listing</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.deletePropertyIndex = function(id) {
    if (!confirm("Are you sure you want to completely delete this property listing?")) return;
    ownerHostels = ownerHostels.filter(h => Number(h.id) !== Number(id));
    localStorage.setItem('owner_created_hostels', JSON.stringify(ownerHostels));
    alert('Listing removed successfully.');
    fetchHostels();
};

async function handleHostelSubmission(event) {
    event.preventDefault();
    const payload = {
        id: Date.now(),
        name: document.getElementById('hName').value.trim(),
        type: document.getElementById('hType').value,
        address: document.getElementById('hAddress').value.trim(),
        price: document.getElementById('hPrice').value,
        ac: document.getElementById('s3') ? document.getElementById('s3').value : 'Non-AC',
        beds: document.getElementById('s4') ? document.getElementById('s4').value : 'Single Bed',
        image: document.getElementById('hImage').value.trim() || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
    };

    ownerHostels.push(payload);
    localStorage.setItem('owner_created_hostels', JSON.stringify(ownerHostels));
    alert('Property listing published successfully!');
    document.getElementById('addHostelForm').reset();
    fetchHostels();
}

// ==============================================================
// ⏱️ DOM SETUP LIFECYCLE INITIALIZATION
// ==============================================================
document.addEventListener('DOMContentLoaded', () => {
    fetchHostels();
    if (document.getElementById('addHostelForm')) {
        document.getElementById('addHostelForm').addEventListener('submit', handleHostelSubmission);
    }
});

function logout() { window.location.href = 'index.html'; }

// ==============================================================
// 🔐 AUTHENTICATION MANAGEMENT & SEAMLESS TOGGLE
// ==============================================================
let selectedRole = 'student';

window.toggleRole = function(role) {
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => {
        if (btn.getAttribute('data-role') === role) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const payload = {
                username: document.getElementById('username').value.trim(),
                password: document.getElementById('password').value,
                role: selectedRole
            };

            try {
                const response = await fetch('http://127.0.0.1:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    localStorage.setItem('user_role', data.role);
                    localStorage.setItem('user_name', data.name);
                    alert(`Login Successful!`);
                    
                    if (data.role === 'owner') {
                        window.location.href = 'owner-dashboard.html';
                    } else {
                        window.location.href = 'student-dashboard.html'; 
                    }
                } else {
                    alert(data.error || "Invalid Credentials.");
                }
            } catch (error) {
                alert("Cannot connect to local Flask server. Run server.py!");
            }
        });
    }
});