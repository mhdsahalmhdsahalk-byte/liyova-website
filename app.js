/* ==========================================================================
   LIYOVA ONLINE - Config-Driven Interactive Logic & Admin Portal Panel
   ========================================================================== */

// 1. DEFAULT PRICING CONFIGURATION (Exact User-Provided Rates)
const DEFAULT_SERVICES_CONFIG = {
  "printing-a4": {
    name: "A4 Size Printing & Copying",
    type: "document-printing",
    options: {
      "bw": { label: "Black & White", rateSingle: 3, rateDouble: 6, discountRateSingle: 2.5, discountRateDouble: 5 },
      "ordinary": { label: "Color Ordinary 100 GSM", rateSingle: 20, rateDouble: 40, discountRateSingle: 15, discountRateDouble: 30 },
      "bond": { label: "Color Bond 100 GSM", rateSingle: 25, rateDouble: 50, discountRateSingle: 20, discountRateDouble: 40 },
      "220gsm": { label: "Color 220 GSM", rateSingle: 25, rateDouble: 50, discountRateSingle: 20, discountRateDouble: 40 },
      "300gsm": { label: "Color 300 GSM", rateSingle: 30, rateDouble: 60, discountRateSingle: 25, discountRateDouble: 50 },
      "art-paper": { label: "Color Art Paper Glossy", rateSingle: 25, rateDouble: 50, discountRateSingle: 20, discountRateDouble: 40 },
      "paper-sticker": { label: "Color Paper Sticker Glossy", rateSingle: 40, discountRateSingle: 35, singleSideOnly: true },
      "clear-sticker": { label: "Color Clear Sticker Glossy", rateSingle: 50, discountRateSingle: 45, singleSideOnly: true }
    }
  },
  "printing-a3": {
    name: "A3 Size Printing & Copying",
    type: "document-printing",
    options: {
      "bw": { label: "Black & White", rateSingle: 6, rateDouble: 12, discountRateSingle: 5, discountRateDouble: 10 },
      "ordinary": { label: "Color Ordinary 100 GSM", rateSingle: 30, rateDouble: 60, discountRateSingle: 25, discountRateDouble: 50 },
      "220gsm": { label: "Color 220 GSM", rateSingle: 40, rateDouble: 80, discountRateSingle: 35, discountRateDouble: 70 },
      "300gsm": { label: "Color 300 GSM", rateSingle: 50, rateDouble: 100, discountRateSingle: 45, discountRateDouble: 90 },
      "paper-sticker": { label: "Color Paper Sticker Glossy", rateSingle: 60, discountRateSingle: 55, singleSideOnly: true },
      "clear-sticker": { label: "Color Clear Sticker Glossy", rateSingle: 80, discountRateSingle: 75, singleSideOnly: true }
    }
  },
  "bookbinding": {
    name: "Professional Bookbinding",
    type: "pages",
    options: {
      "spiral": { label: "Spiral Binding", base: 50, perPage: 1 },
      "hard-standard": { label: "Standard Hard Binding", base: 150, perPage: 0 },
      "hard-premium": { label: "Premium Hard Binding", base: 250, perPage: 0 }
    }
  },
  "lamination": {
    name: "Lamination Services",
    type: "quantity",
    options: {
      "a4": { label: "A4 Size Lamination", rate: 40 },
      "a3": { label: "A3 Size Lamination", rate: 60 },
      "id": { label: "ID Card Size Lamination", rate: 20 }
    }
  },
  "id-card": {
    name: "PVC ID Card Printing",
    type: "quantity",
    options: {
      "standard": { label: "Standard PVC Card", rate: 100 }
    }
  },
  "nylon-seals": {
    name: "Pre-ink Nylon Seals",
    type: "quantity",
    options: {
      "size-f": { label: "Size F (22*49 mm)", rate: 300 },
      "size-a": { label: "Size A (23*63 mm)", rate: 320 },
      "size-q": { label: "Size Q (40*40 mm)", rate: 350 },
      "size-r": { label: "Size R (30*30 mm)", rate: 300 },
      "size-b": { label: "Size B (17*59 mm)", rate: 300 }
    }
  }
};

// 2. STATE MANAGER (Initialize Databases from localStorage)
let SERVICES_CONFIG = JSON.parse(localStorage.getItem('liyova_services_config')) || DEFAULT_SERVICES_CONFIG;
if (!localStorage.getItem('liyova_services_config')) {
  localStorage.setItem('liyova_services_config', JSON.stringify(DEFAULT_SERVICES_CONFIG));
}

let ORDER_LOGS = JSON.parse(localStorage.getItem('liyova_order_logs')) || [];
if (!localStorage.getItem('liyova_order_logs')) {
  localStorage.setItem('liyova_order_logs', JSON.stringify([]));
}

let ADMIN_PASSCODE = localStorage.getItem('liyova_admin_passcode') || 'liyova123';
if (!localStorage.getItem('liyova_admin_passcode')) {
  localStorage.setItem('liyova_admin_passcode', 'liyova123');
}

// Global Shopping Cart State
let orderCart = [];

document.addEventListener('DOMContentLoaded', () => {
  
  // 3. HEADER SCROLL DETECTION
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 4. MOBILE MENU TOGGLE
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
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

  // 5. SCROLL FADE ANIMATIONS
  const fadeElems = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-up');
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

  // 6. PORTFOLIO TABS FILTERING
  const tabs = document.querySelectorAll('.portfolio-tab');
  const items = document.querySelectorAll('.portfolio-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      items.forEach(item => {
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

  // 7. DYNAMIC CALCULATOR LOGIC
  const calcService = document.getElementById('calcService');
  const dynamicOptions = document.getElementById('dynamicOptions');
  const btnAddItem = document.getElementById('btnAddItem');
  const cartReceipt = document.getElementById('cartReceipt');
  const summaryTotalVal = document.getElementById('summaryTotalVal');
  const btnWhatsAppOrder = document.getElementById('btnWhatsAppOrder');

  // Initialize service category list in calculator
  if (calcService) {
    initCalculatorServices();

    calcService.addEventListener('change', () => {
      renderServiceFields(calcService.value);
    });
  }

  function initCalculatorServices() {
    calcService.innerHTML = '';
    Object.keys(SERVICES_CONFIG).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = SERVICES_CONFIG[key].name;
      calcService.appendChild(option);
    });
    // Render initial service fields
    renderServiceFields(calcService.value);
  }

  // Render fields dynamically based on service type
  function renderServiceFields(serviceKey) {
    const service = SERVICES_CONFIG[serviceKey];
    if (!service) return;

    let html = '';

    // 1. Primary Option Dropdown
    html += `
      <div class="calc-group fade-in-up appear">
        <label class="calc-label">Select Option</label>
        <select id="primaryOption" class="calc-select">
    `;
    Object.keys(service.options).forEach(optKey => {
      const opt = service.options[optKey];
      let priceText = '';
      if (service.type === 'document-printing') {
        priceText = opt.singleSideOnly ? `₹${opt.rateSingle}/pg` : `₹${opt.rateSingle}/pg single &bull; ₹${opt.rateDouble}/pg double`;
      } else if (service.type === 'pages') {
        priceText = opt.perPage > 0 ? `₹${opt.base} base + ₹${opt.perPage}/pg` : `₹${opt.base} flat`;
      } else {
        priceText = `₹${opt.rate}`;
      }
      html += `<option value="${optKey}">${opt.label} (${priceText})</option>`;
    });
    html += `</select></div>`;

    // 2. Double Sided Selection (For Printing)
    if (service.type === 'document-printing') {
      html += `
        <div id="printModeGroup" class="calc-group fade-in-up appear">
          <label class="calc-label">Printing Mode</label>
          <div class="options-grid" style="grid-template-columns: repeat(2, 1fr);">
            <div class="option-checkbox-wrapper">
              <input type="radio" id="modeSingle" name="printMode" class="option-checkbox-input" value="single" checked>
              <label for="modeSingle" class="option-checkbox-label" style="justify-content: center;">
                <span class="checkbox-custom" style="border-radius: 50%;"></span>
                Single Sided
              </label>
            </div>
            <div class="option-checkbox-wrapper" id="modeDoubleWrapper">
              <input type="radio" id="modeDouble" name="printMode" class="option-checkbox-input" value="double">
              <label for="modeDouble" class="option-checkbox-label" style="justify-content: center;">
                <span class="checkbox-custom" style="border-radius: 50%;"></span>
                Double Sided
              </label>
            </div>
          </div>
        </div>
      `;
    }

    // 3. Count inputs (Pages or Quantity)
    if (service.type === 'document-printing' || service.type === 'pages') {
      html += `
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Number of Pages</label>
          <div class="range-container">
            <input type="range" id="itemCount" class="range-slider" min="1" max="500" value="10">
            <div id="itemCountVal" class="range-val-badge">10</div>
          </div>
        </div>
      `;
    } else if (service.type === 'quantity') {
      html += `
        <div class="calc-group fade-in-up appear">
          <label class="calc-label">Quantity</label>
          <div class="range-container">
            <input type="range" id="itemCount" class="range-slider" min="1" max="50" value="1">
            <div id="itemCountVal" class="range-val-badge">1</div>
          </div>
        </div>
      `;
    }

    // 4. Single Item Price Preview
    html += `
      <div class="calc-group fade-in-up appear" style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span style="color:var(--text-muted);">Current Item Subtotal:</span>
          <span id="currentItemPrice" style="color:var(--primary); font-size:1.15rem;">₹0</span>
        </div>
      </div>
    `;

    dynamicOptions.innerHTML = html;

    // Attach listeners for range slider
    const itemCount = document.getElementById('itemCount');
    if (itemCount) {
      const itemCountVal = document.getElementById('itemCountVal');
      itemCount.addEventListener('input', () => {
        itemCountVal.textContent = itemCount.value;
        updateItemSubtotal();
      });
    }

    // Attach listeners to selectors
    const primaryOption = document.getElementById('primaryOption');
    if (primaryOption) {
      primaryOption.addEventListener('change', () => {
        toggleDoubleSideOption();
        updateItemSubtotal();
      });
    }

    const printModes = dynamicOptions.querySelectorAll('input[name="printMode"]');
    printModes.forEach(radio => {
      radio.addEventListener('change', updateItemSubtotal);
    });

    toggleDoubleSideOption();
    updateItemSubtotal();
  }

  // Toggle Double Sided radio option if paper type is Single Side Only (Sticker papers)
  function toggleDoubleSideOption() {
    const serviceKey = calcService.value;
    const service = SERVICES_CONFIG[serviceKey];
    if (!service || service.type !== 'document-printing') return;

    const optKey = document.getElementById('primaryOption').value;
    const option = service.options[optKey];
    const modeDoubleWrapper = document.getElementById('modeDoubleWrapper');
    const modeSingle = document.getElementById('modeSingle');

    if (option.singleSideOnly) {
      modeSingle.checked = true;
      if (modeDoubleWrapper) {
        modeDoubleWrapper.style.opacity = '0.4';
        modeDoubleWrapper.style.pointerEvents = 'none';
      }
    } else {
      if (modeDoubleWrapper) {
        modeDoubleWrapper.style.opacity = '1';
        modeDoubleWrapper.style.pointerEvents = 'auto';
      }
    }
  }

  // Calculate pricing for the single item currently configured
  function calculateCurrentItem() {
    const serviceKey = calcService.value;
    const service = SERVICES_CONFIG[serviceKey];
    if (!service) return { price: 0, desc: '' };

    const optKey = document.getElementById('primaryOption').value;
    const option = service.options[optKey];
    
    let price = 0;
    let count = 1;
    let desc = '';

    const countElem = document.getElementById('itemCount');
    if (countElem) {
      count = parseInt(countElem.value, 10);
    }

    if (service.type === 'document-printing') {
      const mode = dynamicOptions.querySelector('input[name="printMode"]:checked').value;
      const isDouble = (mode === 'double');
      const isBulk = (count > 100);

      let unitPrice = 0;
      if (isBulk) {
        unitPrice = isDouble ? option.discountRateDouble : option.discountRateSingle;
      } else {
        unitPrice = isDouble ? option.rateDouble : option.rateSingle;
      }

      price = count * unitPrice;
      
      const bulkTag = isBulk ? ' (Bulk Discount Applied)' : '';
      const modeLabel = isDouble ? 'Double Sided' : 'Single Sided';
      desc = `${count} Pages of ${option.label} [${modeLabel}] @ ₹${unitPrice}/pg${bulkTag}`;

    } else if (service.type === 'pages') {
      price = parseFloat(option.base) + (parseFloat(option.perPage) * count);
      desc = `${option.label} (${count} Pages)`;

    } else if (service.type === 'quantity') {
      price = parseFloat(option.rate) * count;
      desc = `${count}x ${option.label}`;
    }

    return {
      serviceKey: serviceKey,
      serviceName: service.name,
      optionLabel: option.label,
      count: count,
      price: price,
      desc: desc
    };
  }

  function updateItemSubtotal() {
    const item = calculateCurrentItem();
    const subtotalDisplay = document.getElementById('currentItemPrice');
    if (subtotalDisplay) {
      subtotalDisplay.textContent = `₹${item.price}`;
    }
  }

  // 8. ORDER CART ACTIONS
  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      const configuredItem = calculateCurrentItem();
      if (configuredItem.price <= 0) return;

      orderCart.push({
        id: Date.now(),
        serviceKey: configuredItem.serviceKey,
        serviceName: configuredItem.serviceName,
        optionLabel: configuredItem.optionLabel,
        count: configuredItem.count,
        price: configuredItem.price,
        desc: configuredItem.desc
      });

      updateCartUI();
      
      // Animate Add to receipt button
      const origText = btnAddItem.innerHTML;
      btnAddItem.style.backgroundColor = '#25D366';
      btnAddItem.style.color = '#FFFFFF';
      btnAddItem.innerHTML = '&#10003; Added to Receipt';
      setTimeout(() => {
        btnAddItem.style.backgroundColor = '';
        btnAddItem.style.color = '';
        btnAddItem.innerHTML = origText;
      }, 1000);
    });
  }

  window.removeCartItem = function(id) {
    orderCart = orderCart.filter(item => item.id !== id);
    updateCartUI();
  };

  function updateCartUI() {
    if (orderCart.length === 0) {
      cartReceipt.innerHTML = `
        <div style="text-align:center; padding: 40px 0; color: rgba(252, 250, 247, 0.4);">
          <svg style="width:48px;height:48px;fill:currentColor;margin-bottom:12px;opacity:0.5;" viewBox="0 0 24 24"><path d="M17.21 9l-4.38-6.56c-.18-.28-.5-.44-.83-.44s-.66.16-.83.44L6.79 9H2c-1.1 0-2 .9-2 2v2c0 .96.69 1.76 1.62 1.93L3.18 20.3c.15.53.62.9 1.18.9h15.28c.56 0 1.03-.37 1.18-.9l1.56-5.37c.93-.17 1.62-.97 1.62-1.93v-2c0-1.1-.9-2-2-2h-4.79zM9 9l3-4.5L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
          <p style="font-size:0.9rem;">Your receipt is empty.<br>Configure a service on the left and click Add.</p>
        </div>
      `;
      summaryTotalVal.textContent = '₹0';
      btnWhatsAppOrder.disabled = true;
      btnWhatsAppOrder.style.opacity = '0.5';
      return;
    }

    btnWhatsAppOrder.disabled = false;
    btnWhatsAppOrder.style.opacity = '1';

    let html = '<ul style="list-style:none; display:flex; flex-direction:column; gap:12px;">';
    let total = 0;

    orderCart.forEach((item, index) => {
      total += item.price;
      html += `
        <li class="fade-in-up appear" style="display:flex; justify-content:space-between; align-items:center; background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.08);">
          <div style="flex-grow:1; padding-right:12px;">
            <div style="font-weight:700; font-size:0.95rem; color: var(--gold);">${index + 1}. ${item.serviceName}</div>
            <div style="font-size:0.8rem; color: rgba(252,250,247,0.7); margin-top:2px;">${item.desc}</div>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <span style="font-weight:700; color:#FFFFFF;">₹${item.price}</span>
            <button onclick="removeCartItem(${item.id})" style="background:none; border:none; cursor:pointer; color: #FF4D4D; display:flex; align-items:center; padding: 4px;" title="Delete item">
              <svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </li>
      `;
    });
    html += '</ul>';

    cartReceipt.innerHTML = html;
    animateNumberValue(summaryTotalVal, total);
  }

  function animateNumberValue(element, targetVal) {
    const currentVal = parseInt(element.textContent.replace('₹', ''), 10) || 0;
    if (currentVal === targetVal) return;
    
    const duration = 250;
    const startTime = performance.now();
    
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

  // 9. DATABASE LOGGING HOOKS
  function logOrderToDatabase(type, itemsText, total) {
    const newOrder = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      type: type, // 'WhatsApp Cart' or 'Contact Inquiry'
      details: itemsText,
      total: total,
      status: 'Pending'
    };
    ORDER_LOGS.unshift(newOrder);
    localStorage.setItem('liyova_order_logs', JSON.stringify(ORDER_LOGS));
  }

  // 10. PREMIUM WHATSAPP INVOICE FORMATTING
  if (btnWhatsAppOrder) {
    btnWhatsAppOrder.addEventListener('click', () => {
      if (orderCart.length === 0) return;

      let total = 0;
      let itemsList = '';
      let logText = '';
      
      orderCart.forEach((item, index) => {
        total += item.price;
        itemsList += `${index + 1}. *${item.serviceName}*\n`;
        itemsList += `   • Detail: ${item.desc}\n`;
        itemsList += `   • Subtotal: ₹${item.price}\n\n`;

        logText += `${item.serviceName} (${item.desc}) - ₹${item.price}; `;
      });

      // Save order in local Admin Orders database
      logOrderToDatabase('WhatsApp Cart', logText, total);

      const invoiceMsg = `*🧾 LIYOVA ONLINE - ORDER INVOICE*
--------------------------------------------
*Shop Contact:* +91 8590909003
*Email:* liyovaonline@gmail.com
--------------------------------------------

*Order Details:*
${itemsList}--------------------------------------------
*Estimated Total: ₹${total}*
--------------------------------------------
Please let me know how I should send my files/documents. Thank you!`;

      const encodedMsg = encodeURIComponent(invoiceMsg);
      const waUrl = `https://wa.me/918590909003?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    });
  }

  // 11. CONTACT FORM SUBMISSION TO WHATSAPP
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();
      
      if (!name || !phone || !email || !message) {
        alert('Please fill out all fields.');
        return;
      }

      // Log contact inquiry to admin orders database
      const inquiryLogText = `From: ${name} | Phone: ${phone} | Email: ${email} | msg: ${message}`;
      logOrderToDatabase('Contact Inquiry', inquiryLogText, 0);

      // Format WhatsApp query
      const waContactMsg = `*📩 LIYOVA ONLINE - NEW CONTACT INQUIRY*
--------------------------------------------
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}

*Project details / Message:*
${message}
--------------------------------------------`;

      const encodedMsg = encodeURIComponent(waContactMsg);
      const waUrl = `https://wa.me/918590909003?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
      
      // Animated form success display
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

  // ==========================================
  // 12. ADMIN PORTAL FUNCTIONALITY
  // ==========================================
  const triggerAdmin = document.getElementById('triggerAdmin');
  const adminModal = document.getElementById('adminModal');
  const closeAdminModal = document.getElementById('closeAdminModal');
  const adminLoginScreen = document.getElementById('adminLoginScreen');
  const adminDashboardScreen = document.getElementById('adminDashboardScreen');
  const btnSubmitLogin = document.getElementById('btnSubmitLogin');
  const adminPassInput = document.getElementById('adminPassInput');
  const loginErrorMsg = document.getElementById('loginErrorMsg');

  // Open modal check
  if (triggerAdmin) {
    triggerAdmin.addEventListener('click', (e) => {
      e.preventDefault();
      adminModal.classList.add('active');
      
      // Check if session is already authenticated
      if (sessionStorage.getItem('liyova_admin_authenticated') === 'true') {
        showAdminDashboard();
      } else {
        showAdminLogin();
      }
    });
  }

  if (closeAdminModal) {
    closeAdminModal.addEventListener('click', () => {
      adminModal.classList.remove('active');
    });
  }

  // Handle Login Check
  if (btnSubmitLogin) {
    btnSubmitLogin.addEventListener('click', () => {
      const inputPass = adminPassInput.value;
      if (inputPass === ADMIN_PASSCODE) {
        sessionStorage.setItem('liyova_admin_authenticated', 'true');
        showAdminDashboard();
        adminPassInput.value = '';
        loginErrorMsg.style.display = 'none';
      } else {
        loginErrorMsg.textContent = 'Incorrect passcode. Please try again.';
        loginErrorMsg.style.display = 'block';
        adminPassInput.value = '';
      }
    });

    // Enter key press triggers login
    adminPassInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        btnSubmitLogin.click();
      }
    });
  }

  function showAdminLogin() {
    adminLoginScreen.style.display = 'block';
    adminDashboardScreen.style.display = 'none';
  }

  function showAdminDashboard() {
    adminLoginScreen.style.display = 'none';
    adminDashboardScreen.style.display = 'grid';
    
    // Default Tab
    switchDashboardTab('overview');
  }

  // Dashboard Tab Switching Handler
  const dashNavItems = document.querySelectorAll('.dash-nav-item');
  dashNavItems.forEach(item => {
    item.addEventListener('click', () => {
      dashNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      switchDashboardTab(item.dataset.tab);
    });
  });

  function switchDashboardTab(tabName) {
    const dashViews = document.querySelectorAll('.dash-view');
    dashViews.forEach(view => view.classList.remove('active'));

    const activeView = document.getElementById(`view-${tabName}`);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Refresh contents
    if (tabName === 'overview') {
      renderAnalyticsOverview();
    } else if (tabName === 'orders') {
      renderOrdersLog();
    } else if (tabName === 'pricing') {
      renderPricingForm();
    } else if (tabName === 'settings') {
      renderSettingsPanel();
    } else if (tabName === 'backup') {
      renderBackupPanel();
    }
  }

  // 12.1 OVERVIEW / ANALYTICS
  function renderAnalyticsOverview() {
    let totalRevenue = 0;
    let whatsappOrdersCount = 0;
    let inquiriesCount = 0;
    const categoryCounts = {};

    ORDER_LOGS.forEach(order => {
      totalRevenue += parseFloat(order.total) || 0;
      if (order.type === 'WhatsApp Cart') {
        whatsappOrdersCount++;
        // Track category counts
        Object.keys(SERVICES_CONFIG).forEach(key => {
          if (order.details.toLowerCase().includes(SERVICES_CONFIG[key].name.toLowerCase())) {
            categoryCounts[key] = (categoryCounts[key] || 0) + 1;
          }
        });
      } else {
        inquiriesCount++;
      }
    });

    document.getElementById('statTotalRevenue').textContent = `₹${totalRevenue}`;
    document.getElementById('statTotalOrders').textContent = ORDER_LOGS.length;
    document.getElementById('statWaCount').textContent = whatsappOrdersCount;
    document.getElementById('statInqCount').textContent = inquiriesCount;

    // Find most popular service
    let popularService = 'N/A';
    let maxCount = 0;
    Object.keys(categoryCounts).forEach(key => {
      if (categoryCounts[key] > maxCount) {
        maxCount = categoryCounts[key];
        popularService = SERVICES_CONFIG[key].name;
      }
    });
    document.getElementById('statPopularService').textContent = popularService;

    // Render Analytics Chart Indicators
    const chartContainer = document.getElementById('analyticsCharts');
    if (chartContainer) {
      let chartsHtml = '';
      if (ORDER_LOGS.length === 0) {
        chartsHtml = `<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; padding: 20px 0;">No order logs present to calculate charts.</p>`;
      } else {
        chartsHtml = `
          <h4 style="color:#FFFFFF; font-family:var(--font-heading); margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px;">Popularity Breakdown</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
        `;
        
        Object.keys(SERVICES_CONFIG).forEach(key => {
          const count = categoryCounts[key] || 0;
          const percentage = whatsappOrdersCount > 0 ? Math.round((count / whatsappOrdersCount) * 100) : 0;
          
          chartsHtml += `
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
                <span style="font-weight:700; color:var(--text-light);">${SERVICES_CONFIG[key].name}</span>
                <span style="color:var(--gold); font-weight:700;">${count} orders (${percentage}%)</span>
              </div>
              <div style="background:rgba(255,255,255,0.05); height:8px; border-radius:4px; overflow:hidden;">
                <div style="background:var(--gold); height:100%; width:${percentage}%; transition:width 0.5s ease;"></div>
              </div>
            </div>
          `;
        });
        chartsHtml += '</div>';
      }
      chartContainer.innerHTML = chartsHtml;
    }
  }

  // 12.2 ORDERS LOG
  function renderOrdersLog() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;

    if (ORDER_LOGS.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:40px 0; color:var(--text-muted); font-size:0.9rem;">
            No orders or inquiries logged yet.
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    ORDER_LOGS.forEach(order => {
      const badgeColor = order.type === 'WhatsApp Cart' ? '#25D366' : '#C5A880';
      const statusBadge = order.status === 'Completed' ? 'background:#1B5E20; color:#81C784;' : 'background:#4A2E16; color:var(--gold);';
      
      html += `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding:14px; font-size:0.85rem; color:var(--text-muted); font-family:monospace;">${order.timestamp}</td>
          <td style="padding:14px;">
            <span style="background:${badgeColor}; color:#000000; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:4px;">${order.type}</span>
          </td>
          <td style="padding:14px; font-size:0.85rem; color:#FFFFFF; max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${order.details}">
            ${order.details}
          </td>
          <td style="padding:14px; font-weight:700; color:#FFFFFF;">₹${order.total}</td>
          <td style="padding:14px;">
            <button onclick="toggleOrderStatus(${order.id})" style="border:none; border-radius:4px; font-size:0.75rem; font-weight:700; padding:4px 8px; cursor:pointer; ${statusBadge}">
              ${order.status || 'Pending'}
            </button>
          </td>
          <td style="padding:14px; text-align:center;">
            <button onclick="deleteOrderLog(${order.id})" style="background:none; border:none; color:#FF4D4D; cursor:pointer; padding:4px;" title="Delete Log">
              <svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </td>
        </tr>
      `;
    });
    tableBody.innerHTML = html;
  }

  window.toggleOrderStatus = function(id) {
    ORDER_LOGS = ORDER_LOGS.map(order => {
      if (order.id === id) {
        order.status = order.status === 'Completed' ? 'Pending' : 'Completed';
      }
      return order;
    });
    localStorage.setItem('liyova_order_logs', JSON.stringify(ORDER_LOGS));
    renderOrdersLog();
  };

  window.deleteOrderLog = function(id) {
    if (confirm('Are you sure you want to delete this order log?')) {
      ORDER_LOGS = ORDER_LOGS.filter(order => order.id !== id);
      localStorage.setItem('liyova_order_logs', JSON.stringify(ORDER_LOGS));
      renderOrdersLog();
    }
  };

  // 12.3 PRICING EDITOR
  function renderPricingForm() {
    const container = document.getElementById('pricingFormContainer');
    if (!container) return;

    let html = '';

    Object.keys(SERVICES_CONFIG).forEach(serviceKey => {
      const service = SERVICES_CONFIG[serviceKey];
      html += `
        <div class="pricing-editor-section" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); padding:20px; border-radius:var(--radius-md); margin-bottom:20px;">
          <h4 style="color:var(--gold); font-family:var(--font-heading); font-size:1.15rem; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px;">${service.name}</h4>
          <div style="display:flex; flex-direction:column; gap:16px;">
      `;

      Object.keys(service.options).forEach(optKey => {
        const option = service.options[optKey];
        
        html += `
          <div style="background: rgba(0,0,0,0.2); padding:12px; border-radius:6px; border:1px solid rgba(255,255,255,0.03);">
            <div style="font-weight:700; color:#FFFFFF; margin-bottom:8px; font-size:0.9rem;">${option.label}</div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap:10px;">
        `;

        if (service.type === 'document-printing') {
          html += `
            <div>
              <label style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Single Side Rate (₹)</label>
              <input type="number" step="0.1" class="pricing-input" data-service="${serviceKey}" data-opt="${optKey}" data-field="rateSingle" value="${option.rateSingle}">
            </div>
            <div>
              <label style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Bulk Single Rate (₹)</label>
              <input type="number" step="0.1" class="pricing-input" data-service="${serviceKey}" data-opt="${optKey}" data-field="discountRateSingle" value="${option.discountRateSingle}">
            </div>
          `;
          if (!option.singleSideOnly) {
            html += `
              <div>
                <label style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Double Side Rate (₹)</label>
                <input type="number" step="0.1" class="pricing-input" data-service="${serviceKey}" data-opt="${optKey}" data-field="rateDouble" value="${option.rateDouble}">
              </div>
              <div>
                <label style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Bulk Double Rate (₹)</label>
                <input type="number" step="0.1" class="pricing-input" data-service="${serviceKey}" data-opt="${optKey}" data-field="discountRateDouble" value="${option.discountRateDouble}">
              </div>
            `;
          }
        } else if (service.type === 'pages') {
          html += `
            <div>
              <label style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Base Cost (₹)</label>
              <input type="number" step="1" class="pricing-input" data-service="${serviceKey}" data-opt="${optKey}" data-field="base" value="${option.base}">
            </div>
            <div>
              <label style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Per Page Cost (₹)</label>
              <input type="number" step="1" class="pricing-input" data-service="${serviceKey}" data-opt="${optKey}" data-field="perPage" value="${option.perPage}">
            </div>
          `;
        } else if (service.type === 'quantity') {
          html += `
            <div>
              <label style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">Unit Price (₹)</label>
              <input type="number" step="1" class="pricing-input" data-service="${serviceKey}" data-opt="${optKey}" data-field="rate" value="${option.rate}">
            </div>
          `;
        }

        html += `</div></div>`;
      });

      html += `</div></div>`;
    });

    // Add save button at the bottom
    html += `
      <button id="btnSavePricing" class="btn btn-primary" style="width:100%; margin-top:10px; font-weight:700;">
        Save All Pricing Rates
      </button>
    `;

    container.innerHTML = html;

    // Attach Save Listener
    const btnSavePricing = document.getElementById('btnSavePricing');
    if (btnSavePricing) {
      btnSavePricing.addEventListener('click', () => {
        savePricingFromForm();
      });
    }
  }

  function savePricingFromForm() {
    const inputs = document.querySelectorAll('.pricing-input');
    inputs.forEach(input => {
      const sKey = input.dataset.service;
      const oKey = input.dataset.opt;
      const field = input.dataset.field;
      const value = parseFloat(input.value);

      if (SERVICES_CONFIG[sKey] && SERVICES_CONFIG[sKey].options[oKey]) {
        SERVICES_CONFIG[sKey].options[oKey][field] = value;
      }
    });

    localStorage.setItem('liyova_services_config', JSON.stringify(SERVICES_CONFIG));
    alert('All pricing rates updated successfully!');
    
    // Re-initialize Calculator fields
    initCalculatorServices();
  }

  // 12.4 EXPORT & IMPORT BACKUPS
  function renderBackupPanel() {
    const btnExportData = document.getElementById('btnExportData');
    const inputImportFile = document.getElementById('inputImportFile');

    if (btnExportData) {
      // Remove any duplicate listener
      const newBtn = btnExportData.cloneNode(true);
      btnExportData.parentNode.replaceChild(newBtn, btnExportData);
      
      newBtn.addEventListener('click', () => {
        const backupData = {
          services_config: SERVICES_CONFIG,
          order_logs: ORDER_LOGS,
          admin_passcode: ADMIN_PASSCODE
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `liyova_backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      });
    }

    if (inputImportFile) {
      inputImportFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
          try {
            const parsedData = JSON.parse(event.target.result);
            if (parsedData.services_config && parsedData.order_logs) {
              SERVICES_CONFIG = parsedData.services_config;
              ORDER_LOGS = parsedData.order_logs;
              ADMIN_PASSCODE = parsedData.admin_passcode || ADMIN_PASSCODE;

              localStorage.setItem('liyova_services_config', JSON.stringify(SERVICES_CONFIG));
              localStorage.setItem('liyova_order_logs', JSON.stringify(ORDER_LOGS));
              localStorage.setItem('liyova_admin_passcode', ADMIN_PASSCODE);

              alert('Database imported successfully! Page will refresh now.');
              window.location.reload();
            } else {
              alert('Invalid backup file structure. Missing fields.');
            }
          } catch (err) {
            alert('Error parsing JSON backup file.');
          }
        };
        reader.readAsText(file);
      });
    }
  }

  // 12.5 SETTINGS
  function renderSettingsPanel() {
    const btnChangePasscode = document.getElementById('btnChangePasscode');
    const inputNewPasscode = document.getElementById('inputNewPasscode');
    const btnResetDefaults = document.getElementById('btnResetDefaults');
    const btnWipeLogs = document.getElementById('btnWipeLogs');

    if (btnChangePasscode) {
      const newBtn = btnChangePasscode.cloneNode(true);
      btnChangePasscode.parentNode.replaceChild(newBtn, btnChangePasscode);

      newBtn.addEventListener('click', () => {
        const newCode = inputNewPasscode.value.trim();
        if (newCode.length < 4) {
          alert('Passcode must be at least 4 characters.');
          return;
        }
        ADMIN_PASSCODE = newCode;
        localStorage.setItem('liyova_admin_passcode', newCode);
        alert('Passcode changed successfully!');
        inputNewPasscode.value = '';
      });
    }

    if (btnResetDefaults) {
      const newBtn = btnResetDefaults.cloneNode(true);
      btnResetDefaults.parentNode.replaceChild(newBtn, btnResetDefaults);

      newBtn.addEventListener('click', () => {
        if (confirm('Warning: This will restore all pricing rates back to the original standard list. Continue?')) {
          SERVICES_CONFIG = DEFAULT_SERVICES_CONFIG;
          localStorage.setItem('liyova_services_config', JSON.stringify(DEFAULT_SERVICES_CONFIG));
          alert('Pricing configuration reset completed!');
          window.location.reload();
        }
      });
    }

    if (btnWipeLogs) {
      const newBtn = btnWipeLogs.cloneNode(true);
      btnWipeLogs.parentNode.replaceChild(newBtn, btnWipeLogs);

      newBtn.addEventListener('click', () => {
        if (confirm('Warning: This will permanently delete all order logs and inquiry histories. This action is irreversible! Continue?')) {
          ORDER_LOGS = [];
          localStorage.setItem('liyova_order_logs', JSON.stringify([]));
          alert('All order logs cleared!');
          switchDashboardTab('overview');
        }
      });
    }
  }

});
