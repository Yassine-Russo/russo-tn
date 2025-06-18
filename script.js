// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Scroll progress bar
  const progressBar = document.getElementById('progress-bar');
  
  // Throttle scroll events for performance
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  const updateProgressBar = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(updateProgressBar);
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuToggle && navMenu) {
    const toggleMenu = () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('show');
      menuToggle.textContent = isExpanded ? '☰' : '✕';
      
      // Toggle body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && e.target !== menuToggle) {
        navMenu.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
        document.body.style.overflow = '';
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
        document.body.style.overflow = '';
      }
    });
  }

  // Discord buttons
  document.querySelectorAll('#discord-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Analytics event could be added here
      window.open('https://discord.gg/Kfum87DSVC', '_blank', 'noopener,noreferrer');
    });
  });

  // Contact form validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const status = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    const validateName = () => {
      if (nameInput.value.trim() === '') {
        nameError.textContent = 'Name is required';
        return false;
      } else if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'Name must be at least 2 characters';
        return false;
      }
      nameError.textContent = '';
      return true;
    };
    
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required';
        return false;
      } else if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email';
        return false;
      }
      emailError.textContent = '';
      return true;
    };
    
    const validateMessage = () => {
      if (messageInput.value.trim() === '') {
        messageError.textContent = 'Message is required';
        return false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message must be at least 10 characters';
        return false;
      }
      messageError.textContent = '';
      return true;
    };
    
    // Real-time validation
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate all fields
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();
      
      if (!isNameValid || !isEmailValid || !isMessageValid) {
        status.textContent = 'Please fix the errors above';
        status.style.color = 'var(--error-color)';
        return;
      }
      
      // Disable submit button during submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      status.textContent = 'Sending your message...';
      status.style.color = 'var(--primary-color)';
      
      try {
        // In a real app, you would send data to a server here
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        status.textContent = 'Message sent! We\'ll get back to you soon.';
        status.style.color = 'var(--success-color)';
        contactForm.reset();
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
        
        // Reset status message after 5 seconds
        setTimeout(() => {
          status.textContent = '';
        }, 5000);
      } catch (error) {
        status.textContent = 'Error sending message. Please try again.';
        status.style.color = 'var(--error-color)';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      }
    });
  }
  
  // Add focus styles for keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('keyboard-focus');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.documentElement.classList.remove('keyboard-focus');
  });
});

// Service Worker Registration for PWA (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// script.js
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formStatus = document.getElementById('form-status');
  formStatus.textContent = 'Sending...';

  const data = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim()
  };

  try {
    const res = await fetch('http://localhost:3000/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.success) {
      formStatus.textContent = '✅ Message sent!';
    } else {
      formStatus.textContent = '❌ Failed to send message.';
    }
  } catch (error) {
    formStatus.textContent = '⚠️ Error sending message.';
    console.error(error);
  }
});
