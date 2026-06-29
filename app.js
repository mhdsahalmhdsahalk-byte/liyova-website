/* ==========================================================================
   LIYOVA ONLINE - Config-Driven Interactive Logic & Multi-Item Estimator
   ========================================================================== */

// 1. SERVICES & PRICING CONFIGURATION (Exact User-Provided Rates)
const SERVICES_CONFIG = {
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
      "hard-premium": { label: "Premium Hard Binding (Gold Lettering)", base: 250, perPage: 0 }
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
      "standard": { label: "Standard PVC Card (100/card)", rate: 100 }
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

// Global Shopping Cart State
let orderCart = [];

document.addEventListener('DOMContentLoaded', () => {
  
  // 2. HEADER SCROLL DETECTION
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. MOBILE MENU TOGGLE
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

  // 4. SCROLL FADE ANIMATIONS
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

  // 5. PORTFOLIO TABS FILTERING
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

  // 6. DYNAMIC CALCULATOR LOGIC
  const calcService = document.getElementById('calcService');
  const dynamicOptions = document.getElementById('dynamicOptions');
  const btnAddItem = document.getElementById('btnAddItem');
  const cartReceipt = document.getElementById('cartReceipt');
  const summaryTotalVal = document.getElementById('summaryTotalVal');
  const btnWhatsAppOrder = document.getElementById('btnWhatsAppOrder');

  // Initialize service category list in calculator
  if (calcService) {
    calcService.innerHTML = '';
    Object.keys(SERVICES_CONFIG).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = SERVICES_CONFIG[key].name;
      calcService.appendChild(option);
    });

    calcService.addEventListener('change', () => {
      renderServiceFields(calcService.value);
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
      price = option.base + (option.perPage * count);
      desc = `${option.label} (${count} Pages)`;

    } else if (service.type === 'quantity') {
      price = option.rate * count;
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

  // 7. ORDER CART ACTIONS
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

  // 8. PREMIUM WHATSAPP INVOICE FORMATTING
  if (btnWhatsAppOrder) {
    btnWhatsAppOrder.addEventListener('click', () => {
      if (orderCart.length === 0) return;

      let total = 0;
      let itemsList = '';
      
      orderCart.forEach((item, index) => {
        total += item.price;
        itemsList += `${index + 1}. *${item.serviceName}*\n`;
        itemsList += `   • Detail: ${item.desc}\n`;
        itemsList += `   • Subtotal: ₹${item.price}\n\n`;
      });

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

  // 9. CONTACT FORM SUBMISSION TO WHATSAPP
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
});
