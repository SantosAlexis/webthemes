document.addEventListener("DOMContentLoaded", () => {
    const layout = document.querySelector(".mar_layout");
    if (!layout) return;

    const tabs = Array.from(layout.querySelectorAll(".mar_tab"));
    const navItems = Array.from(layout.querySelectorAll(".mar_nav_item"));

    const progressFill = layout.querySelector(".mar_progress_fill");
    const progressLabel = layout.querySelector(".mar_progress_label");

    if (!tabs.length || !progressFill || !progressLabel) return;

    const STORAGE_KEY = "mar_progress_" + location.pathname;
    const totalTabs = tabs.length;

    let visited = new Set();

    /* ===============================
       Cargar progreso
    =============================== */
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    if (Array.isArray(saved.visited)) {
        saved.visited.forEach((i) => {
            if (tabs[i]) {
                visited.add(i);
                navItems[i]?.classList.add("mar_viewed");
            }
        });
    }

    /* ===============================
       Helpers
    =============================== */
    function getActiveIndex() {
        return tabs.findIndex((t) => t.classList.contains("mar_active"));
    }

    function updateProgress() {
        const percent = Math.round((visited.size / totalTabs) * 100);
        progressFill.style.width = percent + "%";
        progressLabel.textContent = percent + "% completado";
    }

    function saveProgress(activeIndex) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                visited: Array.from(visited),
                active: activeIndex
            })
        );
    }

    /* ===============================
       Marcar visto
    =============================== */
    function markCurrent() {
        const index = getActiveIndex();
        if (index === -1) return;

        if (!visited.has(index)) {
            visited.add(index);
            navItems[index]?.classList.add("mar_viewed");
            saveProgress(index);
            updateProgress();
        }
    }

    /* ===============================
       Escuchar cambios de tab
    =============================== */
    layout.addEventListener("click", (e) => {
        if (e.target.closest(".mar_nav_item") || e.target.closest(".mar_prev") || e.target.closest(".mar_next")) {
            setTimeout(markCurrent, 50);
        }
    });

    /* ===============================
       Init
    =============================== */
    markCurrent();
    updateProgress();
});
