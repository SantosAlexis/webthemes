// Scrtips personalizados para asegurar la compatibildad con el formato Edwise
//Solucion a la limpieza de los iframes que limpia el formato edwise. CARGA DINAMICA

document.addEventListener("DOMContentLoaded", function () {
    const containers = document.querySelectorAll(".mar_dynamicFrame");

    containers.forEach((container) => {
        const link = container.querySelector("a");
        if (!link) return;

        const src = link.getAttribute("href");
        const type = link.textContent.trim().toLowerCase();

        let content = "";

        if (type === "video") {
            content = `
                <div class="mar_videoWrapper">
                    <div class="mar_videoRatio">
                        <iframe
                            loading="lazy"
                            src="${src}"
                            allow="autoplay; fullscreen">
                        </iframe>
                    </div>
                </div>
            `;
        }
        if (type === "genially") {
            content = `
            <hr>
                <div class="mar_geniallyWrapper">
                    <div class="mar_geniallyRatio">
                        <iframe
                            loading="lazy"
                            allow="encrypted-media"
                                allowfullscreen=""
                                gesture="media"
                            src="${src}"
                            title="">
                        </iframe>
                    </div>
                </div>
            `;
        }

        if (type === "pdf") {
            content = `
                <iframe
                    src="${src}"
                    class="mar_pdfFrame"
                    loading="lazy">
                </iframe>
            `;
        }

        if (type === "image") {
            content = `
                <img src="${src}" class="mar_imageFrame" loading="lazy">
            `;
        }

        container.innerHTML = content;
    });
});

//Solucion al problema de ocultar e indice de navegacion del curso

document.addEventListener("DOMContentLoaded", function () {
    // Ejecutar SOLO si existe mar_layout en la página
    if (!document.querySelector(".mar_layout")) {
        return;
    }

    /* ===============================
       Quitar contenido de drawer-toggles
       =============================== */
    const drawerToggles = document.querySelector(".drawer-toggles.d-flex");
    if (drawerToggles) {
        drawerToggles.innerHTML = "";
    }

    /* ===============================
       Modificar drawer izquierdo
       =============================== */
    const drawerLeft = document.getElementById("theme_boost-drawers-courseindex");
    if (drawerLeft) {
        drawerLeft.classList.remove("show");

        if (!drawerLeft.hasAttribute("aria-hidden")) {
            drawerLeft.setAttribute("aria-hidden", "true");
        }
    }

    /* ===============================
       Modificar modal-backdrop específico
       =============================== */
    const modalBackdrop = document.querySelector('.modal-backdrop[data-region="modal-backdrop"]');

    if (modalBackdrop) {
        modalBackdrop.classList.remove("show");
        modalBackdrop.classList.add("hide");
    }

    /* ===============================
       Modificar div #page
       =============================== */
    const page = document.getElementById("page");
    if (page) {
        page.classList.remove("show-drawer-left");
        page.style.overflow = "visible";
    }

    /* =====================================================
       ESTILOS SOLO PARA VISTA MÓVIL (≤768px)
       ===================================================== */
    if (window.matchMedia("(max-width: 768px)").matches) {
        const style = document.createElement("style");
        style.id = "mar-mobile-padding-fix";

        style.innerHTML = `
            @media (max-width: 768px) {
                #page.drawers .main-inner,
                #page.drawers,
                body#page-course-view-remuiformat
                    .remui-format-card.single-section-format
                    .activity-cards
                    .activity > div,
                body#page-course-view-remuiformat
                    .remui-format-card.single-section-format
                    .activity-cards.section
                    .activity > div {
                    padding: 0 1dvw !important;
                }
            }
        `;

        document.head.appendChild(style);
    }
});
