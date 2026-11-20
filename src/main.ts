/*
 * DOH. — Mejoras progresivas del portafolio.
 * Todo el contenido y los enlaces funcionan sin este script; aquí solo se
 * añaden comodidades: sección activa en la navegación, copiar el correo,
 * aparición discreta al desplazarse y un respaldo para capturas ausentes.
 *
 * Compilación: tsc src/main.ts --outDir assets --target es2017
 */

(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const supportsObserver = "IntersectionObserver" in window;

  function toArray<T extends Element>(list: NodeListOf<T>): T[] {
    return Array.prototype.slice.call(list) as T[];
  }

  /* ---------- Cabecera: borde al desplazarse ---------- */

  function initHeader(): void {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    let pending = false;
    const update = (): void => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      pending = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Navegación: sección activa ---------- */

  function initActiveSection(): void {
    if (!supportsObserver) return;

    const links = toArray(document.querySelectorAll<HTMLAnchorElement>('.site-nav a[href^="#"]'));
    const linkById: { [id: string]: HTMLAnchorElement } = {};
    const sections: HTMLElement[] = [];

    links.forEach((link) => {
      const id = link.hash.slice(1);
      const section = id ? document.getElementById(id) : null;
      if (section) {
        linkById[id] = link;
        sections.push(section);
      }
    });

    const hero = document.getElementById("inicio");
    if (hero) sections.push(hero);
    if (!links.length) return;

    const setActive = (id: string): void => {
      links.forEach((link) => link.removeAttribute("aria-current"));
      const link = linkById[id];
      if (link) link.setAttribute("aria-current", "location");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Aparición al desplazarse ---------- */

  function initReveal(): void {
    const items = toArray(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!items.length || !supportsObserver || reducedMotion.matches) return;

    const showAll = (): void => {
      items.forEach((item) => item.classList.add("is-in"));
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );

    root.classList.add("reveal");
    items.forEach((item) => observer.observe(item));

    // Si el usuario activa la reducción de movimiento, se muestra todo.
    const onMotionChange = (event: MediaQueryListEvent): void => {
      if (event.matches) {
        showAll();
        observer.disconnect();
      }
    };
    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", onMotionChange);
    }

    // Al imprimir, todo el contenido debe ser visible.
    window.addEventListener("beforeprint", showAll);
  }

  /* ---------- Copiar correo ---------- */

  function fallbackCopy(text: string): boolean {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "0";
    field.style.left = "0";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(field);
    return ok;
  }

  function copyText(text: string, done: (ok: boolean) => void): void {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => done(true),
        () => done(fallbackCopy(text))
      );
      return;
    }
    done(fallbackCopy(text));
  }

  function initCopy(): void {
    const button = document.querySelector<HTMLButtonElement>("[data-copy]");
    const status = document.querySelector<HTMLElement>("[data-copy-status]");
    if (!button || !status) return;

    const value = button.dataset.copy || "";
    if (!value) return;

    const label = button.textContent || "Copiar correo";
    let timer = 0;

    button.hidden = false;

    button.addEventListener("click", () => {
      copyText(value, (ok) => {
        window.clearTimeout(timer);
        button.classList.toggle("is-done", ok);
        button.textContent = ok ? "Copiado" : label;
        status.textContent = ok
          ? "Correo copiado al portapapeles."
          : `No se ha podido copiar. Escríbeme a ${value}.`;

        timer = window.setTimeout(() => {
          button.classList.remove("is-done");
          button.textContent = label;
          status.textContent = "";
        }, 4000);
      });
    });
  }

  /* ---------- Respaldo para imágenes ausentes ---------- */

  function initImageFallback(): void {
    const images = toArray(document.querySelectorAll<HTMLImageElement>(".media img, .portrait-frame img"));

    images.forEach((img) => {
      const holder = img.closest<HTMLElement>(".media, .portrait-frame");
      if (!holder) return;

      const markMissing = (): void => holder.classList.add("is-missing");
      const markLoaded = (): void => holder.classList.remove("is-missing");

      img.addEventListener("error", markMissing);
      img.addEventListener("load", markLoaded);

      // Imágenes que ya fallaron antes de ejecutarse el script.
      const isLazy = img.getAttribute("loading") === "lazy";
      if (!isLazy && img.complete && img.naturalWidth === 0) markMissing();
    });
  }

  /* ---------- Año del pie ---------- */

  function initYear(): void {
    const year = document.querySelector<HTMLElement>("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  initHeader();
  initActiveSection();
  initReveal();
  initCopy();
  initImageFallback();
  initYear();
})();
