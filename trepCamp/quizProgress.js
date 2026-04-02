(function () {
    function waitForRequire(callback) {
        if (typeof require !== "undefined") {
            callback();
        } else {
            setTimeout(function () {
                waitForRequire(callback);
            }, 50);
        }
    }

    waitForRequire(function () {
        require(["jquery"], function ($) {
            $(function () {
                if (!$("body").hasClass("path-mod-quiz")) return;
                if (!$(".qnbutton").length) return;
                if ($("#quiz-progress-wrapper").length) return;

                let target = $(".quizattempt").first();
                if (!target.length) target = $("#region-main");
                if (!target.length) return;

                target.before(`
          <div id="quiz-progress-wrapper">
            <div id="quiz-progress-bar">
              <div id="quiz-progress-fill"></div>
            </div>
            <div id="quiz-progress-text"></div>
          </div>
        `);

                let last = -1;

                function getProgress() {
                    let total = $(".qnbutton").length;
                    let answered = 0;

                    $(".qnbutton").each(function () {
                        const cls = this.className;

                        if (
                            cls.includes("answersaved") ||
                            cls.includes("complete") ||
                            cls.includes("correct") ||
                            cls.includes("incorrect")
                        ) {
                            answered++;
                        }
                    });

                    if (!total) return null;

                    return {
                        total,
                        answered,
                        percent: Math.round((answered / total) * 100)
                    };
                }

                function updateBar() {
                    const data = getProgress();
                    if (!data) return;

                    if (data.percent === last) return;
                    last = data.percent;

                    $("#quiz-progress-fill").css({
                        width: data.percent + "%"
                    });

                    $("#quiz-progress-text").text(`${data.answered} / ${data.total} (${data.percent}%)`);
                }

                // init
                updateBar();

                // eventos controlados
                $("#region-main").on("change", "input, select, textarea", function () {
                    setTimeout(updateBar, 250);
                });

                $("#mod_quiz_navblock").on("click", ".qnbutton", function () {
                    setTimeout(updateBar, 300);
                });

                // fallback seguro
                setInterval(updateBar, 4000);
            });
        });
    });
})();
