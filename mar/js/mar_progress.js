(function () {
    const STORAGE_KEY = "mar_progress_state";
    let initialized = false;

    // Esperar DOM + estabilidad básica
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", safeInit);
    } else {
        safeInit();
    }

    function safeInit() {
        // Delay corto para Moodle (clave)
        setTimeout(initProgress, 300);
    }

    function initProgress() {
        if (initialized) return;

        const tabs = Array.from(document.querySelectorAll(".mar_tab"));
        const navItems = Array.from(document.querySelectorAll(".mar_nav_item"));
        const progressFill = document.querySelector(".mar_progress_fill");
        const progressLabel = document.querySelector(".mar_progress_label");

        if (!tabs.length || !progressFill || !progressLabel) return;

        initialized = true;

        const totalTabs = tabs.length;
        const visitedTabs = new Set();

        /* ===============================
           Cargar progreso
        =============================== */
        let saved = {};
        try {
            saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        } catch (e) {
            saved = {};
        }

        if (Array.isArray(saved.visited)) {
            saved.visited.forEach((i) => {
                if (tabs[i]) {
                    visitedTabs.add(i);
                    navItems[i]?.classList.add("mar_viewed");
                }
            });
        }

        if (typeof saved.active === "number" && tabs[saved.active]) {
            activateTab(saved.active);
        }

        /* ===============================
           Barra de progreso
        =============================== */
        function updateProgress() {
            const percent = Math.round((visitedTabs.size / totalTabs) * 100);
            progressFill.style.width = `${percent}%`;
            progressLabel.textContent = `${percent}% completado`;
        }

        /* ===============================
           Guardar estado
        =============================== */
        function saveState(activeIndex) {
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        visited: Array.from(visitedTabs),
                        active: activeIndex
                    })
                );
            } catch (e) {
                // storage lleno o bloqueado
            }
        }

        /* ===============================
           Activar tab (centralizado)
        =============================== */
        function activateTab(index) {
            tabs.forEach((t) => t.classList.remove("mar_active"));
            navItems.forEach((n) => n.classList.remove("mar_active"));

            tabs[index]?.classList.add("mar_active");
            navItems[index]?.classList.add("mar_active");

            if (!visitedTabs.has(index)) {
                visitedTabs.add(index);
                navItems[index]?.classList.add("mar_viewed");
            }

            saveState(index);
            updateProgress();
        }

        /* ===============================
           Detectar cambios (modo robusto)
        =============================== */
        const observer = new MutationObserver(() => {
            const activeIndex = tabs.findIndex((t) =>
                t.classList.contains("mar_active")
            );

            if (activeIndex !== -1) {
                activateTab(activeIndex);
            }
        });

        tabs.forEach((tab) => {
            observer.observe(tab, {
                attributes: true,
                attributeFilter: ["class"]
            });
        });

        /* ===============================
           Init inicial
        =============================== */
        const initialIndex = tabs.findIndex((t) =>
            t.classList.contains("mar_active")
        );
        if (initialIndex !== -1) {
            activateTab(initialIndex);
        } else {
            updateProgress();
        }

        /* ===============================
           Retomar donde lo dejaste
        =============================== */
        initResume(saved, activateTab, totalTabs);
    }

    function initResume(saved, activateTab, totalTabs) {
        const resumeBox = document.getElementById("marResume");
        if (!resumeBox || !Array.isArray(saved?.visited)) return;

        const resumeText = resumeBox.querySelector(".mar_resume_text");
        const resumeBtn = resumeBox.querySelector(".mar_resume_btn");

        if (!resumeText || !resumeBtn || saved.visited.length === 0) return;

        const percent = Math.round((saved.visited.length / totalTabs) * 100);
        resumeText.textContent = `Vas en ${percent}% del contenido`;

        resumeBox.classList.remove("hidden");

        resumeBtn.addEventListener("click", () => {
            if (typeof saved.active === "number") {
                activateTab(saved.active);
                document.querySelector(".mar_content")?.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        });
    }
})();
