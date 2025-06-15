function orderNow(product) {
  const message = `Hi! I'm interested in ordering: ${product} from Aranyam Farms. Please share the details.`;
  const phone = "9404132099";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function showCategory(event, category) {
  document.querySelectorAll('.products').forEach(section => section.classList.remove('active'));
  document.querySelectorAll('.category').forEach(btn => btn.classList.remove('selected'));
  document.getElementById(category).classList.add('active');
  event.target.classList.add('selected');
  window.scrollTo({ top: document.getElementById(category).offsetTop - 80, behavior: 'smooth' });
}
