/**
 * Carrossel horizontal — desliza para o lado (scroll + avanço automático)
 */
(function () {
    function init() {
        const viewport = document.getElementById('boloCarouselViewport');
        if (!viewport) return;

        const slides = viewport.querySelectorAll('.bolo-carousel__slide');
        const n = slides.length;
        if (n < 2) return;

        const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let index = 0;
        const INTERVAL_MS = 4500;
        let timer;

        function scrollToIndex(i, behavior) {
            const w = viewport.clientWidth;
            if (!w) return;
            viewport.scrollTo({ left: i * w, behavior: behavior || 'smooth' });
        }

        function next() {
            index = (index + 1) % n;
            scrollToIndex(index, prefersReduced ? 'auto' : 'smooth');
        }

        function start() {
            if (prefersReduced || timer) return;
            timer = window.setInterval(next, INTERVAL_MS);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function syncIndexFromScroll() {
            const w = viewport.clientWidth;
            if (!w) return;
            index = Math.round(viewport.scrollLeft / w) % n;
        }

        viewport.addEventListener('scroll', function () {
            if (viewport.scrollWidth <= viewport.clientWidth) return;
            syncIndexFromScroll();
        }, { passive: true });

        let resizeEnd;
        window.addEventListener('resize', function () {
            clearTimeout(resizeEnd);
            resizeEnd = setTimeout(function () {
                scrollToIndex(index, 'auto');
            }, 100);
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop();
            else start();
        });

        viewport.addEventListener('pointerdown', stop, { passive: true });
        viewport.addEventListener('pointerup', function () {
            syncIndexFromScroll();
            start();
        }, { passive: true });
        viewport.addEventListener('pointercancel', function () {
            syncIndexFromScroll();
            start();
        }, { passive: true });

        start();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
