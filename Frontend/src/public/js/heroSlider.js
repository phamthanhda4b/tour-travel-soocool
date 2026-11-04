// Hero Slider JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const sliderSection = document.getElementById('heroSlider');
  if (!sliderSection) return;

  const slides = sliderSection.querySelectorAll('.hero-slide');
  const dots = sliderSection.querySelectorAll('.hero-dot');
  const prevBtn = sliderSection.querySelector('.hero-arrow-prev');
  const nextBtn = sliderSection.querySelector('.hero-arrow-next');
  const scrollDownBtn = sliderSection.querySelector('.hero-scroll-down');
  const header = document.getElementById('header') || document.querySelector('.header');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  const INTERVAL_TIME = 3000; // 3 seconds per user requirement

  if (totalSlides === 0) return;

  // 1. Precise Fullscreen Height Calculation:
  // "yêu cầu độ cao slide: phần chân slide phải che kín mép dưới của màn hình người dùng khi vừa truy cập vào trang web"
  function updateSliderHeight() {
    const headerHeight = header ? header.offsetHeight : 87;
    const availableHeight = window.innerHeight - headerHeight;
    sliderSection.style.height = `${availableHeight}px`;
  }

  updateSliderHeight();
  window.addEventListener('resize', updateSliderHeight);

  // 2. Slide change logic
  function goToSlide(index) {
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentIndex = index;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // 3. Autoplay logic (every 3s)
  function startAutoplay() {
    stopAutoplay();
    if (totalSlides > 1) {
      autoplayTimer = setInterval(nextSlide, INTERVAL_TIME);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Pause autoplay on mouse hover, resume on mouse leave
  sliderSection.addEventListener('mouseenter', stopAutoplay);
  sliderSection.addEventListener('mouseleave', startAutoplay);

  // 4. Arrow Navigation
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  // 5. Dots Navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(targetIndex);
      startAutoplay();
    });
  });

  // 6. Smooth Scroll Down button
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const toursSection = document.getElementById('tours-section');
      if (toursSection) {
        toursSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Also bind any "Khám phá ngay" buttons with href="#tours-section"
  document.querySelectorAll('.scroll-to-tours').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const toursSection = document.getElementById('tours-section');
      if (toursSection) {
        toursSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 7. Touch / Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  sliderSection.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    },
    { passive: true }
  );

  sliderSection.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    },
    { passive: true }
  );

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Start autoplay immediately on page load
  startAutoplay();
});
