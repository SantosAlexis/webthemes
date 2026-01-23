(function () {
    // Ejecutar solo cuando el DOM esté listo
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDynamicLinks);
    } else {
        initDynamicLinks();
    }

    function initDynamicLinks() {
        try {
            const cards = document.querySelectorAll(".mar_dynamicLink");
            if (!cards || !cards.length) return;

            cards.forEach((card) => {
                try {
                    if (!card || card.dataset.marLinked === "true") return;

                    const link = card.querySelector("a[href]");
                    if (!link) return;

                    const url = link.getAttribute("href");
                    if (!url) return;

                    const target = link.getAttribute("target") || "_blank";

                    // Neutralizar el <a> sin eliminarlo (Moodle safe)
                    link.removeAttribute("href");
                    link.setAttribute("tabindex", "-1");
                    link.setAttribute("aria-hidden", "true");
                    link.style.display = "none";

                    // Marcar como procesado
                    card.dataset.marLinked = "true";

                    // Accesibilidad + UX
                    card.setAttribute("role", "link");
                    card.setAttribute("tabindex", "0");

                    // Click
                    card.addEventListener("click", () => {
                        window.open(url, target, "noopener");
                    });

                    // Teclado
                    card.addEventListener("keydown", (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            window.open(url, target, "noopener");
                        }
                    });
                } catch (innerError) {
                    // No romper el resto por una tarjeta
                    console.warn("[mar_dynamicLink] Error en tarjeta:", innerError);
                }
            });
        } catch (error) {
            console.warn("[mar_dynamicLink] Init falló:", error);
        }
    }
})();
