// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
document.getElementById('navBtn').addEventListener('click', () => {
  document.getElementById('mNav').classList.toggle('hidden');
});

// Contact form → open email client
function sendMail(e) {
  e.preventDefault();
  const name = document.getElementById('n').value.trim();
  const email = document.getElementById('e').value.trim();
  const msg = document.getElementById('m').value.trim();

  const subject = encodeURIComponent('GFXTAB Project enquiry — ' + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);

  window.location.href = `mailto:tabsaiyyad@gmail.com?subject=${subject}&body=${body}`;
}
