document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. DATA SIMULASI (DASHBOARD & E-COMMERCE)
    // ==========================================

    // Data Penjualan Bulanan (Dashboard)
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        data: [12500000, 15000000, 14000000, 18000000, 20000000, 22500000, 21000000, 24000000, 26000000, 28000000, 32000000, 35000000]
    };

    // Data Produk (Dashboard & Toko)
    const products = [
        { id: 1, name: 'Latte Signature', price: 28000, category: 'Coffee', image: 'images/latte.png', desc: 'Espresso dengan susu steamed yang lembut dan latte art indah.' },
        { id: 2, name: 'Espresso Single', price: 18000, category: 'Coffee', image: 'images/espresso.png', desc: 'Konsentrat kopi murni dengan crema tebal.' },
        { id: 3, name: 'Cappuccino Classic', price: 30000, category: 'Coffee', image: 'images/cappuccino.png', desc: 'Perpaduan seimbang espresso, susu steamed, dan foam tebal.' },
        { id: 4, name: 'Cafe Mocha', price: 32000, category: 'Coffee', image: 'images/mocha.png', desc: 'Kopi dengan coklat premium dan whipped cream.' },
        { id: 5, name: 'Cold Brew', price: 25000, category: 'Coffee', image: 'images/coldbrew.png', desc: 'Kopi seduh dingin yang segar dan rendah asam.' },
        { id: 6, name: 'Arabica Beans (250g)', price: 85000, category: 'Merchandise', image: 'images/beans.png', desc: 'Biji kopi Arabica pilihan roaster kami.' }
    ];

    // Data Performa untuk Dashboard (Berasal dari simulasi produk di atas)
    const productPerformanceUnits = [2125, 2066, 1800, 1600, 1400, 350];


    // ==========================================
    // 2. PROMO BANNER LOGIC (RICH OFFER WIDGET)
    // ==========================================
    const activePromo = JSON.parse(localStorage.getItem('active_promo'));
    if (activePromo && window.location.pathname.includes('dashboard')) {
        const dashboardContainer = document.querySelector('.container.pb-5');
        if (dashboardContainer) {
            const banner = document.createElement('div');
            // Styling: Modern Gradient Card with Coupon feel
            banner.className = 'card border-0 mb-4 overflow-hidden';
            banner.style.background = 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)';
            banner.style.boxShadow = '0 10px 20px rgba(139, 69, 19, 0.2)';
            banner.style.transform = 'translateY(0)';
            banner.style.transition = 'transform 0.3s ease';

            // Logic for discount display
            const isPercent = activePromo.discountType.includes('%');
            const discountDisplay = isPercent ? activePromo.discountValue + '%' : 'Rp ' + parseInt(activePromo.discountValue).toLocaleString('id-ID');

            banner.innerHTML = `
                <div class="card-body p-0 position-relative">
                    <!-- Decorative Circles -->
                    <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                    
                    <div class="row g-0 align-items-center p-4">
                        <div class="col-md-8 text-white position-relative" style="z-index: 1;">
                            <div class="d-inline-block bg-warning text-dark fw-bold px-3 py-1 rounded-pill small mb-2 shadow-sm">
                                <i class="bi bi-star-fill me-1"></i> SPECIAL OFFER
                            </div>
                            <h2 class="fw-bold mb-1 display-6">${activePromo.promoName}</h2>
                            <p class="mb-0 opacity-90" style="font-size: 1.1rem;">
                                <i class="bi bi-calendar-check me-2"></i>Berlaku: ${new Date(activePromo.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${new Date(activePromo.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                        
                        <div class="col-md-4 text-center text-white position-relative mt-3 mt-md-0" style="z-index: 1;">
                            <div class="p-3 bg-white text-coffee rounded-3 shadow-lg" style="transform: rotate(-2deg);">
                                <small class="text-uppercase fw-bold text-muted ls-1">Diskon Hingga</small>
                                <div class="display-4 fw-bold text-danger my-1">${discountDisplay}</div>
                                <div class="small fw-bold border-top border-secondary pt-2 mt-2 border-opacity-25 text-muted">
                                    KODE: <span class="user-select-all text-dark">DISKON2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Close Button -->
                    <button class="btn btn-sm text-white position-absolute top-0 end-0 m-2 opacity-50 hover-opacity-100" 
                            onclick="localStorage.removeItem('active_promo'); this.closest('.card').remove();"
                            title="Hapus Kampanye">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            `;

            // Insert with animation
            banner.style.opacity = '0';
            dashboardContainer.insertBefore(banner, dashboardContainer.firstChild);

            // Trigger reflow/animation
            requestAnimationFrame(() => {
                banner.style.transition = 'all 0.5s ease';
                banner.style.opacity = '1';
                banner.style.transform = 'translateY(0)';
            });
        }
    }

    // ==========================================
    // 3. DASHBOARD LOGIC
    // ==========================================

    if (document.getElementById('salesTrendChart')) {
        // --- Perhitungan KPI ---
        function formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
        }

        const totalRevenue = salesData.data.reduce((a, b) => a + b, 0);
        const totalUnits = productPerformanceUnits.reduce((a, b) => a + b, 0);
        const avgTransaction = totalUnits > 0 ? Math.round(totalRevenue / totalUnits) : 0;

        document.getElementById('kpiTotalRevenue').textContent = formatCurrency(totalRevenue);
        document.getElementById('kpiTotalUnits').textContent = totalUnits.toLocaleString('id-ID');
        document.getElementById('kpiAvgTransaction').textContent = formatCurrency(avgTransaction);

        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('id-ID', dateOptions);

        // --- Chart.js ---
        Chart.defaults.font.family = "'Poppins', sans-serif";
        Chart.defaults.color = '#6f4e37';

        // Grafik 1: Line Chart
        const ctxTrend = document.getElementById('salesTrendChart').getContext('2d');
        const gradientFill = ctxTrend.createLinearGradient(0, 0, 0, 400);
        gradientFill.addColorStop(0, 'rgba(111, 78, 55, 0.4)');
        gradientFill.addColorStop(1, 'rgba(111, 78, 55, 0.0)');

        new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: salesData.labels,
                datasets: [{
                    label: 'Pendapatan (IDR)',
                    data: salesData.data,
                    borderColor: '#6f4e37',
                    backgroundColor: gradientFill,
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#6f4e37',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: function (val) { return 'Rp ' + val / 1000000 + ' Jt'; } }
                    },
                    x: { grid: { display: false } }
                }
            }
        });

        // Grafik 2: Bar Chart
        const ctxProduct = document.getElementById('productPerfChart').getContext('2d');
        new Chart(ctxProduct, {
            type: 'bar',
            data: {
                labels: products.map(p => p.name),
                datasets: [{
                    label: 'Unit Terjual',
                    data: productPerformanceUnits,
                    backgroundColor: ['#4b3621', '#6f4e37', '#8b6b4e', '#a1887f', '#bcaaa4', '#d7ccc8'],
                    borderRadius: 5
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true }, y: { grid: { display: false } } }
            }
        });
    }


    // ==========================================
    // 3. E-COMMERCE LOGIC
    // ==========================================

    // --- A. Render Produk ---
    const productContainer = document.getElementById('productContainer');
    if (productContainer) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${product.image}" onerror="this.src='https://via.placeholder.com/300x200?text=Produk'" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold text-coffee">${product.name}</h5>
                            <p class="card-text text-muted small">${product.desc}</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="fw-bold fs-5">Rp ${product.price.toLocaleString('id-ID')}</span>
                                <button class="btn btn-outline-coffee btn-sm rounded-pill px-3" onclick="addToCart(${product.id})">
                                    <i class="bi bi-cart-plus"></i> + Keranjang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += card;
        });
    }

    // --- B. Cart System ---
    window.addToCart = function (productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            if (product) {
                cart.push({ ...product, qty: 1 });
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();

        if (product) {
            showAddToCartToast(product.name);
        }

        const badge = document.querySelector('.badge-cart');
        if (badge) {
            badge.classList.add('bg-danger');
            setTimeout(() => badge.classList.remove('bg-danger'), 200);
        }
    };

    function showAddToCartToast(productName) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.cart-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'cart-toast shadow-lg';
        toast.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-success fs-5"></i>
                <div>
                    <div class="fw-bold small">Berhasil!</div>
                    <div class="small">${productName} masuk keranjang</div>
                </div>
            </div>
        `;

        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '85px',
            right: '20px',
            backgroundColor: 'white',
            borderLeft: '4px solid #4caf50',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: '9999',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transform: 'translateX(120%)'
        });

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const badges = document.querySelectorAll('.cart-count');
        badges.forEach(b => b.textContent = totalQty);
    }
    updateCartBadge();

    // --- C. Checkout & Print Logic (Enhanced) ---
    const orderSummary = document.getElementById('orderSummary');
    const totalPriceEl = document.getElementById('totalPrice');

    if (orderSummary && totalPriceEl) {
        function renderCheckoutList() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            orderSummary.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                orderSummary.innerHTML = '<li class="list-group-item text-center text-muted">Keranjang kosong</li>';
                totalPriceEl.textContent = 'Rp 0';
                return;
            }

            cart.forEach((item, index) => {
                total += item.price * item.qty;
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center lh-sm';
                li.innerHTML = `
                    <div class="flex-grow-1">
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">Rp ${item.price.toLocaleString()} x ${item.qty}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="text-muted me-3">Rp ${(item.price * item.qty).toLocaleString()}</span>
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-secondary px-2" onclick="updateCartItem(${index}, -1)">-</button>
                            <button type="button" class="btn btn-outline-secondary px-2" disabled>${item.qty}</button>
                            <button type="button" class="btn btn-outline-secondary px-2" onclick="updateCartItem(${index}, 1)">+</button>
                            <button type="button" class="btn btn-outline-danger px-2 ms-1" onclick="updateCartItem(${index}, 0)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                orderSummary.appendChild(li);
            });
            totalPriceEl.textContent = 'Rp ' + total.toLocaleString();
        }

        // Global Update Function
        window.updateCartItem = function (index, change) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (change === 0) {
                if (confirm('Hapus item ini?')) cart.splice(index, 1);
            } else {
                cart[index].qty += change;
                if (cart[index].qty < 1) {
                    if (confirm('Hapus item ini?')) {
                        cart.splice(index, 1);
                    } else {
                        cart[index].qty = 1;
                    }
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCheckoutList();
            updateCartBadge();
        };

        renderCheckoutList();
    }


    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = document.querySelector('button[type="submit"]');
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const address = document.getElementById('address').value;
            const notes = document.getElementById('customerNotes')?.value || '-';

            // Loading
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Memproses...';
            btn.disabled = true;

            setTimeout(() => {
                // Generate Receipt HTML
                const orderId = Math.floor(Math.random() * 100000);
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

                const receiptHTML = `
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-bottom">
                            <h6 class="mb-0 fw-bold text-center">Resi Pesanan #${orderId}</h6>
                        </div>
                        <div class="card-body small" style="font-family: 'Courier New', Courier, monospace;">
                             <div class="text-center mb-3">
                                <strong>PT. KOPI NUSANTARA</strong><br>
                                ${new Date().toLocaleDateString('id-ID')}
                             </div>
                             
                             <table class="w-100 mb-3">
                                ${cart.map(item => `
                                    <tr>
                                        <td>${item.qty}x ${item.name}</td>
                                        <td class="text-end">Rp ${(item.price * item.qty).toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                             </table>
                             
                             <div class="border-top border-bottom py-2 mb-3">
                                <div class="d-flex justify-content-between fw-bold">
                                    <span>TOTAL</span>
                                    <span>Rp ${total.toLocaleString()}</span>
                                </div>
                             </div>
                             
                             <div class="mb-3">
                                <strong>Dikirim ke:</strong><br>
                                ${firstName} ${lastName}<br>
                                ${address}
                             </div>

                             <div class="text-center text-muted fst-italic">
                                "${notes}"
                             </div>
                        </div>
                        <div class="card-footer bg-white border-0 text-center pb-3 d-print-none">
                            <button class="btn btn-sm btn-outline-dark" onclick="window.print()">
                                <i class="bi bi-printer me-1"></i> Cetak Resi
                            </button>
                        </div>
                    </div>
                `;

                // Inject Receipt Inline
                document.getElementById('receiptContainer').innerHTML = receiptHTML;

                // Inject for Print (Reuse same logic/content but cleaned up if needed, or just formatted via CSS)
                document.getElementById('printableArea').innerHTML = `
                    <div style="font-family: 'Courier New', Courier, monospace; color: black; padding: 20px;">
                        <h2 style="text-align: center;">PT. KOPI NUSANTARA</h2>
                        <p style="text-align: center; border-bottom: 2px dashed black; padding-bottom: 10px;">INVOICE #${orderId}</p>
                        ${receiptHTML}
                    </div>
                `;

                // Show Success Toast
                const toastEl = document.getElementById('successToast');
                const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
                toast.show();

                // Reset Button State
                btn.innerHTML = 'Bayar Sekarang';
                btn.disabled = false;

                // Clear Data
                localStorage.removeItem('cart');
                document.getElementById('checkoutForm').reset();
                updateCartBadge(); // Ensure cart 0
            }, 1000);
        });

        // Global Print Function triggered by Modal Button
        window.printReceipt = function () {
            window.print();
        };
    }

    // ==========================================
    // 4. PETITION BOARD (Public & Expiring)
    // ==========================================

    function renderPetitions() {
        const petitionList = document.getElementById('petitionList');
        if (!petitionList) return;

        const now = new Date().getTime();
        const expiryTime = 24 * 60 * 60 * 1000; // 24 Hours

        let petitions = JSON.parse(localStorage.getItem('public_petitions')) || [];
        // Filter expired
        petitions = petitions.filter(p => (now - p.timestamp) < expiryTime);
        localStorage.setItem('public_petitions', JSON.stringify(petitions));

        petitionList.innerHTML = '';
        if (petitions.length === 0) {
            petitionList.innerHTML = '<p class="text-muted text-center fst-italic py-3">Belum ada aspirasi terbaru hari ini.</p>';
        } else {
            petitions.reverse().forEach(p => {
                const timeAgo = Math.round((now - p.timestamp) / 1000 / 60);
                let timeString = timeAgo < 60 ? `${timeAgo} menit lalu` : `${Math.floor(timeAgo / 60)} jam lalu`;

                const item = `
                    <div class="list-group-item border-0 border-bottom">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1 fw-bold text-coffee">${p.name}</h6>
                            <small class="text-muted" style="font-size: 0.8rem;">${timeString}</small>
                        </div>
                        <p class="mb-1 small">${p.message}</p>
                    </div>
                `;
                petitionList.innerHTML += item;
            });
        }
    }
    renderPetitions();

    // Logic Input Petisi
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = document.getElementById('inputName').value;
            const message = document.getElementById('inputMessage').value;

            const newPetition = {
                name: name,
                message: message,
                timestamp: new Date().getTime()
            };

            let petitions = JSON.parse(localStorage.getItem('public_petitions')) || [];
            petitions.push(newPetition);
            localStorage.setItem('public_petitions', JSON.stringify(petitions));

            document.getElementById('formSuccessMessage')?.classList.remove('d-none');
            event.target.reset();
            renderPetitions();

            setTimeout(() => {
                document.getElementById('formSuccessMessage')?.classList.add('d-none');
            }, 5000);
        });
    }


    // ==========================================
    // 5. UTILS
    // ==========================================

    // Print Global Fnc
    window.printOrder = function () { window.print(); };

    // Active Navbar
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.href.includes(path.split('/').pop())) {
            link.classList.add('active');
            link.classList.add('fw-bold');
        }
    });

    // Supplier Form Print
    const supplierForm = document.getElementById('supplierForm');
    if (supplierForm) {
        supplierForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('PO telah dibuat! Silakan cetak halaman ini.');
            const btn = document.querySelector('button[type="submit"]');
            btn.textContent = 'Cetak Invoice order';
            btn.onclick = window.printOrder;
            btn.type = 'button';
            btn.classList.add('btn-warning');
            btn.classList.remove('btn-coffee');
        });
    }

    // ==========================================
    // 6. SALES HISTORY LOGIC
    // ==========================================
    const historyTableBody = document.getElementById('historyTableBody');
    if (historyTableBody) {
        // Generate Dummy History Data (Enhanced for specific periods)
        const dummyHistory = [];
        const statuses = ['Selesai', 'Selesai', 'Selesai', 'Pending', 'Batal'];
        const methods = ['QRIS', 'Transfer Bank', 'Tunai', 'Kartu Kredit'];

        const addMockTrx = (date) => {
            const p1 = products[Math.floor(Math.random() * products.length)];
            const p2 = Math.random() > 0.7 ? products[Math.floor(Math.random() * products.length)] : null;
            const items = [p1];
            if (p2) items.push(p2);
            const total = items.reduce((acc, curr) => acc + curr.price, 0);

            dummyHistory.push({
                id: 'TRX-' + Math.floor(10000 + Math.random() * 90000),
                date: new Date(date),
                items: items.map(i => i.name).join(', '),
                total: total,
                method: methods[Math.floor(Math.random() * methods.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)]
            });
        };

        const today = new Date();

        // 1. Data Minggu Ini (15 transaksi)
        for (let i = 0; i < 15; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - Math.floor(Math.random() * 7));
            d.setHours(Math.random() * 23, Math.random() * 59);
            addMockTrx(d);
        }

        // 2. Data Bulan Ini (Selain minggu ini, 25 transaksi)
        for (let i = 0; i < 25; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - (7 + Math.floor(Math.random() * 20))); // 7-27 hari lalu
            d.setHours(Math.random() * 23, Math.random() * 59);
            addMockTrx(d);
        }

        // 3. Data Tahun Ini (Selain bulan ini, 60 transaksi)
        for (let i = 0; i < 60; i++) {
            const d = new Date(today);
            d.setMonth(today.getMonth() - (1 + Math.floor(Math.random() * 10))); // 1-10 bulan lalu
            d.setDate(Math.floor(Math.random() * 28) + 1);
            d.setHours(Math.random() * 23, Math.random() * 59);
            addMockTrx(d);
        }

        dummyHistory.sort((a, b) => b.date - a.date);

        // Pagination State
        let currentPage = 1;
        const itemsPerPage = 10;
        let currentFilter = 'monthly';

        function renderHistory(filter = 'monthly', page = 1) {
            currentFilter = filter;
            currentPage = page;
            historyTableBody.innerHTML = '';

            const paginationContainer = document.getElementById('paginationContainer');
            if (paginationContainer) paginationContainer.innerHTML = '';

            const now = new Date();
            const filteredData = dummyHistory.filter(item => {
                if (filter === 'all') return true;
                const diffTime = Math.abs(now - item.date);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (filter === 'weekly') return diffDays <= 7;
                if (filter === 'monthly') return item.date.getMonth() === now.getMonth() && item.date.getFullYear() === now.getFullYear();
                if (filter === 'yearly') return item.date.getFullYear() === now.getFullYear();
                return true;
            });

            if (filteredData.length === 0) {
                historyTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Data tidak ditemukan untuk periode ini.</td></tr>';
                document.getElementById('showingInfo').textContent = 'Menampilkan 0 data';
                return;
            }

            // Pagination Slicing
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedData = filteredData.slice(start, end);

            paginatedData.forEach(trx => {
                const statusClass = trx.status === 'Selesai' ? 'bg-success' : (trx.status === 'Pending' ? 'bg-warning text-dark' : 'bg-danger');
                const row = `
                    <tr>
                        <td class="ps-4 fw-bold small">${trx.id}</td>
                        <td>
                            <div class="fw-bold">${trx.date.toLocaleDateString('id-ID')}</div>
                            <small class="text-muted">${trx.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</small>
                        </td>
                        <td class="small text-wrap" style="max-width: 200px;">${trx.items}</td>
                        <td class="fw-bold text-coffee">Rp ${trx.total.toLocaleString('id-ID')}</td>
                        <td class="small">${trx.method}</td>
                        <td><span class="badge ${statusClass} rounded-pill">${trx.status}</span></td>
                    </tr>
                `;
                historyTableBody.innerHTML += row;
            });

            document.getElementById('showingInfo').textContent = `Menampilkan ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} data`;

            // Pagination Rendering
            if (paginationContainer && totalPages > 1) {
                let paginationHTML = '';

                // Prev
                paginationHTML += `<li class="page-item ${page === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${page - 1}); return false;">Sebelumnya</a>
                </li>`;

                // Pages
                for (let i = 1; i <= totalPages; i++) {
                    const activeClass = i === page ? 'active bg-coffee border-coffee' : 'text-coffee';
                    paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}">
                        <a class="page-link ${activeClass}" href="#" onclick="changePage(${i}); return false;">${i}</a>
                    </li>`;
                }

                // Next
                paginationHTML += `<li class="page-item ${page === totalPages ? 'disabled' : ''}">
                    <a class="page-link text-coffee" href="#" onclick="changePage(${page + 1}); return false;">Selanjutnya</a>
                </li>`;

                paginationContainer.innerHTML = paginationHTML;
            }
        }

        // Global function for onclick
        window.changePage = function (newPage) {
            renderHistory(currentFilter, newPage);
        };

        // Init
        renderHistory();

        const filterSelect = document.getElementById('filterPeriod');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                renderHistory(e.target.value, 1);
            });
        }
    }

});
