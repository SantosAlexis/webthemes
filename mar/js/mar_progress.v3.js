(function () {
    "use strict";

    /* =====================================================
       CONFIG
    ===================================================== */
    const DEBUG = false; // pon true si quieres logs
    const STORAGE_PREFIX = "mar_progress:";

    function log(...args) {
        if (DEBUG) console.log("[MAR]", ...args);
    }

    /* =====================================================
       CLAVE ÚNICA POR SECCIÓN (ESCALABLE)
       Moodle-safe: sin data-*, sin ids dinámicos
    ===================================================== */
    function getSectionKey() {
        return STORAGE_PREFIX + location.pathname + location.search;
    }

    /* =====================================================
       STORAGE SEGURO
    ===================================================== */
    function loadState() {
        try {
            const raw = localStorage.getItem(getSectionKey());
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            log("Error leyendo storage", e);
            return null;
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(getSectionKey(), JSON.stringify(state));
        } catch (e) {
            log("Error guardando storage", e);
        }
    }

    /* =====================================================
       UI HELPERS
    ===================================================== */
    function getNavItems() {
        return document.querySelectorAll(".mar_nav_item");
    }

    function getProgressUI() {
        return {
            fill: document.querySelector(".mar_progress_fill"),
            label: document.querySelector(".mar_progress_label")
        };
    }

    /* =====================================================
       PINTAR PROGRESO
    ===================================================== */
    function paintProgress(percent) {
        const { fill, label } = getProgressUI();
        if (!fill || !label) return;

        fill.style.width = percent + "%";
        label.textContent = percent + "% del contenido visto";
    }

    /* =====================================================
       CALCULAR Y GUARDAR PROGRESO
    ===================================================== */
    function updateProgress() {
        const items = getNavItems();
        if (!items.length) return;

        const viewed = [];

        items.forEach((item, i) => {
            if (item.classList.contains("mar_viewed")) {
                viewed.push(i);
            }
        });

        const percent = Math.round((viewed.length / items.length) * 100);

        saveState({
            viewed,
            total: items.length,
            percent,
            updatedAt: Date.now()
        });

        paintProgress(percent);
    }

    /* =====================================================
       RESTAURAR ESTADO
    ===================================================== */
    function restoreProgress() {
        const state = loadState();
        if (!state || !Array.isArray(state.viewed)) return;

        const items = getNavItems();

        state.viewed.forEach((i) => {
            if (items[i]) {
                items[i].classList.add("mar_viewed");
            }
        });

        paintProgress(state.percent || 0);
    }

    /* =====================================================
       TRACKING LIGERO (NO MutationObserver)
       Se activa solo cuando hay clicks reales
    ===================================================== */
    function bindNavTracking() {
        const items = getNavItems();
        if (!items.length) return;

        items.forEach((item) => {
            item.addEventListener("click", () => {
                item.classList.add("mar_viewed");
                updateProgress();
            });
        });
    }

    /* =====================================================
       INIT SEGURO
    ===================================================== */
    function init() {
        const items = getNavItems();
        const { fill, label } = getProgressUI();

        if (!items.length || !fill || !label) {
            log("DOM incompleto, reintentando…");
            return false;
        }

        restoreProgress();
        bindNavTracking();
        updateProgress();

        log("Progreso inicializado");
        return true;
    }

    /* =====================================================
       DOM READY + RETRY (blindaje real)
    ===================================================== */
    let tries = 0;
    const MAX_TRIES = 10;

    function safeInit() {
        if (init()) return;
        if (++tries >= MAX_TRIES) return;
        setTimeout(safeInit, 300);
    }

    document.addEventListener("DOMContentLoaded", safeInit);

    /* =====================================================
       DEBUG / RESET MANUAL (por sección)
       localStorage.removeItem(getSectionKey())
    ===================================================== */
    window.marResetProgress = function () {
        localStorage.removeItem(getSectionKey());
        location.reload();
    };
})();
