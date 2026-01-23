(function () {
    const MAX_RETRIES = 20;
    let retries = 0;

    function initMarProgress() {
        const tabs = document.querySelectorAll(".mar_tab");
        const navItems = document.querySelectorAll(".mar_nav_item");
        const fill = document.querySelector(".mar_progress_fill");
        const label = document.querySelector(".mar_progress_label");

        if (!tabs.length || !fill || !label) {
            if (retries++ < MAX_RETRIES) {
                setTimeout(initMarProgress, 300);
            }
            return;
        }

        const STORAGE_KEY = "mar_progress_" + location.pathname;
        const total = tabs.length;

        let visited = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));

        function getActiveIndex() {
            return [...tabs].findIndex((t) => t.classList.contains("mar_active"));
        }

        function updateUI() {
            const percent = Math.round((visited.size / total) * 100);
            fill.style.width = percent + "%";
            label.textContent = percent + "% completado";

            visited.forEach((i) => {
                navItems[i]?.classList.add("mar_viewed");
            });
        }

        function save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
        }

        function markCurrent() {
            const index = getActiveIndex();
            if (index === -1) return;

            if (!visited.has(index)) {
                visited.add(index);
                navItems[index]?.classList.add("mar_viewed");
                save();
                updateUI();
            }
        }

        // Inicial
        markCurrent();
        updateUI();

        // Click en sidebar
        navItems.forEach((item, i) => {
            item.addEventListener("click", () => {
                visited.add(i);
                save();
                updateUI();
            });
        });

        // Botones móvil
        document.querySelector(".mar_prev")?.addEventListener("click", markCurrent);
        document.querySelector(".mar_next")?.addEventListener("click", markCurrent);
    }

    // Moodle-safe init
    setTimeout(initMarProgress, 500);
})();
