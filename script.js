// toggle the menu

const toggleBtn = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');
const menuCloseBtn = document.getElementById('menu-close-btn'); // Get the internal close button

function toggleMenu() {
  menu.classList.toggle('hidden');

  // Toggle hamburger and close icons
  hamburgerIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('hidden');

  // Add/remove classes for mobile menu styling
  if (!menu.classList.contains('hidden')) {
    // Menu is open
    menu.classList.add(
      'flex',
      'top-full',
      'left-0',
      'bg-white',
      'shadow-md',
      'pb-4',
      'w-full'
    );
    // Ensure the menu items stack vertically when open
    menu.classList.remove('md:flex-row'); // Remove desktop flex-row
    menu.classList.add('flex-col'); // Ensure flex-col for mobile
  } else {
    // Menu is closed
    menu.classList.remove(
      'flex',
      'top-full',
      'left-0',
      'bg-white',
      'shadow-md',
      'pb-4',
      'w-full'
    );
    // Re-add md:flex-row for desktop layout
    menu.classList.remove('flex-col');
    menu.classList.add('md:flex-row');
  }
}

// Event listener for the main toggle button (hamburger/X)
toggleBtn.addEventListener('click', toggleMenu);

// Event listener for the internal "X" button within the menu
menuCloseBtn.addEventListener('click', toggleMenu);

// Optional: Close menu when a menu item is clicked (for smooth navigation)
menu.querySelectorAll('a[href^="#"]').forEach((item) => {
  item.addEventListener('click', () => {
    if (!menu.classList.contains('hidden')) {
      // Only close if menu is open
      toggleMenu();
    }
  });
});

//

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  });
});
