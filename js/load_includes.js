document.addEventListener("DOMContentLoaded", function () {
    const mobileBreakpoint = 992;
    const openSubmenusKey = "openSubmenus";
    const mobileNavScrollKey = "mobileNavScrollTop";
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

    function saveMobileNavScroll() {
        const navCollapseEl = document.getElementById("mainNav");

        if (!navCollapseEl) {
            return;
        }

        sessionStorage.setItem(mobileNavScrollKey, String(navCollapseEl.scrollTop));
    }

    function restoreMobileNavScroll() {
        const navCollapseEl = document.getElementById("mainNav");
        const savedScrollTop = sessionStorage.getItem(mobileNavScrollKey);

        if (!navCollapseEl || savedScrollTop === null) {
            return;
        }

        const scrollTop = Number(savedScrollTop);

        if (Number.isNaN(scrollTop)) {
            sessionStorage.removeItem(mobileNavScrollKey);
            return;
        }

        requestAnimationFrame(() => {
            navCollapseEl.scrollTop = scrollTop;
        });
    }

    function restoreOpenSubmenus() {
        const savedSubmenus = sessionStorage.getItem(openSubmenusKey);

        document.querySelectorAll(".nav-item.dropdown-hover").forEach((item) => {
            item.classList.remove("dropdown-open");
        });

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

    function syncSubmenuToggleState() {
        document.querySelectorAll(".nav-item.dropdown-hover").forEach((item) => {
            const link = item.querySelector(".nav-toggle-link");

            if (link) {
                link.setAttribute("aria-expanded", item.classList.contains("dropdown-open") ? "true" : "false");
            }
        });
    }

    function markActiveHeaderMenu() {
        const currentPath = window.location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll(".mega-list a, .mega-link-only a").forEach((link) => {
            const href = link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            const normalizedHref = href.split("/").pop();

            if (normalizedHref === currentPath) {
                link.classList.add("active");

                const parentNavItem = link.closest(".nav-item.dropdown-hover");
                const parentNavLink = parentNavItem?.querySelector(":scope > .nav-link");

                parentNavLink?.classList.add("active");

                if (window.innerWidth < mobileBreakpoint && parentNavItem) {
                    parentNavItem.classList.add("dropdown-open");
                }
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
            markActiveHeaderMenu();
            restoreOpenSubmenus();
            syncSubmenuToggleState();

            const navCollapseEl = document.getElementById("mainNav");
            const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
            const mobileNavToggle = document.querySelector(".navbar-toggler");
            const mobileNavInstance =
                window.bootstrap && navCollapseEl
                    ? window.bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false })
                    : null;

            function syncMobileNavState(isOpen) {
                document.body.classList.toggle("mobile-nav-open", isOpen && window.innerWidth < mobileBreakpoint);

                if (mobileNavOverlay) {
                    mobileNavOverlay.classList.toggle("is-visible", isOpen && window.innerWidth < mobileBreakpoint);
                }

                if (mobileNavToggle) {
                    mobileNavToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
                }
            }

            function closeMobileNav() {
                if (window.innerWidth >= mobileBreakpoint || !mobileNavInstance || !navCollapseEl.classList.contains("show")) {
                    syncMobileNavState(false);
                    return;
                }

                mobileNavInstance.hide();
            }

            if (navCollapseEl) {
                navCollapseEl.addEventListener("scroll", () => {
                    if (window.innerWidth < mobileBreakpoint) {
                        saveMobileNavScroll();
                    }
                }, { passive: true });

                navCollapseEl.addEventListener("show.bs.collapse", () => {
                    navCollapseEl.classList.remove("is-hiding");
                    restoreOpenSubmenus();
                    syncSubmenuToggleState();
                    restoreMobileNavScroll();
                    syncMobileNavState(true);
                });
                navCollapseEl.addEventListener("hide.bs.collapse", () => {
                    navCollapseEl.classList.add("is-hiding");
                    saveOpenSubmenus();
                    saveMobileNavScroll();
                    syncSubmenuToggleState();
                    syncMobileNavState(false);
                });
                navCollapseEl.addEventListener("hidden.bs.collapse", () => {
                    navCollapseEl.classList.remove("is-hiding");
                    syncSubmenuToggleState();
                    syncMobileNavState(false);
                });
            }

            if (mobileNavOverlay) {
                mobileNavOverlay.addEventListener("click", closeMobileNav);
            }

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
                    syncSubmenuToggleState();
                });
            });

            document.querySelectorAll(".mega-dropdown a").forEach((link) => {
                link.addEventListener("click", function () {
                    if (window.innerWidth >= mobileBreakpoint) {
                        return;
                    }

                    const parentItem = this.closest(".nav-item.dropdown-hover");

                    document.querySelectorAll(".nav-item.dropdown-hover").forEach((item) => {
                        item.classList.remove("dropdown-open");
                    });

                    if (parentItem) {
                        parentItem.classList.add("dropdown-open");
                    }

                    saveOpenSubmenus();
                    syncSubmenuToggleState();
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

    window.addEventListener("resize", () => {
        if (window.innerWidth >= mobileBreakpoint) {
            document.body.classList.remove("mobile-nav-open");
            document.querySelector(".mobile-nav-overlay")?.classList.remove("is-visible");
        }
    });
});
