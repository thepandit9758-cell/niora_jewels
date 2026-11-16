/* NIORA Jewels — Configuration & Interactive Storefront */
const NIORA_CONFIG = {
  brandName: "NIORA Jewels",
  instagramHandle: "@niora__jewels_",
  adminPin: "1111",
  freeShippingAbove: 999,
  shippingFee: 69,
  // Optional: Paste your free Web3Forms Access Key (https://web3forms.com/) to forward
  // Contact Form & Online Orders directly to your email inbox.
  web3formsKey: ""
};

const PRODUCTS = [
  {
    id: "niora-1111-bar",
    name: "11:11 Minimal Bar Necklace",
    category: "Necklaces",
    price: 399,
    tag: "Bestseller",
    image: "./bar-necklace.jpg",
    description: "Dainty gold-toned chain with a sleek rectangular pendant — made for daily layering.",
    specs: ["18k gold-toned alloy", "16 in + 2 in extender", "Lightweight & skin-friendly"]
  },
  {
    id: "niora-noir-heart",
    name: "Noir Heart Gold-Trim Pendant",
    category: "Necklaces",
    price: 449,
    tag: "Signature",
    image: "./heart-necklace.jpg",
    description: "Glossy black heart pendant framed in a delicate gold trim for effortless contrast.",
    specs: ["Enamel & gold-toned finish", "18 in fine link chain", "Tarnish-resistant coat"]
  },
  {
    id: "niora-butterfly-bangle",
    name: "Noir Butterfly Hinged Bangle",
    category: "Bracelets",
    price: 499,
    tag: "New Drop",
    image: "./butterfly-bangle.jpg",
    description: "Sleek hinged gold-toned cuff featuring a sculpted black enamel butterfly motif.",
    specs: ["Easy-clasp hinge lock", "58 mm inner diameter", "Water-resistant finish"]
  },
  {
    id: "niora-star-rings",
    name: "Celestial Star & Stone Ring Set",
    category: "Rings",
    price: 349,
    tag: "Stackable",
    image: "./star-rings.jpg",
    description: "Minimal gold-toned stacking rings accented with star motifs and subtle white stones.",
    specs: ["Set of 3 stackable bands", "Adjustable comfort fit", "Nickel-free finish"]
  },
  {
    id: "niora-studs-card",
    name: "Day-of-the-Week Studs & Pearl Set",
    category: "Earrings",
    price: 379,
    tag: "Gift Pick",
    image: "./studs-set.jpg",
    description: "Curated NIORA earring card combining pearl studs, gold bow studs, and crystal drops.",
    specs: ["3-pair curated set", "Hypoallergenic posts", "Arrives on NIORA gift card"]
  },
  {
    id: "niora-azure-hoops",
    name: "Oxidised Azure Crystal Drop Hoops",
    category: "Earrings",
    price: 429,
    tag: "Oxidised",
    image: "./oxidised-hoops.jpg",
    description: "Artisanal oxidised silver-toned hoops finished with faceted blue crystal teardrops.",
    specs: ["Oxidised silver tone", "Faceted glass crystal", "Secure click-top clasp"]
  }
];



const STORAGE_KEYS = {
  cart: "niora_cart_v1",
  wishlist: "niora_wishlist_v1",
  orders: "niora_orders_v1",
  messages: "niora_messages_v1"
};

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Fallback to in-memory state if storage is restricted
  }
}

const state = {
  cart: loadStorage(STORAGE_KEYS.cart, []),
  wishlist: loadStorage(STORAGE_KEYS.wishlist, []),
  orders: loadStorage(STORAGE_KEYS.orders, []),
  messages: loadStorage(STORAGE_KEYS.messages, []),
  activeCategory: "All",
  searchQuery: "",
  sortBy: "featured",
  adminUnlocked: false,
  activeAdminTab: "orders",
  quickViewId: null,
  lastReceiptText: ""
};

// DOM Elements
const productGrid = document.getElementById("productGrid");
const emptyProductsState = document.getElementById("emptyProductsState");
const categoryPills = document.getElementById("categoryPills");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const bagCountBadge = document.getElementById("bagCountBadge");
const bagDrawer = document.getElementById("bagDrawer");
const bagBackdrop = document.getElementById("bagBackdrop");
const bagItemsContainer = document.getElementById("bagItemsContainer");
const shippingProgress = document.getElementById("shippingProgress");
const bagSubtotal = document.getElementById("bagSubtotal");
const bagShipping = document.getElementById("bagShipping");
const bagTotal = document.getElementById("bagTotal");
const quickViewModal = document.getElementById("quickViewModal");
const checkoutModal = document.getElementById("checkoutModal");
const adminModal = document.getElementById("adminModal");
const toastEl = document.getElementById("toast");

let toastTimer = null;

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 2800);
}

function formatINR(amount) {
  return "\u20B9" + Number(amount).toLocaleString("en-IN");
}

function getFilteredProducts() {
  let list = PRODUCTS.filter((p) => {
    const matchCat = state.activeCategory === "All" || p.category === state.activeCategory;
    const q = state.searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (state.sortBy === "price-asc") {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-desc") {
    list = [...list].sort((a, b) => b.price - a.price);
  }
  return list;
}

function renderProducts() {
  const items = getFilteredProducts();
  if (!items.length) {
    productGrid.innerHTML = "";
    emptyProductsState.classList.remove("hidden");
    return;
  }
  emptyProductsState.classList.add("hidden");

  productGrid.innerHTML = items
    .map((p) => {
      const isSaved = state.wishlist.includes(p.id);
      return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <span class="product-tag">${p.tag}</span>
          <button class="wishlist-btn ${isSaved ? "saved" : ""}" data-action="wishlist" data-id="${p.id}" aria-label="Save to wishlist">
            ${isSaved ? "&#9829;" : "&#9825;"}
          </button>
        </div>
        <div class="product-body">
          <p class="product-cat">${p.category}</p>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="product-footer">
            <span class="product-price">${formatINR(p.price)}</span>
            <div class="product-actions">
              <button class="btn btn-secondary btn-sm" data-action="quickview" data-id="${p.id}">View</button>
              <button class="btn btn-primary btn-sm" data-action="add" data-id="${p.id}">Add</button>
            </div>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function getCartMetrics() {
  const detailed = state.cart
    .map((entry) => {
      const product = PRODUCTS.find((p) => p.id === entry.id);
      return product ? { ...product, qty: entry.qty } : null;
    })
    .filter(Boolean);

  const count = detailed.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = detailed.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= NIORA_CONFIG.freeShippingAbove ? 0 : NIORA_CONFIG.shippingFee;
  const total = subtotal + shipping;
  return { detailed, count, subtotal, shipping, total };
}

function renderBag() {
  const { detailed, count, subtotal, shipping, total } = getCartMetrics();
  bagCountBadge.textContent = count;

  if (subtotal === 0) {
    shippingProgress.textContent = `Free shipping on orders above ${formatINR(NIORA_CONFIG.freeShippingAbove)}`;
  } else if (subtotal >= NIORA_CONFIG.freeShippingAbove) {
    shippingProgress.textContent = "You unlocked Free Pan-India Shipping!";
  } else {
    const remaining = NIORA_CONFIG.freeShippingAbove - subtotal;
    shippingProgress.textContent = `Add ${formatINR(remaining)} more for Free Shipping`;
  }

  if (!detailed.length) {
    bagItemsContainer.innerHTML = `<p class="muted-text" style="text-align:center;padding:36px 10px;">Your jewellery bag is empty. Explore The Signature Edit to add pieces.</p>`;
    document.getElementById("proceedCheckoutBtn").disabled = true;
  } else {
    document.getElementById("proceedCheckoutBtn").disabled = false;
    bagItemsContainer.innerHTML = detailed
      .map(
        (item) => `
      <div class="bag-item">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <p class="bag-item-title">${item.name}</p>
          <span class="bag-item-price">${formatINR(item.price)}</span>
          <div class="qty-controls">
            <button data-cart-action="dec" data-id="${item.id}" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button data-cart-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-cart-action="remove" data-id="${item.id}">Remove</button>
      </div>`
      )
      .join("");
  }

  bagSubtotal.textContent = formatINR(subtotal);
  bagShipping.textContent = shipping === 0 ? "Free" : formatINR(shipping);
  bagTotal.textContent = formatINR(total);
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: productId, qty: 1 });
  }
  saveStorage(STORAGE_KEYS.cart, state.cart);
  renderBag();
  const product = PRODUCTS.find((p) => p.id === productId);
  showToast(`Added ${product ? product.name : "item"} to your bag`);
}

function openBag() {
  bagDrawer.classList.remove("hidden");
  bagBackdrop.classList.remove("hidden");
}

function closeBag() {
  bagDrawer.classList.add("hidden");
  bagBackdrop.classList.add("hidden");
}

function openQuickView(productId) {
  const p = PRODUCTS.find((item) => item.id === productId);
  if (!p) return;
  state.quickViewId = p.id;
  document.getElementById("qvImg").src = p.image;
  document.getElementById("qvImg").alt = p.name;
  document.getElementById("qvCategory").textContent = p.category;
  document.getElementById("qvTitle").textContent = p.name;
  document.getElementById("qvPrice").textContent = formatINR(p.price);
  document.getElementById("qvDesc").textContent = p.description;
  document.getElementById("qvSpecs").innerHTML = p.specs.map((s) => `<li>${s}</li>`).join("");
  quickViewModal.classList.remove("hidden");
}

function openCheckout() {
  const { detailed, total } = getCartMetrics();
  if (!detailed.length) {
    showToast("Add at least one piece to order.");
    return;
  }
  closeBag();
  document.getElementById("checkoutFormWrap").classList.remove("hidden");
  document.getElementById("orderReceiptWrap").classList.add("hidden");
  document.getElementById("checkoutSummaryPill").textContent = `${detailed
    .map((i) => `${i.name} x${i.qty}`)
    .join(", ")} — Total: ${formatINR(total)}`;
  checkoutModal.classList.remove("hidden");
}

async function submitToWeb3Forms(subject, payload) {
  if (!NIORA_CONFIG.web3formsKey) return;
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: NIORA_CONFIG.web3formsKey,
        subject,
        ...payload
      })
    });
  } catch (e) {
    // Offline or blocked network falls back gracefully to built-in Admin storage
  }
}

function renderAdmin() {
  const kpisEl = document.getElementById("adminKpis");
  const ordersPane = document.getElementById("adminOrdersPane");
  const messagesPane = document.getElementById("adminMessagesPane");

  const revenue = state.orders.reduce((sum, o) => sum + o.total, 0);
  kpisEl.innerHTML = `
    <div class="kpi-box"><span>Total Orders</span><strong>${state.orders.length}</strong></div>
    <div class="kpi-box"><span>Order Revenue</span><strong>${formatINR(revenue)}</strong></div>
    <div class="kpi-box"><span>Contact Messages</span><strong>${state.messages.length}</strong></div>
  `;

  if (!state.orders.length) {
    ordersPane.innerHTML = `<p class="muted-text">No online orders yet. Place a test order from the Shopping Bag to see it here.</p>`;
  } else {
    ordersPane.innerHTML = state.orders
      .map(
        (o) => `
      <div class="admin-record">
        <div class="admin-record-head">
          <strong>${o.orderId} &bull; ${o.customerName} (${o.phone})</strong>
          <select class="status-select" data-order-status="${o.orderId}">
            ${["Pending", "Confirmed", "Shipped", "Delivered"]
              .map((st) => `<option value="${st}" ${o.status === st ? "selected" : ""}>${st}</option>`)
              .join("")}
          </select>
        </div>
        <p style="margin:4px 0;"><strong>Items:</strong> ${o.items.map((i) => `${i.name} x${i.qty}`).join(", ")} &bull; <strong>Total:</strong> ${formatINR(o.total)} (${o.paymentMethod})</p>
        <p style="margin:4px 0;color:var(--muted);">${o.address}, ${o.city} - ${o.pincode}${o.notes ? " | Note: " + o.notes : ""}</p>
      </div>`
      )
      .join("");
  }

  if (!state.messages.length) {
    messagesPane.innerHTML = `<p class="muted-text">No contact messages yet. Submit the Contact Form to see inquiries here.</p>`;
  } else {
    messagesPane.innerHTML = state.messages
      .map(
        (m) => `
      <div class="admin-record">
        <div class="admin-record-head">
          <strong>${m.name} (${m.contact}) &bull; ${m.topic}</strong>
          <select class="status-select" data-msg-status="${m.msgId}">
            ${["New", "Read", "Replied"]
              .map((st) => `<option value="${st}" ${m.status === st ? "selected" : ""}>${st}</option>`)
              .join("")}
          </select>
        </div>
        <p style="margin:6px 0 0;">${m.message}</p>
      </div>`
      )
      .join("");
  }
}

// Event Listeners
document.getElementById("mobileMenuBtn").addEventListener("click", () => {
  const nav = document.getElementById("mainNav");
  const open = nav.classList.toggle("open");
  document.getElementById("mobileMenuBtn").setAttribute("aria-expanded", String(open));
});

categoryPills.addEventListener("click", (e) => {
  const btn = e.target.closest(".pill");
  if (!btn) return;
  categoryPills.querySelectorAll(".pill").forEach((el) => {
    el.classList.remove("active");
    el.setAttribute("aria-selected", "false");
  });
  btn.classList.add("active");
  btn.setAttribute("aria-selected", "true");
  state.activeCategory = btn.dataset.category;
  renderProducts();
});

searchInput.addEventListener("input", (e) => {
  state.searchQuery = e.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  renderProducts();
});

document.getElementById("resetFiltersBtn").addEventListener("click", () => {
  state.activeCategory = "All";
  state.searchQuery = "";
  searchInput.value = "";
  categoryPills.querySelectorAll(".pill").forEach((el, idx) => {
    el.classList.toggle("active", idx === 0);
  });
  renderProducts();
});

productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === "add") {
    addToCart(id);
  } else if (action === "quickview") {
    openQuickView(id);
  } else if (action === "wishlist") {
    if (state.wishlist.includes(id)) {
      state.wishlist = state.wishlist.filter((w) => w !== id);
    } else {
      state.wishlist.push(id);
    }
    saveStorage(STORAGE_KEYS.wishlist, state.wishlist);
    renderProducts();
  }
});

bagItemsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cart-action]");
  if (!btn) return;
  const { cartAction, id } = btn.dataset;
  const item = state.cart.find((c) => c.id === id);
  if (!item) return;

  if (cartAction === "inc") {
    item.qty += 1;
  } else if (cartAction === "dec") {
    item.qty -= 1;
    if (item.qty <= 0) state.cart = state.cart.filter((c) => c.id !== id);
  } else if (cartAction === "remove") {
    state.cart = state.cart.filter((c) => c.id !== id);
  }
  saveStorage(STORAGE_KEYS.cart, state.cart);
  renderBag();
});

document.getElementById("openBagBtn").addEventListener("click", openBag);
document.getElementById("closeBagBtn").addEventListener("click", closeBag);
bagBackdrop.addEventListener("click", closeBag);

document.getElementById("closeQuickViewBtn").addEventListener("click", () => quickViewModal.classList.add("hidden"));
document.getElementById("qvAddBtn").addEventListener("click", () => {
  if (state.quickViewId) {
    addToCart(state.quickViewId);
    quickViewModal.classList.add("hidden");
  }
});

document.getElementById("proceedCheckoutBtn").addEventListener("click", openCheckout);
document.getElementById("closeCheckoutBtn").addEventListener("click", () => checkoutModal.classList.add("hidden"));

document.getElementById("checkoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { detailed, subtotal, shipping, total } = getCartMetrics();
  if (!detailed.length) return;

  const orderId = "NR-" + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    orderId,
    createdAt: new Date().toISOString(),
    customerName: document.getElementById("custName").value.trim(),
    phone: document.getElementById("custPhone").value.trim(),
    email: document.getElementById("custEmail").value.trim(),
    address: document.getElementById("custAddress").value.trim(),
    city: document.getElementById("custCity").value.trim(),
    pincode: document.getElementById("custPincode").value.trim(),
    paymentMethod: document.getElementById("custPayment").value,
    notes: document.getElementById("custNotes").value.trim(),
    items: detailed.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
    subtotal,
    shipping,
    total,
    status: "Pending"
  };

  state.orders.unshift(newOrder);
  saveStorage(STORAGE_KEYS.orders, state.orders);
  await submitToWeb3Forms(`New NIORA Order ${orderId}`, {
    customer: newOrder.customerName,
    phone: newOrder.phone,
    total: formatINR(newOrder.total),
    items: newOrder.items.map((i) => `${i.name} x${i.qty}`).join(", "),
    address: `${newOrder.address}, ${newOrder.city} - ${newOrder.pincode}`
  });

  state.cart = [];
  saveStorage(STORAGE_KEYS.cart, state.cart);
  renderBag();

  state.lastReceiptText = `NIORA Order ${orderId}\nName: ${newOrder.customerName}\nPhone: ${newOrder.phone}\nItems: ${newOrder.items
    .map((i) => `${i.name} x${i.qty}`)
    .join(", ")}\nTotal: ${formatINR(newOrder.total)} (${newOrder.paymentMethod})\nAddress: ${newOrder.address}, ${newOrder.city} - ${newOrder.pincode}`;

  document.getElementById("receiptOrderId").textContent = orderId;
  document.getElementById("receiptDetails").innerHTML = `
    <p><strong>Customer:</strong> ${newOrder.customerName} (${newOrder.phone})</p>
    <p><strong>Items:</strong> ${newOrder.items.map((i) => `${i.name} &times; ${i.qty}`).join(", ")}</p>
    <p><strong>Total:</strong> ${formatINR(newOrder.total)} (${newOrder.paymentMethod})</p>
    <p><strong>Shipping to:</strong> ${newOrder.address}, ${newOrder.city} - ${newOrder.pincode}</p>
  `;
  document.getElementById("checkoutFormWrap").classList.add("hidden");
  document.getElementById("orderReceiptWrap").classList.remove("hidden");
  e.target.reset();
});

document.getElementById("copyReceiptBtn").addEventListener("click", () => {
  if (!state.lastReceiptText) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(state.lastReceiptText).then(() => showToast("Order summary copied"));
  } else {
    const ta = document.createElement("textarea");
    ta.value = state.lastReceiptText;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast("Order summary copied");
  }
});

document.getElementById("doneReceiptBtn").addEventListener("click", () => {
  checkoutModal.classList.add("hidden");
});

// Contact Form -> Admin Submission
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = {
    msgId: "MSG-" + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    name: document.getElementById("contactName").value.trim(),
    contact: document.getElementById("contactChannel").value.trim(),
    topic: document.getElementById("contactTopic").value,
    message: document.getElementById("contactMessage").value.trim(),
    status: "New"
  };

  state.messages.unshift(msg);
  saveStorage(STORAGE_KEYS.messages, state.messages);
  await submitToWeb3Forms(`NIORA Contact: ${msg.topic}`, {
    name: msg.name,
    contact: msg.contact,
    message: msg.message
  });

  const statusEl = document.getElementById("contactStatusMsg");
  statusEl.textContent = "Message submitted to NIORA Admin! We will get back to you shortly.";
  statusEl.classList.remove("hidden");
  e.target.reset();
  showToast("Message sent to Admin");
});

// Admin Portal
function openAdminModal() {
  adminModal.classList.remove("hidden");
  if (state.adminUnlocked) {
    document.getElementById("adminLockScreen").classList.add("hidden");
    document.getElementById("adminDashboard").classList.remove("hidden");
    renderAdmin();
  }
}

document.getElementById("openAdminBtn").addEventListener("click", openAdminModal);
document.getElementById("footerAdminBtn").addEventListener("click", openAdminModal);
document.getElementById("closeAdminBtn").addEventListener("click", () => adminModal.classList.add("hidden"));

document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const pin = document.getElementById("adminPinInput").value.trim();
  if (pin === NIORA_CONFIG.adminPin) {
    state.adminUnlocked = true;
    document.getElementById("adminPinError").classList.add("hidden");
    document.getElementById("adminLockScreen").classList.add("hidden");
    document.getElementById("adminDashboard").classList.remove("hidden");
    document.getElementById("adminPinInput").value = "";
    renderAdmin();
  } else {
    document.getElementById("adminPinError").classList.remove("hidden");
  }
});

document.getElementById("adminLockBtn").addEventListener("click", () => {
  state.adminUnlocked = false;
  document.getElementById("adminDashboard").classList.add("hidden");
  document.getElementById("adminLockScreen").classList.remove("hidden");
});

document.querySelector(".admin-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".admin-tab");
  if (!tab) return;
  document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  state.activeAdminTab = tab.dataset.tab;
  document.getElementById("adminOrdersPane").classList.toggle("hidden", state.activeAdminTab !== "orders");
  document.getElementById("adminMessagesPane").classList.toggle("hidden", state.activeAdminTab !== "messages");
});

adminModal.addEventListener("change", (e) => {
  if (e.target.dataset.orderStatus) {
    const order = state.orders.find((o) => o.orderId === e.target.dataset.orderStatus);
    if (order) {
      order.status = e.target.value;
      saveStorage(STORAGE_KEYS.orders, state.orders);
      showToast(`Order ${order.orderId} marked ${order.status}`);
    }
  } else if (e.target.dataset.msgStatus) {
    const msg = state.messages.find((m) => m.msgId === e.target.dataset.msgStatus);
    if (msg) {
      msg.status = e.target.value;
      saveStorage(STORAGE_KEYS.messages, state.messages);
      showToast(`Message marked ${msg.status}`);
    }
  }
});

document.getElementById("exportCsvBtn").addEventListener("click", () => {
  const rows = [
    ["Type", "ID", "Name", "Contact", "Details", "Total/Topic", "Status"],
    ...state.orders.map((o) => [
      "Order",
      o.orderId,
      o.customerName,
      o.phone,
      o.items.map((i) => `${i.name} x${i.qty}`).join("; "),
      o.total,
      o.status
    ]),
    ...state.messages.map((m) => ["Message", m.msgId, m.name, m.contact, m.message, m.topic, m.status])
  ];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "niora_admin_export.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Initialize
renderProducts();
renderBag();
