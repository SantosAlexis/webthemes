(function () {
    "use strict";

    /* ================= CONFIG ================= */
    const STORAGE_PREFIX = "mar_progress:";
    const CHECK_INTERVAL = 500; // ms (ligero)
    let lastActiveIndex = null;

    /* ================= HELPERS ================= */
    function getSectionKey() {
        return STORAGE_PREFIX + location.pathname + location.search;
    }

    function safeJSONParse(value) {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }

    function loadState() {
        return (
            safeJSONParse(localStorage.getItem(getSectionKey())) || {
                viewed: [],
                percent: 0
            }
        );
    }

    function saveState(state) {
        try {
            localStorage.setItem(getSectionKey(), JSON.stringify(state));
        } catch {}
    }

    function getTabs() {
        return document.querySelectorAll(".mar_tab");
    }

    function getNavItems() {
        return document.querySelectorAll(".mar_nav_item");
    }

    function getProgressUI() {
        return {
            fill: document.querySelector(".mar_progress_fill"),
            label: document.querySelector(".mar_progress_label")
        };
    }

    /* ================= PROGRESS ================= */
    function paintProgress(percent) {
        const { fill, label } = getProgressUI();
        if (!fill || !label) return;

        fill.style.width = percent + "%";
        label.textContent = percent + "% del contenido visto";
    }

    function updateProgress(viewedSet) {
        const tabs = getTabs();
        if (!tabs.length) return;

        const percent = Math.round((viewedSet.size / tabs.length) * 100);

        saveState({
            viewed: Array.from(viewedSet),
            percent,
            updatedAt: Date.now()
        });

        paintProgress(percent);
    }

    /* ================= RESTORE ================= */
    function restoreProgress(viewedSet) {
        const navItems = getNavItems();
        viewedSet.forEach((i) => {
            navItems[i]?.classList.add("mar_viewed");
        });
    }

    /* ================= CORE TRACKER ================= */
    function trackActiveTab(viewedSet) {
        const tabs = getTabs();
        const navItems = getNavItems();

        tabs.forEach((tab, index) => {
            if (tab.classList.contains("mar_active")) {
                if (lastActiveIndex === index) return;

                lastActiveIndex = index;

                if (!viewedSet.has(index)) {
                    viewedSet.add(index);
                    navItems[index]?.classList.add("mar_viewed");
                    updateProgress(viewedSet);
                }
            }
        });
    }

    /* ================= INIT ================= */
    function init() {
        const tabs = getTabs();
        const { fill, label } = getProgressUI();
        if (!tabs.length || !fill || !label) return false;

        const saved = loadState();
        const viewedSet = new Set(saved.viewed || []);

        restoreProgress(viewedSet);
        paintProgress(saved.percent || 0);

        /* Desktop clicks */
        getNavItems().forEach((item, i) => {
            item.addEventListener("click", () => {
                if (!viewedSet.has(i)) {
                    viewedSet.add(i);
                    item.classList.add("mar_viewed");
                    updateProgress(viewedSet);
                }
            });
        });

        /* Mobile + desktop (universal) */
        setInterval(() => {
            trackActiveTab(viewedSet);
        }, CHECK_INTERVAL);

        return true;
    }

    /* ================= SAFE BOOT ================= */
    let tries = 0;
    (function safeInit() {
        if (init()) return;
        if (++tries > 10) return;
        setTimeout(safeInit, 300);
    })();

    /* ================= DEBUG RESET ================= */
    window.marResetProgress = function () {
        localStorage.removeItem(getSectionKey());
        location.reload();
    };
})();
