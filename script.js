(function () {
    "use strict";

    /* Animação das moedas */
    function coinBurst(origin, count) {
        if (!origin) return;
        const rect = origin.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const spread = count === 1 ? [0] : [-38, 0, 38];

        for (let i = 0; i < count; i++) {
            const coin = document.createElement("span");
            coin.className = "coin-fly";
            coin.setAttribute("aria-hidden", "true");
            coin.style.left = x + "px";
            coin.style.top = y + "px";
            coin.style.setProperty("--dx", spread[i] + "px");
            coin.style.setProperty("--rise", (count === 1 ? 80 : 110 - Math.abs(spread[i]) / 2) + "px");
            coin.style.animationDelay = (i * 90) + "ms";
            coin.addEventListener("animationend", function () { coin.remove(); });
            document.body.appendChild(coin);
        }

        // Feedback no elemento
        origin.classList.remove("got-coin");
        void origin.offsetWidth;
        origin.classList.add("got-coin");
    }

    /* Cartelas de resposta */
    document.querySelectorAll(".sheet").forEach(function (sheet) {
        const rows = Array.from(sheet.querySelectorAll(".as-row"));
        const stampEl = sheet.querySelector(".as-stamp");
        let completed = false;

        sheet.classList.add("is-idle");

        function refresh(lastBubble) {
            const filled = rows.filter(function (r) {
                return r.querySelector(".as-bubble.filled");
            }).length;
            const allDone = filled === rows.length;

            if (stampEl) stampEl.classList.toggle("show", allDone);

            if (allDone && !completed) {
                completed = true;
                sheet.classList.add("is-done");
                coinBurst(stampEl || lastBubble, 3);
            }
        }

        rows.forEach(function (row) {
            const bubbles = Array.from(row.querySelectorAll(".as-bubble"));
            let answered = false;

            bubbles.forEach(function (bubble) {
                bubble.addEventListener("click", function () {
                    sheet.classList.remove("is-idle");

                    // Uma resposta por linha
                    bubbles.forEach(function (b) { b.classList.remove("filled"); });
                    bubble.classList.add("filled");

                    // Moeda na primeira marcação
                    const isLastRow = rows.filter(function (r) {
                        return !r.querySelector(".as-bubble.filled");
                    }).length === 0;
                    if (!answered && !isLastRow) coinBurst(bubble, 1);
                    answered = true;

                    refresh(bubble);
                });
            });
        });
    });

    /* Missões dos cards */
    document.querySelectorAll(".mission-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            if (btn.classList.contains("done")) return;

            btn.classList.add("done");
            btn.textContent = "✓ MISSÃO ACEITA";
            const card = btn.closest(".feature-card");
            if (card) card.classList.add("claimed");

            coinBurst(btn, 3);
        });
    });

    /* Desafio do ranking */
    const challengeBtn = document.getElementById("challengeBtn");
    if (challengeBtn) {
        challengeBtn.addEventListener("click", function () {
            if (challengeBtn.classList.contains("done")) return;

            challengeBtn.classList.add("done");
            const name = challengeBtn.querySelector(".you-name");
            const cta = challengeBtn.querySelector(".you-cta");
            if (name) name.textContent = "Bora subir! Agora é estudar.";
            if (cta) cta.textContent = "DESAFIO ACEITO ✓";

            coinBurst(cta || challengeBtn, 3);
        });
    }
})();
