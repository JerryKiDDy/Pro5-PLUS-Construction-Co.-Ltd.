/* Pro5 PLUS interactions
   CSS keeps the layout; JavaScript controls interactive behavior. */
document.addEventListener("DOMContentLoaded", () => {
    const menuCheckbox = document.getElementById("menu");
    const navLinks = document.querySelector(".nav-links");
    const menuIcon = document.querySelector(".menu-icon");

    // Mobile navigation: JavaScript opens/closes the menu.
    function syncMenu() {
        if (!navLinks) return;
        if (window.matchMedia("(max-width: 900px)").matches) {
            navLinks.style.display = menuCheckbox && menuCheckbox.checked ? "flex" : "none";
        } else {
            navLinks.style.display = "flex";
            if (menuCheckbox) menuCheckbox.checked = false;
        }
        if (menuIcon) {
            menuIcon.setAttribute(
                "aria-expanded",
                String(Boolean(menuCheckbox && menuCheckbox.checked))
            );
        }
    }

    if (menuCheckbox) {
        menuCheckbox.addEventListener("change", syncMenu);
        window.addEventListener("resize", syncMenu);
        syncMenu();
    }

    // Close mobile menu after selecting a navigation link.
    if (navLinks) {
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                if (menuCheckbox) menuCheckbox.checked = false;
                syncMenu();
            });

            // Link hover effect controlled by JavaScript.
            link.addEventListener("mouseenter", () => {
                link.style.color = "#ff8a0e";
                if (window.matchMedia("(max-width: 900px)").matches) {
                    link.style.backgroundColor = "var(--color2)";
                    link.style.textDecoration = "none";
                } else {
                    link.style.textDecoration = "underline";
                }
            });
            link.addEventListener("mouseleave", () => {
                link.style.color = "";
                link.style.backgroundColor = "";
                link.style.textDecoration = "";
            });
        });
    }

    // Service and project card hover effects controlled by JavaScript.
    document.querySelectorAll(".service-card, .project-card").forEach(card => {
        card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-4px)";
            card.style.boxShadow = "0 5px 15px rgba(20, 40, 70, 0.12)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.boxShadow = "";
        });
    });

    // Project image zoom effect controlled by JavaScript.
    document.querySelectorAll(".project-logo img").forEach(img => {
        img.style.transition = "transform 0.3s ease";
        img.addEventListener("mouseenter", () => {
            img.style.transform = "scale(1.05)";
        });
        img.addEventListener("mouseleave", () => {
            img.style.transform = "";
        });
    });

    // Button/link hover effects controlled by JavaScript.
    document.querySelectorAll(".view-services, .view-project, .back-home").forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = "#063ebf";
        });
        button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = "";
        });
    });

    // Smooth reveal when sections/cards enter the viewport.
    const revealItems = document.querySelectorAll(
        ".hero-content, .about-content, .about-logo, .service-card, .project-card, .contact-content, .profile-section"
    );
    if ("IntersectionObserver" in window) {
        revealItems.forEach(item => {
            item.style.opacity = "0";
            item.style.transition = "opacity 0.6s ease";
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(item => observer.observe(item));
    }
});
