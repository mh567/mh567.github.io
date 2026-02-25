function toggleCategories(button) {
  const expanded = document.getElementById('category-expanded');
  const toggle = document.getElementById('category-toggle');
  
  if (expanded && toggle) {
    if (expanded.style.display === 'none' || expanded.style.display === '') {
      expanded.style.display = 'inline';
      button.textContent = '隐藏分类';
    } else {
      expanded.style.display = 'none';
      const count = expanded.querySelectorAll('.category-link').length;
      toggle.textContent = '显示更多分类 (' + count + ')';
    }
  }
}
