// Mouse gradient: feed the cursor position to the CSS background.
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--x', e.clientX + 'px');
  document.body.style.setProperty('--y', e.clientY + 'px');
});
