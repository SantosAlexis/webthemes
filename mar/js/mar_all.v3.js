document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initSubtopics();
    initSubtabs();
    initSteps();
});

/* =========================
   TABS PRINCIPALES
========================= */
function initTabs() {
    const navItems = [...document.querySelectorAll(".mar_nav_item")];
    const tabs = [...document.querySelectorAll(".mar_tab")];

    if (!navItems.length || !tabs.length) return;

    const mobileTitle = document.querySelector(".mar_nav_title");
    const prevBtn = document.querySelector(".mar_prev");
    const nextBtn = document.querySelector(".mar_next");

    const totalTabs = tabs.length;

    let currentIndex = navItems.findIndex((item) => item.classList.contains("mar_active"));

    if (currentIndex === -1) {
        currentIndex = 0;
        navItems[0].classList.add("mar_active");
        tabs[0].classList.add("mar_active");
    }

    if (mobileTitle) {
        mobileTitle.textContent = navItems[currentIndex].textContent;
    }

    function updateTabs(index) {
        if (index < 0 || index >= totalTabs) return;

        navItems.forEach((i) => i.classList.remove("mar_active"));
        tabs.forEach((t) => t.classList.remove("mar_active"));

        navItems[index].classList.add("mar_active");
        tabs[index].classList.add("mar_active");

        if (mobileTitle) {
            mobileTitle.textContent = navItems[index].textContent;
        }

        currentIndex = index;
    }

    navItems.forEach((item, index) => {
        item.addEventListener("click", () => updateTabs(index));
    });

    prevBtn?.addEventListener("click", () => {
        updateTabs((currentIndex - 1 + totalTabs) % totalTabs);
    });

    nextBtn?.addEventListener("click", () => {
        updateTabs((currentIndex + 1) % totalTabs);
    });
}

/* =========================
   SUBTEMAS (ACORDEÓN)
========================= */
function initSubtopics() {
    document.querySelectorAll(".mar_subtopic_header").forEach((header) => {
        header.addEventListener("click", () => {
            const subtopic = header.closest(".mar_subtopic");
            if (!subtopic) return;

            const container = subtopic.parentElement;
            if (!container) return;

            container.querySelectorAll(".mar_subtopic.mar_open").forEach((open) => {
                if (open !== subtopic) {
                    open.classList.remove("mar_open");
                }
            });

            subtopic.classList.toggle("mar_open");
        });
    });
}

/* =========================
   SUBTABS
========================= */
function initSubtabs() {
    document.querySelectorAll(".mar_subtabs_container").forEach((container) => {
        const buttons = container.querySelectorAll(".mar_subtab_btn");
        const contents = container.querySelectorAll(".mar_subtab_content");

        if (!buttons.length || !contents.length) return;

        buttons.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                container.classList.add("subtab-selected");

                buttons.forEach((b) => b.classList.remove("mar_active"));
                contents.forEach((c) => c.classList.remove("mar_active"));

                btn.classList.add("mar_active");
                contents[index]?.classList.add("mar_active");
            });
        });
    });
}

/* =========================
   STEP CONTENT
========================= */
function initSteps() {
    document.querySelectorAll(".mar_steps_container").forEach((container) => {
        const steps = container.querySelectorAll(".mar_step");
        if (!steps.length) return;

        const prevBtn = container.querySelector(".mar_step_prev");
        const nextBtn = container.querySelector(".mar_step_next");
        const currentLabel = container.querySelector(".mar_step_current");
        const totalLabel = container.querySelector(".mar_step_total");

        let currentIndex = 0;
        const totalSteps = steps.length;

        if (totalLabel) {
            totalLabel.textContent = totalSteps;
        }

        function updateSteps() {
            steps.forEach((step) => step.classList.remove("mar_active"));
            steps[currentIndex].classList.add("mar_active");

            if (currentLabel) {
                currentLabel.textContent = currentIndex + 1;
            }

            prevBtn && (prevBtn.disabled = currentIndex === 0);
            nextBtn && (nextBtn.disabled = currentIndex === totalSteps - 1);
        }

        prevBtn?.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSteps();
            }
        });

        nextBtn?.addEventListener("click", () => {
            if (currentIndex < totalSteps - 1) {
                currentIndex++;
                updateSteps();
            }
        });

        updateSteps();
    });
}
