document.addEventListener("DOMContentLoaded", function () {
    const mobileBreakpoint = 992;
    const openSubmenusKey = "openSubmenus";
    const includeVersion = "20260404b";
    const breadcrumbLinkMap = {
        "홈": "index.html",
        "OfficeGPT (Professional)": "law_solution.html",
        "산업별 솔루션": "law_solution.html",
        "Agent Package": "law_gpt.html",
        "OfficeGPT (Engineering)": "officegpt.html",
        "CAD BOM": "officegpt.html",
        "Document Summary": "docsgpt.html",
        "OfficeERP": "purchase.html",
        "데이터 관리": "purchase.html",
        "업무 처리": "order.html",
        "경영 지원": "analysis.html",
        "회사소개": "overview.html"
    };

    function updateBreadcrumbLinks() {
        document.querySelectorAll(".breadcrumb-item a").forEach((link) => {
            const text = link.textContent.trim();
            const mappedHref = breadcrumbLinkMap[text];

            if (!mappedHref) {
                return;
            }

            if (!link.getAttribute("href") || link.getAttribute("href") === "#") {
                link.setAttribute("href", mappedHref);
            }
        });
    }

    function saveOpenSubmenus() {
        const openSubmenus = [];

        document.querySelectorAll(".nav-item.dropdown-hover.dropdown-open").forEach((item) => {
            const link = item.querySelector(".nav-link");

            if (link) {
                openSubmenus.push(link.textContent.trim());
            }
        });

        sessionStorage.setItem(openSubmenusKey, JSON.stringify(openSubmenus));
    }

    function restoreOpenSubmenus() {
        const savedSubmenus = sessionStorage.getItem(openSubmenusKey);

        if (!savedSubmenus) {
            return;
        }

        let submenus;

        try {
            submenus = JSON.parse(savedSubmenus);
        } catch {
            sessionStorage.removeItem(openSubmenusKey);
            return;
        }

        document.querySelectorAll(".nav-item.dropdown-hover").forEach((item) => {
            const link = item.querySelector(".nav-link");

            if (link && submenus.includes(link.textContent.trim())) {
                item.classList.add("dropdown-open");
            }
        });
    }

    updateBreadcrumbLinks();

    fetch(`header.html?v=${includeVersion}`, { cache: "no-store" })
        .then((r) => r.text())
        .then((d) => {
            const h = document.getElementById("header-placeholder");

            if (!h) {
                return;
            }

            h.outerHTML = d;
            restoreOpenSubmenus();

            document.querySelectorAll(".nav-toggle-link").forEach((link) => {
                link.addEventListener("click", function (e) {
                    if (window.innerWidth >= mobileBreakpoint) {
                        return;
                    }

                    e.preventDefault();

                    const item = this.closest(".nav-item");
                    const isOpen = item.classList.contains("dropdown-open");

                    document
                        .querySelectorAll(".nav-item.dropdown-open")
                        .forEach((openItem) => openItem.classList.remove("dropdown-open"));

                    if (!isOpen) {
                        item.classList.add("dropdown-open");
                    }

                    saveOpenSubmenus();
                });
            });
        });

    fetch(`footer.html?v=${includeVersion}`, { cache: "no-store" })
        .then((r) => r.text())
        .then((d) => {
            const f = document.getElementById("footer-placeholder");

            if (f) {
                f.outerHTML = d;
            }
        });
});
