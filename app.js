/* ==========================================
   LIYOVA ONLINE - Interactive Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. SCROLL DETECTOR FOR HEADER
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. MOBILE MENU TOGGLE
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // 3. SCROLL-TRIGGERED FADE ANIMATIONS
  const fadeElems = document.querySelectorAll('.fade-in-up');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElems.forEach(elem => {
    scrollObserver.observe(elem);
  });

  // 4. PORTFOLIO FILTERING
  const tabs = document.querySelectorAll('.portfolio-tab');
  const items = document.querySelectorAll('.portfolio-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      items.forEach(item => {
        // Simple fade-out, check, fade-in animation
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95) translateY(10px)';
        
        setTimeout(() => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // 5. INTERACTIVE PRICE ESTIMATOR (CALCULATOR)
  const calcService = document.getElementById('calcService');
  const dynamicOptions = document.getElementById('dynamicOptions');
  
  // Elements for results summary
  const summaryService = document.getElementById('summaryService');
  const summaryDetails = document.getElementById('summaryDetails');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryAddons = document.getElementById('summaryAddons');
  const summaryTotalVal = document.getElementById('summaryTotalVal');
  const btnWhatsAppOrder = document.getElementById('btnWhatsAppOrder');

  // Pricing Matrix
  const PRICING = {
    printing: {
      'bw-single': 3,
      'bw-double': 5,
      'color-standard': 15,
      'color-hq': 25
    },
    binding: {
      'spiral': { base: 50, perPage: 1 },
      'hard-standard': { base: 150, perPage: 0 },
      'hard-premium': { base: 250, perPage: 0 }
    },
    stamps: {
      'rubber': 120,
      'pre-ink': 250,
      'dater': 350
    },
    lamination: {
      'id': 15,
      'a4': 30,
      'a3': 60
    },
    id: {
      'pvc-standard': 60,
      'pvc-premium': 100
    }
  };

  // Helper function to update option visibility based on service
  function renderCalculatorOptions(serviceType) {
    let html = '';
    
    if (serviceType === 'printing') {
      html = `
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Print / Copy Type</label>
          <select id="printType" class="calc-select">
            <option value="bw-single">Black & White (Single Sided) - ₹3/pg</option>
            <option value="bw-double">Black & White (Double Sided) - ₹5/pg</option>
            <option value="color-standard">Color (Standard) - ₹15/pg</option>
            <option value="color-hq">Color (High Quality Photo) - ₹25/pg</option>
          </select>
        </div>
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Number of Pages</label>
          <div class="range-container">
            <input type="range" id="printPages" class="range-slider" min="1" max="500" value="10">
            <div id="printPagesVal" class="range-val-badge">10</div>
          </div>
        </div>
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Optional Add-ons</label>
          <div class="options-grid">
            <div class="option-checkbox-wrapper">
              <input type="checkbox" id="addonBinding" class="option-checkbox-input">
              <label for="addonBinding" class="option-checkbox-label">
                <span class="checkbox-custom"></span>
                Add Spiral Binding (+₹50)
              </label>
            </div>
            <div class="option-checkbox-wrapper">
              <input type="checkbox" id="addonLamination" class="option-checkbox-input">
              <label for="addonLamination" class="option-checkbox-label">
                <span class="checkbox-custom"></span>
                Add A4 Lamination (+₹30)
              </label>
            </div>
          </div>
        </div>
      `;
    } else if (serviceType === 'binding') {
      html = `
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Binding Type</label>
          <select id="bindingType" class="calc-select">
            <option value="spiral">Spiral Binding - ₹50 + ₹1/pg</option>
            <option value="hard-standard">Standard Hard Binding - ₹150</option>
            <option value="hard-premium">Premium Hard Binding (Gold Lettering) - ₹250</option>
          </select>
        </div>
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Number of Pages</label>
          <div class="range-container">
            <input type="range" id="bindingPages" class="range-slider" min="5" max="400" value="50">
            <div id="bindingPagesVal" class="range-val-badge">50</div>
          </div>
        </div>
      `;
    } else if (serviceType === 'stamps') {
      html = `
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Stamp Type</label>
          <select id="stampType" class="calc-select">
            <option value="rubber">Standard Rubber Stamp - ₹120</option>
            <option value="pre-ink">Pre-Ink Self Inking Stamp - ₹250</option>
            <option value="dater">Dater Self Inking Stamp - ₹350</option>
          </select>
        </div>
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Quantity</label>
          <div class="range-container">
            <input type="range" id="stampQty" class="range-slider" min="1" max="20" value="1">
            <div id="stampQtyVal" class="range-val-badge">1</div>
          </div>
        </div>
      `;
    } else if (serviceType === 'lamination') {
      html = `
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Lamination Size</label>
          <select id="laminationSize" class="calc-select">
            <option value="id">ID Card Size - ₹15</option>
            <option value="a4">A4 Document Size - ₹30</option>
            <option value="a3">A3 Document Size - ₹60</option>
          </select>
        </div>
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Quantity</label>
          <div class="range-container">
            <input type="range" id="laminationQty" class="range-slider" min="1" max="100" value="1">
            <div id="laminationQtyVal" class="range-val-badge">1</div>
          </div>
        </div>
      `;
    } else if (serviceType === 'id') {
      html = `
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">ID Card Type</label>
          <select id="idType" class="calc-select">
            <option value="pvc-standard">Standard PVC ID Card - ₹60</option>
            <option value="pvc-premium">Premium Laminated PVC Card - ₹100</option>
          </select>
        </div>
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Quantity</label>
          <div class="range-container">
            <input type="range" id="idQty" class="range-slider" min="1" max="50" value="1">
            <div id="idQtyVal" class="range-val-badge">1</div>
          </div>
        </div>
      `;
    }

    dynamicOptions.innerHTML = html;
    
    // Wire up events for the newly inserted options
    setupOptionEvents(serviceType);
    calculatePrice();
  }

  function setupOptionEvents(serviceType) {
    // 1. Pages/Qty range sliders UI updates
    const sliders = dynamicOptions.querySelectorAll('.range-slider');
    sliders.forEach(slider => {
      const valBadge = document.getElementById(`${slider.id}Val`);
      slider.addEventListener('input', () => {
        valBadge.textContent = slider.value;
        calculatePrice();
      });
    });

    // 2. Dropdown selectors & Checkboxes price trigger
    const selectors = dynamicOptions.querySelectorAll('.calc-select');
    selectors.forEach(sel => {
      sel.addEventListener('change', calculatePrice);
    });

    const checkboxes = dynamicOptions.querySelectorAll('.option-checkbox-input');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', calculatePrice);
    });
  }

  // Core Pricing Calculation
  let currentEstimate = {
    serviceName: '',
    detailsString: '',
    subtotal: 0,
    addons: 0,
    total: 0
  };

  function calculatePrice() {
    const service = calcService.value;
    let subtotal = 0;
    let addons = 0;
    let details = '';
    let serviceLabel = '';

    if (service === 'printing') {
      const type = document.getElementById('printType').value;
      const pages = parseInt(document.getElementById('printPages').value, 10);
      const optBinding = document.getElementById('addonBinding').checked;
      const optLamination = document.getElementById('addonLamination').checked;

      const perPagePrice = PRICING.printing[type];
      subtotal = pages * perPagePrice;
      serviceLabel = 'Laser Printing / Photostat';

      const typeLabels = {
        'bw-single': 'B&W Single Sided',
        'bw-double': 'B&W Double Sided',
        'color-standard': 'Color Standard',
        'color-hq': 'Color High Quality'
      };
      details = `${pages} Pages (${typeLabels[type]} @ ₹${perPagePrice}/pg)`;

      let addonDetails = [];
      if (optBinding) {
        addons += 50;
        addonDetails.push('Spiral Binding (+₹50)');
      }
      if (optLamination) {
        addons += 30;
        addonDetails.push('A4 Lamination (+₹30)');
      }
      if (addonDetails.length > 0) {
        details += ' + Add-ons: ' + addonDetails.join(', ');
      }

    } else if (service === 'binding') {
      const type = document.getElementById('bindingType').value;
      const pages = parseInt(document.getElementById('bindingPages').value, 10);

      const pricingObj = PRICING.binding[type];
      subtotal = pricingObj.base + (pricingObj.perPage * pages);
      serviceLabel = 'Document Bookbinding';

      const typeLabels = {
        'spiral': 'Spiral Binding',
        'hard-standard': 'Standard Hard Binding',
        'hard-premium': 'Premium Hard Binding'
      };
      details = `${typeLabels[type]} for ${pages} Pages`;

    } else if (service === 'stamps') {
      const type = document.getElementById('stampType').value;
      const qty = parseInt(document.getElementById('stampQty').value, 10);

      const stampPrice = PRICING.stamps[type];
      subtotal = stampPrice * qty;
      serviceLabel = 'Nylon / Pre-Ink Stamp';

      const typeLabels = {
        'rubber': 'Standard Rubber Stamp',
        'pre-ink': 'Pre-Ink Self Inking Stamp',
        'dater': 'Dater Self Inking Stamp'
      };
      details = `${qty}x ${typeLabels[type]} (@ ₹${stampPrice}/ea)`;

    } else if (service === 'lamination') {
      const size = document.getElementById('laminationSize').value;
      const qty = parseInt(document.getElementById('laminationQty').value, 10);

      const unitPrice = PRICING.lamination[size];
      subtotal = unitPrice * qty;
      serviceLabel = 'Document Lamination';

      const sizeLabels = {
        'id': 'ID Card Size',
        'a4': 'A4 Sheet Size',
        'a3': 'A3 Sheet Size'
      };
      details = `${qty}x Lamination Sheets (${sizeLabels[size]} @ ₹${unitPrice}/ea)`;

    } else if (service === 'id') {
      const type = document.getElementById('idType').value;
      const qty = parseInt(document.getElementById('idQty').value, 10);

      const unitPrice = PRICING.id[type];
      subtotal = unitPrice * qty;
      serviceLabel = 'ID Card Printing';

      const typeLabels = {
        'pvc-standard': 'Standard PVC ID Card',
        'pvc-premium': 'Premium Laminated PVC Card'
      };
      details = `${qty}x ID Cards (${typeLabels[type]} @ ₹${unitPrice}/ea)`;
    }

    const total = subtotal + addons;

    // Save to global estimate tracker
    currentEstimate = {
      serviceName: serviceLabel,
      detailsString: details,
      subtotal: subtotal,
      addons: addons,
      total: total
    };

    // Update UI Elements with smooth count animation
    summaryService.textContent = serviceLabel;
    summaryDetails.textContent = details;
    summarySubtotal.textContent = `₹${subtotal}`;
    summaryAddons.textContent = `₹${addons}`;
    
    // Animate Total Value
    animateNumberValue(summaryTotalVal, total);
  }

  function animateNumberValue(element, targetVal) {
    const currentVal = parseInt(element.textContent.replace('₹', ''), 10) || 0;
    if (currentVal === targetVal) return;
    
    const duration = 300; // ms
    const startTime = performance.now();
    
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-quad
      const ease = progress * (2 - progress);
      const val = Math.floor(currentVal + (targetVal - currentVal) * ease);
      element.textContent = `₹${val}`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = `₹${targetVal}`;
      }
    }
    
    requestAnimationFrame(update);
  }

  // Initialize Calculator on Service Change
  if (calcService) {
    calcService.addEventListener('change', () => {
      renderCalculatorOptions(calcService.value);
    });
    // Trigger initial render
    renderCalculatorOptions(calcService.value);
  }

  // 6. WHATSAPP ORDER GENERATOR
  if (btnWhatsAppOrder) {
    btnWhatsAppOrder.addEventListener('click', () => {
      const baseMsg = `Hi Liyova Online! I would like to make an inquiry/place an order:

*Service:* ${currentEstimate.serviceName}
*Details:* ${currentEstimate.detailsString}
*Estimated Price:* ₹${currentEstimate.total}

Please let me know how I can send you the document files. Thank you!`;

      const encodedMsg = encodeURIComponent(baseMsg);
      const waUrl = `https://wa.me/918590909003?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    });
  }

  // 7. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple visual check for validations (standard HTML5 validation handles most)
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();
      
      if (!name || !phone || !email || !message) {
        alert('Please fill out all the fields in the contact form.');
        return;
      }

      // Construct WhatsApp message with form details
      const waMsg = `Hi Liyova Online! I would like to submit a contact inquiry:

*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Message:* ${message}`;

      const encodedMsg = encodeURIComponent(waMsg);
      const waUrl = `https://wa.me/918590909003?text=${encodedMsg}`;
      
      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank');
      
      // Animated form transition
      contactForm.style.transition = 'opacity 0.3s ease';
      contactForm.style.opacity = '0';
      
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'flex';
        formSuccess.style.opacity = '0';
        formSuccess.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
          formSuccess.style.opacity = '1';
        }, 50);
      }, 300);
    });
  }
});
