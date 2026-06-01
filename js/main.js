async function loadComponents() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
        try {
            const headerRes = await fetch("header.html");
            headerPlaceholder.innerHTML = await headerRes.text();

            // Active Navbar Link Logic
            const currentPath = window.location.pathname.split("/").pop() || "index.html";
            const navLinks = headerPlaceholder.querySelectorAll(".navbar-nav .nav-link");
            
            navLinks.forEach((link) => {
                if (link.getAttribute("href") === currentPath) {
                    link.classList.add("active");
                }
            });
        } catch (error) {
            console.error("Error loading header:", error);
        }
    }

    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        try {
            const footerRes = await fetch("footer.html");
            footerPlaceholder.innerHTML = await footerRes.text();
        } catch (error) {
            console.error("Error loading footer:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', async function() { // Make the DOMContentLoaded function async
    await loadComponents(); // Wait for header and footer to load first

    // Handle Preloader hiding after all components load
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("preloader-hidden");
            // Initialize AOS *after* preloader is hidden
            AOS.init({
                duration: 1000,
                once: true,
                offset: 50 // Slightly reduced offset to make content appear sooner
            });
            AOS.refresh(); // Refresh AOS to ensure all elements are detected after dynamic loading
            initCounters(); // Initialize counters after AOS
        }, 1500); // Small delay for better UX
    } else {
        // If preloader is not present for some reason, initialize AOS immediately
        AOS.init({
            duration: 1000,
            once: true,
            offset: 50
        });
        initCounters(); // Initialize counters immediately
        AOS.refresh();
    }

    const swiper = new Swiper(".heroSwiper", {
        loop: true,
        speed: 1500,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        effect: "fade",
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });

    new Swiper(".projectSlider", {
        loop: true,
        spaceBetween: 15,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false
        },
        breakpoints: {
            320: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 3
            },
            1400: {
                slidesPerView: 4
            }
        }
    });

    new Swiper(".testimonialSlider", {
        loop: true,
        spaceBetween: 30,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 }
        }
    });

    new Swiper(".materialSwiper", {
        slidesPerView: 1,
        spaceBetween: 25,
        loop: true,
        autoplay: {
            delay: 1500,
            disableOnInteraction: false,
        },
        breakpoints: {
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
        }
    });
});

/**
 * Achievement Counter Animation and Progress Bar Animation
 */
function initCounters() {
  // Handles both .num (from Achievements) and .progress-num (from Stats)
  const counters = document.querySelectorAll('.num, .progress-num');
  const speed = 200;

  const startCounter = (counter) => {
    const target = +counter.getAttribute('data-val');
    let count = 0;
    const increment = target / speed;

    const updateCount = () => {
      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  };

  const animateProgressBars = (container) => {
    const bars = container.querySelectorAll('.progress-bar');
    bars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-width');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target); // Start counter animation
        observer.unobserve(entry.target); // Stop observing after animation
      }
    });
  }, { threshold: 1.0 }); // Triggers when 100% of the element is visible

  counters.forEach(counter => observer.observe(counter));

  // Observer specifically for the Stats section to trigger bar widths
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateProgressBars(entry.target);
          statsObserver.unobserve(entry.target); // Animate bars only once
        }
      });
    }, { threshold: 0.5 }); // Triggers when 50% of the element is visible
    statsObserver.observe(statsSection);
  }
}