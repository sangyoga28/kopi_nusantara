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
    // 2. DASHBOARD LOGIC
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

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push({ ...product, qty: 1 });
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();

        const badge = document.querySelector('.badge-cart');
        if (badge) {
            badge.classList.add('bg-danger');
            setTimeout(() => badge.classList.remove('bg-danger'), 200);
        }
    };

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const badges = document.querySelectorAll('.cart-count');
        badges.forEach(b => b.textContent = totalQty);
    }
    updateCartBadge();

    // --- C. Checkout & Print Logic ---
    const orderSummary = document.getElementById('orderSummary');
    const totalPriceEl = document.getElementById('totalPrice');

    if (orderSummary && totalPriceEl) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            orderSummary.innerHTML = '<li class="list-group-item text-center text-muted">Keranjang kosong</li>';
            totalPriceEl.textContent = 'Rp 0';
        } else {
            let total = 0;
            orderSummary.innerHTML = '';
            cart.forEach(item => {
                const subtotal = item.price * item.qty;
                total += subtotal;
                orderSummary.innerHTML += `
                    <li class="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 class="my-0">${item.name}</h6>
                            <small class="text-muted">${item.qty} x Rp ${item.price.toLocaleString()}</small>
                        </div>
                        <span class="text-muted">Rp ${subtotal.toLocaleString()}</span>
                    </li>
                `;
            });
            totalPriceEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
        }
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = document.querySelector('button[type="submit"]');

            // Loading
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Memproses...';
            btn.disabled = true;

            setTimeout(() => {
                // Calculation for receipt
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

                // Show Success & Receipt
                const confirmMsg = `
                    <div class="text-center my-5">
                        <h2 class="text-success mb-3"><i class="bi bi-check-circle-fill"></i> Pembayaran Berhasil!</h2>
                        <p class="lead">Pesanan #${Math.floor(Math.random() * 10000)} sedang diproses.</p>
                        
                        <!-- Receipt Card -->
                        <div class="card p-4 mx-auto shadow-sm text-start bg-white" style="max-width: 400px; border: 1px dashed #6f4e37;">
                            <div class="text-center mb-3">
                                <h5 class="fw-bold text-coffee">PT. Kopi Nusantara</h5>
                                <small>Bukti Pemesanan Elektronik</small>
                            </div>
                            <hr>
                            <ul class="list-unstyled mb-3 small">
                                ${cart.map(i => `<li class="d-flex justify-content-between"><span>${i.qty}x ${i.name}</span> <span>${(i.price * i.qty).toLocaleString()}</span></li>`).join('')}
                            </ul>
                            <hr>
                            <h5 class="d-flex justify-content-between">
                                <span>Total Bayar</span>
                                <span>Rp ${total.toLocaleString()}</span>
                            </h5>
                        </div>

                        <div class="mt-4 no-print">
                            <button class="btn btn-outline-dark me-2" onclick="window.print()"><i class="bi bi-printer"></i> Cetak Bukti</button>
                            <a href="index.html" class="btn btn-coffee" onclick="localStorage.removeItem('cart')">Kembali ke Beranda</a>
                        </div>
                    </div>
                `;

                document.querySelector('.container').innerHTML = confirmMsg;
            }, 1500);
        });
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

});
