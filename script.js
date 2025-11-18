// Add smooth scroll to sections
document.querySelector('.cta').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
});

// Add hover effect to logo letters
document.querySelectorAll('.logo span').forEach(letter => {
  letter.addEventListener('mouseenter', () => {
    letter.style.transform = 'scale(1.2)';
    letter.style.transition = 'transform 0.3s';
  });
  letter.addEventListener('mouseleave', () => {
    letter.style.transform = 'scale(1)';
  });
});
