document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".mar_tab");
    const navItems = document.querySelectorAll(".mar_nav_item");

    const progressFill = document.querySelector(".mar_progress_fill");
    const progressLabel = document.querySelector(".mar_progress_label");

    if (!tabs.length || !progressFill || !progressLabel) return;

    const STORAGE_KEY = "mar_progress_state";
    const totalTabs = tabs.length;
    const visitedTabs = new Set();

    /* ===============================
        Cargar progreso
    =============================== */
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    if (Array.isArray(saved.visited)) {
        saved.visited.forEach((i) => {
            if (tabs[i]) {
                visitedTabs.add(i);
                navItems[i]?.classList.add("mar_viewed");
            }
        });
    }

    if (typeof saved.active === "number" && tabs[saved.active]) {
        tabs.forEach((t) => t.classList.remove("mar_active"));
        navItems.forEach((n) => n.classList.remove("mar_active"));

        tabs[saved.active].classList.add("mar_active");
        navItems[saved.active]?.classList.add("mar_active");
    }

    /* ===============================
       Actualizar barra
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
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                visited: Array.from(visitedTabs),
                active: activeIndex
            })
        );
    }

    /* ===============================
      Detectar tab activo
    =============================== */
    function trackActiveTab() {
        tabs.forEach((tab, index) => {
            if (tab.classList.contains("mar_active")) {
                if (!visitedTabs.has(index)) {
                    visitedTabs.add(index);
                    navItems[index]?.classList.add("mar_viewed");
                }

                saveState(index);
                updateProgress();
            }
        });
    }

    /* ===============================
       Observar cambios
    =============================== */
    const observer = new MutationObserver(trackActiveTab);

    tabs.forEach((tab) => {
        observer.observe(tab, {
            attributes: true,
            attributeFilter: ["class"]
        });
    });

    /* ===============================
        Init
    =============================== */
    trackActiveTab();

    /* ===============================
  Retomar donde lo dejaste
=============================== */
    const resumeBox = document.getElementById("marResume");
    const resumeText = resumeBox?.querySelector(".mar_resume_text");
    const resumeBtn = resumeBox?.querySelector(".mar_resume_btn");

    if (resumeBox && saved?.visited?.length > 0) {
        const percent = Math.round((saved.visited.length / totalTabs) * 100);

        resumeText.textContent = `Vas en ${percent}% del contenido`;

        resumeBox.classList.remove("hidden");

        resumeBtn.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("mar_active"));
            navItems.forEach((n) => n.classList.remove("mar_active"));

            tabs[saved.active]?.classList.add("mar_active");
            navItems[saved.active]?.classList.add("mar_active");

            document.querySelector(".mar_content")?.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
