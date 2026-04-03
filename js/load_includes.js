document.addEventListener("DOMContentLoaded", function() {
    fetch('header.html').then(r => r.text()).then(d => {
        const h = document.getElementById('header-placeholder');
        if (h) {
            h.outerHTML = d;
            // Mobile Nav
            document.querySelectorAll(".nav-toggle-link").forEach(l => {
              l.addEventListener("click", function(e) {
                if (window.innerWidth < 992) {
                  e.preventDefault();
                  const p = this.closest(".nav-item");
                  const o = p.classList.contains("dropdown-open");
                  document.querySelectorAll(".nav-item.dropdown-open").forEach(i => i.classList.remove("dropdown-open"));
                  if (!o) p.classList.add("dropdown-open");
                }
              });
            });
        }
    });

    fetch('footer.html').then(r => r.text()).then(d => {
        const f = document.getElementById('footer-placeholder');
        if (f) f.outerHTML = d;
    });
});