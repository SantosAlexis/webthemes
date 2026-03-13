(function () {
    "use strict";

    function resetMarProgress() {
        try {
            if (!window.localStorage) return;

            Object.keys(localStorage)
                .filter(function (key) {
                    return key.startsWith("mar_");
                })
                .forEach(function (key) {
                    localStorage.removeItem(key);
                });

            console.log("localStorage mar_ limpiado");

            // Reiniciar barra visual si existe
            var fill = document.querySelector(".mar_progress_fill");
            var label = document.querySelector(".mar_progress_label");

            if (fill) {
                fill.style.width = "0%";
            }

            if (label) {
                label.textContent = "0% contenido explorado";
            }

            // Opcional: recargar después de 500ms
            setTimeout(function () {
                location.reload();
            }, 500);
        } catch (e) {
            console.warn("Error al reiniciar progreso", e);
        }
    }

    function bindResetButton() {
        var btn = document.querySelector(".mar_reset_button2");
        if (!btn) return;

        btn.addEventListener("click", resetMarProgress);

        btn.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                resetMarProgress();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", bindResetButton);
})();
