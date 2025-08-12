// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Get references to menu elements
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    // --- FIX: Ensure menu starts hidden and icons are correct on load ---
    // This function will set the dropdown to hidden and ensure icons are correct
    function setMenuClosedState() {
        dropdownMenu.classList.add('hidden'); // Ensure dropdown is hidden
        menuIcon.classList.remove('hidden');  // Ensure hamburger is visible
        closeIcon.classList.add('hidden');    // Ensure 'X' is hidden
    }

    // Call this function once when the DOM content is fully loaded
    setMenuClosedState();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust for fixed header height
                const headerOffset = 80; // height of your fixed navbar
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Update active class for nav items (if applicable in dropdown)
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');

                // --- FIX: Close dropdown and reset icons reliably after navigation ---
                setMenuClosedState(); // Use the dedicated function to close and reset icons
                // --- End Fix ---
            }
        });
    });

    // Menu toggle functionality for both desktop and mobile
    menuToggle.addEventListener('click', () => {
        // Toggle the hidden class on the dropdown menu itself
        dropdownMenu.classList.toggle('hidden');

        // Based on the new state of the dropdown, explicitly toggle icon visibility
        if (dropdownMenu.classList.contains('hidden')) {
            // If menu is now hidden, show menu icon and hide close icon
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        } else {
            // If menu is now visible, hide menu icon and show close icon
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        }
    });

    // Close dropdown if clicked outside the menu toggle or the dropdown itself
    document.addEventListener('click', (event) => {
        // Check if the click was outside the menu toggle and outside the dropdown itself
        if (!menuToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            if (!dropdownMenu.classList.contains('hidden')) { // If menu is currently open
                setMenuClosedState(); // Use the dedicated function to close and reset icons
            }
        }
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();


    // Intersection Observer for Stat Cards (Animated Numbers)
    const statCards = document.querySelectorAll('.stat-number');

    const animateNumber = (element, target, suffix = '') => {
        let start = 0;
        const duration = 1500; // milliseconds
        const incrementTime = 50; // milliseconds for each step

        let current = 0;
        const timer = setInterval(() => {
            current += (target - start) / (duration / incrementTime); // Calculate increment based on remaining time
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.ceil(current) + suffix;
            }
        }, incrementTime);
    };

    const observerOptions = {
        root: null, // viewport as the root
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                const statNumberElement = entry.target;
                const targetNumber = parseInt(statNumberElement.dataset.target);
                const suffix = statNumberElement.dataset.suffix || '';
                animateNumber(statNumberElement, targetNumber, suffix);
                observer.unobserve(statNumberElement); // Stop observing once animated
            }
        });
    }, observerOptions);

    statCards.forEach(card => {
        statObserver.observe(card);
    });

    // Highlight active section in navigation based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-item');

    const highlightNavLink = () => {
        let currentActiveSection = 'home'; // Default to home

        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('.navbar').offsetHeight; // Adjust for fixed header
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentActiveSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentActiveSection) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    // Call on load to set initial active link
    highlightNavLink();
});
document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        // window.scrollTo({
            // top: 0,
            // behavior: 'smooth'
		document.querySelector('#my-profile').scrollIntoView({
        behavior: 'smooth'
        });
    });
});

// My Profile tab switching
document.addEventListener('DOMContentLoaded', () => {
  const profileCards = document.querySelectorAll('.profile-card');
  const profileContent = document.getElementById('profile-content');
  const hiddenSections = ['education', 'experience', 'research', 'awards', 'participation', 'memberships']
    .map(id => document.getElementById(id));

  function loadSection(sectionId) {
    // Keep all original sections hidden
    hiddenSections.forEach(sec => {
      if (sec) sec.classList.add('hidden');
    });

    // Load the requested section content
    const section = document.getElementById(sectionId);
    if (section) {
      profileContent.innerHTML = section.innerHTML;
    }
  }

  profileCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove active from all
      profileCards.forEach(c => c.classList.remove('active'));
      // Add active to clicked
      card.classList.add('active');
      // Load corresponding section
      const target = card.getAttribute('data-target');
      loadSection(target);
    });
  });

  // Load first tab by default
  if (profileCards.length > 0) {
    const firstTarget = profileCards[0].getAttribute('data-target');
    loadSection(firstTarget);
  }
});


