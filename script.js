// ✅ WhatsApp order
function orderNow(product) {
  const message = `Hi! I'm interested in ordering: ${product} from Aranyam Farms. Please share the details.`;
  const phone = "9404132099";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ✅ Category buttons
function showCategory(event, categoryId) {
  document.querySelectorAll('.products').forEach(section => section.classList.remove('active'));
  document.querySelectorAll('.category').forEach(btn => btn.classList.remove('selected'));

  const selectedSection = document.getElementById(categoryId);
  if (selectedSection) {
    selectedSection.classList.add('active');
    const clickedButton = event.currentTarget || event.target;
    clickedButton.classList.add('selected');

    window.scrollTo({
      top: selectedSection.offsetTop - 80,
      behavior: 'smooth'
    });
  }
}

// ✅ Auto-select default category on load (only if on index.html)
window.addEventListener('DOMContentLoaded', () => {
  const defaultCategory = document.querySelector('.category');
  if (defaultCategory) {
    defaultCategory.classList.add('selected');
    const defaultSectionId = defaultCategory.getAttribute('onclick').match(/'([^']+)'/)[1];
    document.getElementById(defaultSectionId)?.classList.add('active');
  }

  // ✅ If we're on cart page, render the cart
  if (document.getElementById("cart-items")) {
    renderCart();
  }

  updateCartCount(); // ✅ Always update cart count
});

// ✅ Scroll-based category highlight
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.products');
  const offset = 100;
  let activeSectionId = null;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < offset && rect.bottom > offset) {
      activeSectionId = section.id;
    }
  });

  if (activeSectionId) {
    document.querySelectorAll('.category').forEach(btn => {
      const categoryId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
      if (categoryId === activeSectionId) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }
});

// ✅ Add to cart function (shared)
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${name} added to cart!`);
}

// ✅ Update cart icon count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = count;
}

// ✅ Cart page logic
function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalAmount = document.getElementById("total-amount");
  const summary = document.getElementById("cart-summary");
  const empty = document.getElementById("empty-cart");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    if (summary) summary.style.display = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  if (summary) summary.style.display = "block";
  if (empty) empty.style.display = "none";

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">₹${item.price} × ${item.quantity} = ₹${itemTotal}</div>
      </div>
      <div class="item-actions">
        <button onclick="updateQty(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQty(${index}, 1)">+</button>
        <button class="remove" onclick="removeItem(${index})">Remove</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);
  });

  totalAmount.textContent = "₹" + total;
}

// ✅ Quantity update
function updateQty(index, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  cart[index].quantity += change;
  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// ✅ Remove item
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// ✅ Redirect to cart
function openCart() {
  window.location.href = "cart.html";
}

// ✅ WhatsApp Checkout
function checkoutCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) return;

  let message = `Hi! I'd like to order the following from Aranyam Farms:\n\n`;
  cart.forEach(item => {
    message += `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\nTotal: ₹${total}`;

  const phone = "9404132099";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
