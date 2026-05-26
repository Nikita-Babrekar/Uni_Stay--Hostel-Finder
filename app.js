// // Global Map & Data State Variables
// let map;
// let markerLayer;
// let allHostels = [];
// let currentLoginRole = 'student'; // Tracks active portal choice dynamically on the login page

// // 1. Safe Map Setup Layer Initialization
// function initMap() {
//     const mapElement = document.getElementById('map');
//     if (mapElement && !map) {
//         map = L.map('map').setView([20.5937, 78.9629], 5);
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '&copy; OpenStreetMap contributors'
//         }).addTo(map);
        
//         markerLayer = L.layerGroup().addTo(map);
//     }
// }

// // 2. Load API entries pipeline sequence directly from backend server framework
// async function fetchHostels() {
//     try {
//         const response = await fetch('http://127.0.0.1:5000/api/hostels');
//         if (!response.ok) throw new Error('API server pipeline stream offline');
//         const data = await response.json();
        
//         allHostels = data; 
//         console.log("Global dataset stream initialized successfully:", allHostels);
        
//         initMap();
//         renderHostels(allHostels);
//     } catch (error) {
//         console.error("Failed to sync backend server state elements:", error);
//         initMap(); 
//     }
// }

// // 3. Draw properties UI grids dynamically and pin map coordinates markers
// function renderHostels(hostelsList) {
//     const hostelContainer = document.getElementById('hostelList');
//     if (!hostelContainer) return;
    
//     hostelContainer.innerHTML = '';
    
//     if (markerLayer) {
//         markerLayer.clearLayers();
//     }

//     const countTag = document.getElementById('resultsCount');
//     if (countTag) {
//         countTag.innerText = `${hostelsList.length} Results Found`;
//     }

//     if (hostelsList.length === 0) {
//         hostelContainer.innerHTML = `
//             <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
//                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom: 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
//                 <p style="color: var(--text-muted); font-size: 1.1rem;">No properties found in this specific search parameter context.</p>
//             </div>
//         `;
//         return;
//     }

//     hostelsList.forEach(hostel => {
//         const imageSrc = hostel.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
        
//         const card = document.createElement('div');
//         card.className = 'hostel-card animate-slide-up';
//         card.innerHTML = `
//             <div class="hostel-image-wrapper">
//                 <img src="${imageSrc}" class="hostel-image" alt="${hostel.name}" onerror="this.src='https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'">
//                 <span class="hostel-badge">${hostel.type}</span>
//             </div>
//             <div class="hostel-info">
//                 <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
//                     <h3 class="hostel-name">${hostel.name}</h3>
//                     <div style="display: flex; align-items: center; gap: 0.25rem;">
//                         <span style="color: #f59e0b;">★</span>
//                         <span style="font-weight: 600; font-size: 0.875rem;">4.5</span>
//                     </div>
//                 </div>
//                 <p class="hostel-location">
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
//                     ${hostel.address}
//                 </p>
//                 <div class="hostel-features" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
//                     <span class="feature-tag">${hostel.ac}</span>
//                     <span class="feature-tag">${hostel.beds} Bed Setup</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border);">
//                     <div>
//                         <span class="hostel-price">₹${parseInt(hostel.price || 0).toLocaleString()}</span>
//                         <span style="color: var(--text-muted); font-size: 0.875rem;">/mo</span>
//                     </div>
//                     <button class="btn btn-primary" onclick="window.location.href='hostel-detail.html?id=${hostel.id}'">View Details</button>
//                 </div>
//             </div>
//         `;
//         hostelContainer.appendChild(card);

//         const lat = parseFloat(hostel.latitude);
//         const lng = parseFloat(hostel.longitude);
        
//         if (markerLayer && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
//             const pinMarker = L.marker([lat, lng]).bindPopup(`
//                 <div style="font-family: 'Inter', sans-serif; min-width: 150px;">
//                     <b style="color: var(--primary); font-size: 1rem;">${hostel.name}</b><br>
//                     <span style="font-weight: 600;">Rent: ₹${parseInt(hostel.price || 0).toLocaleString()}/mo</span><br>
//                     <small style="color:#64748b; display: block; margin-top: 4px;">${hostel.address}</small>
//                 </div>
//             `);
//             markerLayer.addLayer(pinMarker);
//         }
//     });
// }

// // 4. MAIN ACTION ENGINE: Strict Address Matching System
// function applyAdvancedFilters() {
//     const searchField = document.getElementById('searchCollege');
//     const searchVal = searchField ? searchField.value.toLowerCase().trim() : "";
    
//     const genderOption = document.querySelector('input[name="hType"]:checked')?.value || 'all';
//     const maxBudget = parseInt(document.getElementById('priceRange')?.value) || 25000;
//     const acSetting = document.getElementById('acFilter')?.value || 'all';
//     const bedSetting = document.getElementById('bedFilter')?.value || 'all';

//     const activeAmenities = Array.from(document.querySelectorAll('.amenity-cb:checked')).map(cb => cb.value);

//     let results = allHostels.filter(hostel => {
//         const addressText = hostel.address ? hostel.address.toLowerCase().trim() : "";
//         const nameText = hostel.name ? hostel.name.toLowerCase().trim() : "";
        
//         let matchesLocation = false;
//         if (searchVal === "") {
//             matchesLocation = true;
//         } else {
//             if (addressText.includes(searchVal)) {
//                 matchesLocation = true;
//             } else if (nameText.includes(searchVal)) {
//                 matchesLocation = true;
//             }
//         }

//         const matchesGender = (genderOption === 'all' || hostel.type.toLowerCase() === genderOption.toLowerCase());
//         const matchesCost = parseInt(hostel.price || 0) <= maxBudget;
//         const matchesAc = (acSetting === 'all' || (hostel.ac && hostel.ac.toLowerCase() === acSetting.toLowerCase()));
//         const matchesBedLayout = (bedSetting === 'all' || (hostel.beds && hostel.beds.toLowerCase().includes(bedSetting.toLowerCase())));
        
//         const propertyAmenities = hostel.amenities ? hostel.amenities : "";
//         const matchesChecklist = activeAmenities.every(item => propertyAmenities.includes(item));

//         return matchesLocation && matchesGender && matchesCost && matchesAc && matchesBedLayout && matchesChecklist;
//     });

//     if (results.length === 0 && searchVal !== "") {
//         results = allHostels.filter(hostel => {
//             const addressText = hostel.address ? hostel.address.toLowerCase().trim() : "";
//             return addressText.includes(searchVal);
//         });
        
//         if (results.length > 0) {
//             alert(`No properties matched all specific criteria. Showing all options in "${searchVal.toUpperCase()}" city location instead!`);
//         }
//     }

//     renderHostels(results);

//     if (results.length > 0 && map) {
//         const targetLat = parseFloat(results[0].latitude);
//         const targetLng = parseFloat(results[0].longitude);
//         if (!isNaN(targetLat) && !isNaN(targetLng) && targetLat !== 0) {
//             map.flyTo([targetLat, targetLng], 12, { animate: true, duration: 1.5 });
//         }
//     }
// }

// // 5. Reset Filters Logic Routine
// function resetFilters() {
//     const searchField = document.getElementById('searchCollege');
//     if (searchField) searchField.value = '';

//     const defaultRadio = document.querySelector('input[name="hType"][value="all"]');
//     if (defaultRadio) defaultRadio.checked = true;

//     const priceSlider = document.getElementById('priceRange');
//     if (priceSlider) {
//         priceSlider.value = 25000;
//         const priceVal = document.getElementById('priceVal');
//         if (priceVal) priceVal.innerText = "Up to ₹25,000";
//     }

//     const acSelect = document.getElementById('acFilter');
//     if (acSelect) acSelect.value = 'all';

//     const bedSelect = document.getElementById('bedFilter');
//     if (bedSelect) bedSelect.value = 'all';

//     document.querySelectorAll('.amenity-cb').forEach(cb => cb.checked = false);

//     renderHostels(allHostels);
//     if (map) map.setView([20.5937, 78.9629], 5);
// }

// // ==============================================================
// // ⚡ LOGIN PORTAL ROLE TOGGLE HANDLER
// // ==============================================================
// function toggleRole(roleSelected) {
//     currentLoginRole = roleSelected;
//     document.querySelectorAll('.role-btn').forEach(btn => {
//         btn.classList.remove('active');
//         if (btn.getAttribute('data-role') === roleSelected) {
//             btn.classList.add('active');
//         }
//     });

//     const usernameInput = document.getElementById('username');
//     if (usernameInput) {
//         usernameInput.placeholder = roleSelected === 'owner' ? 'owner username' : 'student / owner';
//     }
// }

// // ==============================================================
// // ⚡ OWNER DASHBOARD LIVE TABS SWITCHER
// // ==============================================================
// function switchOwnerTab(targetTabId) {
//     document.querySelectorAll('.owner-tab').forEach(tabBtn => {
//         tabBtn.classList.remove('active');
//         if (tabBtn.getAttribute('onclick') && tabBtn.getAttribute('onclick').includes(`'${targetTabId}'`)) {
//             tabBtn.classList.add('active');
//         }
//     });

//     document.querySelectorAll('.tab-content').forEach(contentBox => {
//         contentBox.classList.remove('active');
//     });

//     const activeSection = document.getElementById(`tab-${targetTabId}`);
//     if (activeSection) {
//         activeSection.classList.add('active');
//     }
// }

// // ==============================================================
// // ⚡ FIX: PIPELINE INTERCEPTOR WITH TRUE VARIABLE MAPPING FOR CSV
// // ==============================================================
// async function handleHostelSubmission(event) {
//     event.preventDefault();
//     console.log("Submitting form pipeline data to backend...");

//     // Matches the EXACT layout inputs from owner-dashboard.html
//     const nameInput = document.querySelector('input[placeholder="e.g., Green Valley Residency"]');
//     const priceInput = document.querySelector('input[placeholder="e.g., 6500"]');
//     const typeSelect = document.querySelector('select[style*="grid-column"]') || document.querySelectorAll('select')[0];
//     const acSelect = document.querySelectorAll('select')[1];
//     const bedSelect = document.querySelectorAll('select')[2];
//     const addressInput = document.querySelector('textarea[placeholder="Full street address, area, city..."]');

//     // Default parameters for maps (can be updated or set manually)
//     const latitude = "18.5204"; 
//     const longitude = "73.8567";

//     // Grab uploaded file labels or pass dummy fallback path
//     const photoBoxText = document.querySelectorAll('.file-upload')[0]?.querySelector('p')?.innerText || "";
//     const isPhotoUploaded = photoBoxText.includes("Selected");
//     const imagePath = isPhotoUploaded ? "https://images.unsplash.com/photo-1522771731570-8682dc3a4332?auto=format&fit=crop&w=800&q=80" : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";

//     // Collect verified amenities checkboxes
//     const selectedAmenities = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
//         .map(cb => cb.value)
//         .join(',');

//     const payload = {
//         name: nameInput ? nameInput.value.trim() : "Unnamed Property",
//         price: priceInput ? priceInput.value.trim() : "0",
//         type: typeSelect ? typeSelect.value : "Co-ed",
//         ac: acSelect ? acSelect.value : "Non-AC",
//         beds: bedSelect ? bedSelect.value : "Single",
//         address: addressInput ? addressInput.value.trim() : "No Address Provided",
//         latitude: latitude,
//         longitude: longitude,
//         image: imagePath,
//         amenities: selectedAmenities
//     };

//     try {
//         const response = await fetch('http://127.0.0.1:5000/api/hostels', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });

//         const data = await response.json();
        
//         if (response.ok && data.success) {
//             alert('Success! Your listing has been published and securely written to database.');
//             const formElement = document.querySelector('#tab-add form') || document.getElementById('addHostelForm');
//             if (formElement) formElement.reset();
//             switchOwnerTab('listings');
//             renderOwnerListings();
//         } else {
//             throw new Error(data.message || 'Server context pipeline rejection.');
//         }
//     } catch (err) {
//         alert(`Failed to save listing entry: ${err.message}`);
//     }
// }

// // ==============================================================
// // ⚡ FIX: LIVE FILE SELECTION HANDLERS FOR IMAGES & DOCS
// // ==============================================================
// function initFileUploadHandlers() {
//     const photoBox = document.querySelectorAll('.file-upload')[0];
//     const docBox = document.querySelectorAll('.file-upload')[1];

//     if (photoBox && !photoBox.querySelector('input[type="file"]')) {
//         const photoInput = document.createElement('input');
//         photoInput.type = 'file';
//         photoInput.accept = '.png, .jpg, .jpeg';
//         photoInput.multiple = true;
//         photoInput.style.display = 'none';
        
//         photoInput.addEventListener('change', (e) => {
//             const files = e.target.files;
//             if (files.length > 5) {
//                 alert('Maximum 5 photos allowed.');
//                 photoInput.value = '';
//             } else if (files.length > 0) {
//                 photoBox.querySelector('p').innerHTML = `<b style="color:var(--success);">${files.length} Photo(s) Selected Successfully</b>`;
//             }
//         });

//         photoBox.appendChild(photoInput);
//         photoBox.addEventListener('click', () => photoInput.click());
//         photoBox.style.cursor = 'pointer';
//     }

//     if (docBox && !docBox.querySelector('input[type="file"]')) {
//         const docInput = document.createElement('input');
//         docInput.type = 'file';
//         docInput.accept = '.pdf, .png, .jpg';
//         docInput.style.display = 'none';
        
//         docInput.addEventListener('change', (e) => {
//             if (e.target.files.length > 0) {
//                 docBox.querySelector('p').innerHTML = `<b style="color:var(--success);">${e.target.files[0].name} Attached</b>`;
//             }
//         });

//         docBox.appendChild(docInput);
//         docBox.addEventListener('click', () => docInput.click());
//         docBox.style.cursor = 'pointer';
//     }
// }

// function renderOwnerListings() {
//     const ownerContainer = document.getElementById('ownerListings');
//     if (!ownerContainer) return;
//     ownerContainer.innerHTML = `
//         <div style="grid-column: 1/-1; text-align: center; padding: 2rem; border: 2px dashed var(--border); border-radius: 12px;">
//             <p style="color: var(--text-muted);">Syncing live listings directly with database rows configuration data matrix...</p>
//         </div>
//     `;
// }

// // 6. Global Core DOM Event Trigger Context Listeners
// document.addEventListener('DOMContentLoaded', () => {
//     const loginForm = document.getElementById('loginForm');
//     if (loginForm) {
//         loginForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const userVal = document.getElementById('username').value.trim().toLowerCase();
//             if (currentLoginRole === 'owner' || userVal === 'owner') {
//                 window.location.href = 'owner-dashboard.html';
//             } else {
//                 window.location.href = 'student-dashboard.html';
//             }
//         });
//     }

//     // Direct binding wrapper fallback to capture your specific HTML Form markup securely
//     const ownerForm = document.querySelector('#tab-add form');
//     if (ownerForm) {
//         ownerForm.addEventListener('submit', handleHostelSubmission);
//     }

//     if (document.getElementById('ownerListings')) {
//         initFileUploadHandlers();
//         renderOwnerListings();
//     }

//     if (document.getElementById('hostelList')) {
//         fetchHostels();
//     }
// });

// function logout() {
//     window.location.href = 'index.html';
// }

















// Global Map & Data State Variables
let map;
let markerLayer;
let allHostels = [];
let currentLoginRole = 'student'; // Tracks active portal choice dynamically on the login page

// 1. Safe Map Setup Layer Initialization
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

// 2. Load API entries pipeline sequence directly from backend server framework
async function fetchHostels() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/hostels');
        if (!response.ok) throw new Error('API server pipeline stream offline');
        const data = await response.json();
        
        allHostels = data; 
        console.log("Global dataset stream initialized successfully:", allHostels);
        
        // Check if we are on the search dashboard page
        if (document.getElementById('hostelList')) {
            initMap();
            renderHostels(allHostels);
        }
        
        // FIX: Check if we are on the hostel-detail.html page
        if (document.getElementById('detailName')) {
            renderHostelDetails();
        }
    } catch (error) {
        console.error("Failed to sync backend server state elements:", error);
        if (document.getElementById('map')) initMap(); 
    }
}

// ==============================================================
// ⚡ FIX: NEW FUNCTION TO POPULATE HOSTEL-DETAIL.HTML
// ==============================================================
function renderHostelDetails() {
    // 1. Parse the URL to get the '?id=XX' query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hostelId = urlParams.get('id');
    
    if (!hostelId) {
        document.getElementById('detailName').innerText = "Hostel ID not provided";
        return;
    }

    // 2. Find the matching object inside your loaded global dataset array
    const hostel = allHostels.find(h => String(h.id) === String(hostelId));

    if (!hostel) {
        document.getElementById('detailName').innerText = "Hostel Property Not Found";
        return;
    }

    // 3. Bind properties into your HTML Text placeholders safely
    document.getElementById('detailName').innerText = hostel.name || "Unnamed Property";
    document.getElementById('detailLocation').innerText = hostel.address || "No Address Provided";
    document.getElementById('detailPrice').innerText = `₹${parseInt(hostel.price || 0).toLocaleString()}/month`;

    // 4. Inject Image Gallery Layout dynamic element frame
    const galleryContainer = document.getElementById('detailGallery');
    if (galleryContainer) {
        const imageSrc = hostel.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
        galleryContainer.innerHTML = `
            <div style="width: 100%; height: 450px; border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-md);">
                <img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="${hostel.name}" onerror="this.src='https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'">
            </div>
        `;
    }

    // 5. Build dynamic room details description text template box inside main column content
    const infoContainer = document.getElementById('detailInfo');
    if (infoContainer) {
        // Convert the comma separated features string backend yields into standard visual badges
        const featuresList = (hostel.amenities || "").split(',').filter(item => item.trim() !== "");
        let amenitiesHTML = "";
        
        if (featuresList.length > 0) {
            featuresList.forEach(item => {
                amenitiesHTML += `<span class="feature-tag" style="font-size: 0.95rem; padding: 0.5rem 1rem;">${item}</span>`;
            });
        } else {
            amenitiesHTML = `<p style="color: var(--text-muted);">Standard living provisions apply.</p>`;
        }

        infoContainer.innerHTML = `
            <div class="info-section mb-4">
                <h2>About this Accommodation</h2>
                <p style="line-height: 1.6; color: var(--text-main); margin-top: 1rem;">
                    Welcome to <strong>${hostel.name}</strong>. A premium property configured perfectly for structural students lifestyles, situated directly in the area of ${hostel.address}. This facility features a well-monitored, highly structured dynamic environment configured for continuous academic learning security.
                </p>
            </div>

            <div class="info-section mb-4">
                <h2>Room Specifications</h2>
                <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                    <div style="background: var(--background); padding: 1rem 1.5rem; border-radius: 8px; flex: 1; min-width: 120px; text-align: center;">
                        <small style="color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Air Conditioning</small>
                        <strong style="font-size: 1.1rem; color: var(--primary);">${hostel.ac || "Non-AC"}</strong>
                    </div>
                    <div style="background: var(--background); padding: 1rem 1.5rem; border-radius: 8px; flex: 1; min-width: 120px; text-align: center;">
                        <small style="color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Sharing Style</small>
                        <strong style="font-size: 1.1rem; color: var(--primary);">${hostel.beds || "Single"} Room Setup</strong>
                    </div>
                    <div style="background: var(--background); padding: 1rem 1.5rem; border-radius: 8px; flex: 1; min-width: 120px; text-align: center;">
                        <small style="color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Allowed For</small>
                        <strong style="font-size: 1.1rem; color: var(--primary);">${hostel.type || "Co-ed"} Only</strong>
                    </div>
                </div>
            </div>

            <div class="info-section">
                <h2>Included Standard Amenities</h2>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">
                    ${amenitiesHTML}
                </div>
            </div>
        `;
    }
}

// 3. Draw properties UI grids dynamically and pin map coordinates markers
function renderHostels(hostelsList) {
    const hostelContainer = document.getElementById('hostelList');
    if (!hostelContainer) return;
    
    hostelContainer.innerHTML = '';
    
    if (markerLayer) {
        markerLayer.clearLayers();
    }

    const countTag = document.getElementById('resultsCount');
    if (countTag) {
        countTag.innerText = `${hostelsList.length} Results Found`;
    }

    if (hostelsList.length === 0) {
        hostelContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-bottom: 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <p style="color: var(--text-muted); font-size: 1.1rem;">No properties found in this specific search parameter context.</p>
            </div>
        `;
        return;
    }

    hostelsList.forEach(hostel => {
        const imageSrc = hostel.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
        
        const card = document.createElement('div');
        card.className = 'hostel-card animate-slide-up';
        card.innerHTML = `
            <div class="hostel-image-wrapper">
                <img src="${imageSrc}" class="hostel-image" alt="${hostel.name}" onerror="this.src='https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'">
                <span class="hostel-badge">${hostel.type}</span>
            </div>
            <div class="hostel-info">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <h3 class="hostel-name">${hostel.name}</h3>
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <span style="color: #f59e0b;">★</span>
                        <span style="font-weight: 600; font-size: 0.875rem;">4.5</span>
                    </div>
                </div>
                <p class="hostel-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    ${hostel.address}
                </p>
                <div class="hostel-features" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <span class="feature-tag">${hostel.ac}</span>
                    <span class="feature-tag">${hostel.beds} Bed Setup</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border);">
                    <div>
                        <span class="hostel-price">₹${parseInt(hostel.price || 0).toLocaleString()}</span>
                        <span style="color: var(--text-muted); font-size: 0.875rem;">/mo</span>
                    </div>
                    <button class="btn btn-primary" onclick="window.location.href='hostel-detail.html?id=${hostel.id}'">View Details</button>
                </div>
            </div>
        `;
        hostelContainer.appendChild(card);

        const lat = parseFloat(hostel.latitude);
        const lng = parseFloat(hostel.longitude);
        
        if (markerLayer && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            const pinMarker = L.marker([lat, lng]).bindPopup(`
                <div style="font-family: 'Inter', sans-serif; min-width: 150px;">
                    <b style="color: var(--primary); font-size: 1rem;">${hostel.name}</b><br>
                    <span style="font-weight: 600;">Rent: ₹${parseInt(hostel.price || 0).toLocaleString()}/mo</span><br>
                    <small style="color:#64748b; display: block; margin-top: 4px;">${hostel.address}</small>
                </div>
            `);
            markerLayer.addLayer(pinMarker);
        }
    });
}

// 4. MAIN ACTION ENGINE: Advanced Filters Layer
function applyAdvancedFilters() {
    const searchField = document.getElementById('searchCollege');
    const searchVal = searchField ? searchField.value.toLowerCase().trim() : "";
    
    const genderOption = document.querySelector('input[name="hType"]:checked')?.value || 'all';
    const maxBudget = parseInt(document.getElementById('priceRange')?.value) || 25000;
    const acSetting = document.getElementById('acFilter')?.value || 'all';
    const bedSetting = document.getElementById('bedFilter')?.value || 'all';

    const activeAmenities = Array.from(document.querySelectorAll('.amenity-cb:checked')).map(cb => cb.value);

    let results = allHostels.filter(hostel => {
        const addressText = hostel.address ? hostel.address.toLowerCase().trim() : "";
        const nameText = hostel.name ? hostel.name.toLowerCase().trim() : "";
        
        let matchesLocation = false;
        if (searchVal === "") {
            matchesLocation = true;
        } else {
            if (addressText.includes(searchVal)) {
                matchesLocation = true;
            } else if (nameText.includes(searchVal)) {
                matchesLocation = true;
            }
        }

        const matchesGender = (genderOption === 'all' || hostel.type.toLowerCase() === genderOption.toLowerCase());
        const matchesCost = parseInt(hostel.price || 0) <= maxBudget;
        const matchesAc = (acSetting === 'all' || (hostel.ac && hostel.ac.toLowerCase() === acSetting.toLowerCase()));
        const matchesBedLayout = (bedSetting === 'all' || (hostel.beds && hostel.beds.toLowerCase().includes(bedSetting.toLowerCase())));
        
        const propertyAmenities = hostel.amenities ? hostel.amenities : "";
        const matchesChecklist = activeAmenities.every(item => propertyAmenities.includes(item));

        return matchesLocation && matchesGender && matchesCost && matchesAc && matchesBedLayout && matchesChecklist;
    });

    renderHostels(results);
}

// 5. Reset Filters Logic Routine
function resetFilters() {
    const searchField = document.getElementById('searchCollege');
    if (searchField) searchField.value = '';

    const defaultRadio = document.querySelector('input[name="hType"][value="all"]');
    if (defaultRadio) defaultRadio.checked = true;

    const priceSlider = document.getElementById('priceRange');
    if (priceSlider) {
        priceSlider.value = 25000;
        const priceVal = document.getElementById('priceVal');
        if (priceVal) priceVal.innerText = "Up to ₹25,000";
    }

    const acSelect = document.getElementById('acFilter');
    if (acSelect) acSelect.value = 'all';

    const bedSelect = document.getElementById('bedFilter');
    if (bedSelect) bedSelect.value = 'all';

    document.querySelectorAll('.amenity-cb').forEach(cb => cb.checked = false);

    renderHostels(allHostels);
}

// ⚡ ROLE TOGGLE HANDLER
function toggleRole(roleSelected) {
    currentLoginRole = roleSelected;
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-role') === roleSelected) btn.classList.add('active');
    });
}

// ⚡ OWNER DASHBOARD TABS SWITCHER
function switchOwnerTab(targetTabId) {
    document.querySelectorAll('.owner-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(box => box.classList.remove('active'));

    const activeSection = document.getElementById(`tab-${targetTabId}`);
    if (activeSection) activeSection.classList.add('active');
}

// ⚡ POST NEW HOSTEL TO BACKEND CSV
async function handleHostelSubmission(event) {
    event.preventDefault();

    const nameInput = document.querySelector('input[placeholder="e.g., Green Valley Residency"]');
    const priceInput = document.querySelector('input[placeholder="e.g., 6500"]');
    const typeSelect = document.querySelectorAll('select')[0];
    const acSelect = document.querySelectorAll('select')[1];
    const bedSelect = document.querySelectorAll('select')[2];
    const addressInput = document.querySelector('textarea[placeholder="Full street address, area, city..."]');

    const selectedAmenities = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value)
        .join(',');

    const payload = {
        name: nameInput ? nameInput.value.trim() : "Unnamed Property",
        price: priceInput ? priceInput.value.trim() : "0",
        type: typeSelect ? typeSelect.value : "Co-ed",
        ac: acSelect ? acSelect.value : "Non-AC",
        beds: bedSelect ? bedSelect.value : "Single",
        address: addressInput ? addressInput.value.trim() : "No Address",
        latitude: "18.5204",
        longitude: "73.8567",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        amenities: selectedAmenities
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/api/hostels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (response.ok && data.success) {
            alert('Success! Your listing has been published.');
            window.location.reload();
        }
    } catch (err) {
        alert(`Failed to save: ${err.message}`);
    }
}

// ⚡ INITIALIZE FILE CHIPS UI
function initFileUploadHandlers() {
    const photoBox = document.querySelectorAll('.file-upload')[0];
    const docBox = document.querySelectorAll('.file-upload')[1];

    if (photoBox) {
        const photoInput = document.createElement('input');
        photoInput.type = 'file';
        photoInput.accept = '.png, .jpg, .jpeg';
        photoInput.multiple = true;
        photoInput.style.display = 'none';
        photoInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                photoBox.querySelector('p').innerHTML = `<b>${e.target.files.length} Photo(s) Attached</b>`;
            }
        });
        photoBox.appendChild(photoInput);
        photoBox.addEventListener('click', () => photoInput.click());
    }

    if (docBox) {
        const docInput = document.createElement('input');
        docInput.type = 'file';
        docInput.accept = '.pdf, .png, .jpg';
        docInput.style.display = 'none';
        docInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                docBox.querySelector('p').innerHTML = `<b>${e.target.files[0].name} Attached</b>`;
            }
        });
        docBox.appendChild(docInput);
        docBox.addEventListener('click', () => docInput.click());
    }
}

// 6. Global Core DOM Event Trigger Context Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Fire data load routine globally on initialization for both layouts
    fetchHostels();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userVal = document.getElementById('username').value.trim().toLowerCase();
            if (userVal === 'owner') window.location.href = 'owner-dashboard.html';
            else window.location.href = 'student-dashboard.html';
        });
    }

    const ownerForm = document.querySelector('#tab-add form');
    if (ownerForm) {
        ownerForm.addEventListener('submit', handleHostelSubmission);
    }

    if (document.getElementById('ownerListings')) {
        initFileUploadHandlers();
    }
});

function logout() {
    window.location.href = 'index.html';
}