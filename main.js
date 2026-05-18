// ── Google Form URLs — paste your actual links here ──
const GFORM_URLS = {
  donate:    'YOUR_DONATE_FOOD_FORM_URL',
  request:   'YOUR_REQUEST_FOOD_FORM_URL',
  money:     'YOUR_DONATE_MONEY_FORM_URL',
  volunteer: 'YOUR_VOLUNTEER_FORM_URL'
};

function showPage(id) {
  if (['donate', 'request', 'money', 'volunteer'].includes(id)) {
    openActionModal(id);
    return;
  }

  const currentActive = document.querySelector('section.active');
  const targetSection = document.getElementById(id);
  
  if (!targetSection) return;
  closeMobileMenu();

  if (currentActive && currentActive !== targetSection) {
    if (currentActive.classList.contains('exiting')) return;
    
    currentActive.classList.add('exiting');
    
    const handleTransition = () => {
      currentActive.classList.remove('active', 'exiting');
      currentActive.removeEventListener('animationend', handleTransition);
      
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    
    currentActive.addEventListener('animationend', handleTransition);
  } else if (!currentActive) {
    targetSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function openGForm(type) {
  openActionModal(type);
}

function navGo(id) {
  if (['donate', 'request', 'money', 'volunteer'].includes(id)) {
    openActionModal(id);
  } else {
    showPage(id);
  }
}

// ── Action Modal Engine & Premium Forms ──
function openActionModal(type) {
  const modal = document.getElementById('actionModal');
  const content = document.getElementById('actionModalContent');
  if (!modal || !content) return;

  closeMobileMenu();
  document.body.style.overflow = 'hidden';

  const url = GFORM_URLS[type];
  const isValidUrl = url && url.startsWith('http') && !url.startsWith('YOUR_');

  if (isValidUrl) {
    content.innerHTML = `
      <iframe 
        src="${url}" 
        width="100%" 
        height="100%" 
        frameborder="0" 
        marginheight="0" 
        marginwidth="0"
        class="action-modal-iframe"
        title="Google Form"
      >Loading...</iframe>
    `;
  } else {
    renderMockForm(type, content);
  }

  modal.classList.remove('exiting');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeActionModal() {
  const modal = document.getElementById('actionModal');
  if (!modal) return;

  modal.classList.add('exiting');
  modal.setAttribute('aria-hidden', 'true');

  const handleExit = () => {
    modal.classList.remove('active', 'exiting');
    document.body.style.overflow = '';
    const content = document.getElementById('actionModalContent');
    if (content) content.innerHTML = '';
    modal.removeEventListener('transitionend', handleExit);
  };
  
  modal.addEventListener('transitionend', handleExit);
}

// Global intercepts for ActionModal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('actionModal');
    if (modal && modal.classList.contains('active')) {
      closeActionModal();
    }
  }
});

document.addEventListener('click', (e) => {
  const modal = document.getElementById('actionModal');
  if (modal && modal.classList.contains('active') && e.target === modal) {
    closeActionModal();
  }
});

function renderMockForm(type, container) {
  let formTitle = "";
  let formSubtitle = "";
  let formFieldsHTML = "";
  let submitClass = type;
  let btnIcon = "fa-paper-plane";
  let btnText = "Submit Details";

  if (type === 'donate') {
    formTitle = "Food Donation Form";
    formSubtitle = "Every contribution helps eliminate hunger. Please describe the food item details below.";
    btnIcon = "fa-hand-holding-heart";
    btnText = "Schedule Pickup";
    formFieldsHTML = `
      <div class="mock-form-row">
        <div class="mock-form-group">
          <label for="donorName">Donor Name / NGO</label>
          <input type="text" id="donorName" required placeholder="e.g. Arham Welfare Association">
        </div>
        <div class="mock-form-group">
          <label for="donorPhone">Contact Number</label>
          <input type="tel" id="donorPhone" required placeholder="e.g. +91 98765 43210">
        </div>
      </div>
      <div class="mock-form-group">
        <label for="foodDesc">Food Description</label>
        <textarea id="foodDesc" rows="3" required placeholder="Describe the meals (e.g. Rice & Dal, Paneer Curry, Fresh Bread)"></textarea>
      </div>
      <div class="mock-form-row">
        <div class="mock-form-group">
          <label for="foodQty">Quantity (kg or meals)</label>
          <input type="text" id="foodQty" required placeholder="e.g. 50 meals / 20 kg">
        </div>
        <div class="mock-form-group">
          <label for="foodExpiry">Expiry Time / Freshness</label>
          <input type="text" id="foodExpiry" required placeholder="e.g. Prepared 2 hrs ago, good for 6 hrs">
        </div>
      </div>
      <div class="mock-form-group">
        <label for="pickupAddress">Pickup Location</label>
        <input type="text" id="pickupAddress" required placeholder="Enter complete physical address">
      </div>
    `;
  } else if (type === 'request') {
    formTitle = "Food Request Form";
    formSubtitle = "No one should go hungry. Submit a food request and we will coordinate relief urgently.";
    btnIcon = "fa-truck-loading";
    btnText = "Request Assistance";
    formFieldsHTML = `
      <div class="mock-form-row">
        <div class="mock-form-group">
          <label for="reqName">Recipient Name / Shelter</label>
          <input type="text" id="reqName" required placeholder="e.g. Prem Orphanage Home">
        </div>
        <div class="mock-form-group">
          <label for="reqPhone">Contact Number</label>
          <input type="tel" id="reqPhone" required placeholder="e.g. +91 98765 43210">
        </div>
      </div>
      <div class="mock-form-group">
        <label for="reqLocation">Delivery Address / Area</label>
        <input type="text" id="reqLocation" required placeholder="Enter complete delivery location">
      </div>
      <div class="mock-form-row">
        <div class="mock-form-group">
          <label for="reqPeople">Number of People</label>
          <input type="number" id="reqPeople" min="1" required placeholder="e.g. 45">
        </div>
        <div class="mock-form-group">
          <label for="reqUrgency">Urgency Level</label>
          <select id="reqUrgency" required>
            <option value="Critical">Critical (No food currently)</option>
            <option value="High" selected>High (Needed for next meal)</option>
            <option value="Medium">Medium (Needed today)</option>
            <option value="Low">Low (General request)</option>
          </select>
        </div>
      </div>
      <div class="mock-form-group">
        <label for="reqFoodType">Type of Food Needed</label>
        <input type="text" id="reqFoodType" required placeholder="e.g. Dry rations, Cooked lunch, Milk/Baby food">
      </div>
    `;
  } else if (type === 'money') {
    formTitle = "Money Donation Form";
    formSubtitle = "Every rupee helps buy ingredients, maintain cold chains, and drive our delivery trucks.";
    btnIcon = "fa-heart";
    btnText = "Initiate Contribution";
    formFieldsHTML = `
      <div class="mock-form-row">
        <div class="mock-form-group">
          <label for="donName">Full Name</label>
          <input type="text" id="donName" required placeholder="e.g. Jane Doe">
        </div>
        <div class="mock-form-group">
          <label for="donEmail">Email / Phone</label>
          <input type="text" id="donEmail" required placeholder="e.g. jane@example.com">
        </div>
      </div>
      <div class="mock-form-group">
        <label>Donation Amount (₹)</label>
        <div class="mock-amount-chips">
          <button type="button" class="mock-amount-chip" data-amount="150" onclick="selectMockAmount(this)">₹150</button>
          <button type="button" class="mock-amount-chip" data-amount="500" onclick="selectMockAmount(this)">₹500</button>
          <button type="button" class="mock-amount-chip active" data-amount="1200" onclick="selectMockAmount(this)">₹1200</button>
          <button type="button" class="mock-amount-chip" data-amount="5000" onclick="selectMockAmount(this)">₹5000</button>
        </div>
        <input type="number" id="donCustomAmount" placeholder="Or enter custom amount in ₹" min="10" oninput="clearMockAmountChips(this)">
      </div>
      <div class="mock-form-row">
        <div class="mock-form-group">
          <label for="donCity">Your City</label>
          <input type="text" id="donCity" required placeholder="e.g. Bengaluru">
        </div>
        <div class="mock-form-group">
          <label for="donPayment">Payment Preference</label>
          <select id="donPayment" required>
            <option value="UPI" selected>UPI (Google Pay / PhonePe / Paytm)</option>
            <option value="Bank">Direct Bank Transfer (NEFT/IMPS)</option>
            <option value="International">Credit Card / International</option>
          </select>
        </div>
      </div>
    `;
  } else if (type === 'volunteer') {
    formTitle = "Become a Volunteer";
    formSubtitle = "Join our network of food rescue heroes and lead pickup drives in your locality.";
    btnIcon = "fa-user-plus";
    btnText = "Complete Registration";
    formFieldsHTML = `
      <div class="mock-form-row">
        <div class="mock-form-group">
          <label for="volName">Full Name</label>
          <input type="text" id="volName" required placeholder="e.g. John Smith">
        </div>
        <div class="mock-form-group">
          <label for="volPhone">Phone Number</label>
          <input type="tel" id="volPhone" required placeholder="e.g. +91 98765 43210">
        </div>
      </div>
      <div class="mock-form-row">
        <div class="mock-form-group">
          <label for="volArea">Your Area / Locality</label>
          <input type="text" id="volArea" required placeholder="e.g. Indiranagar">
        </div>
        <div class="mock-form-group">
          <label for="volVehicle">Do you have a vehicle?</label>
          <select id="volVehicle" required>
            <option value="Two-wheeler" selected>Two-Wheeler (Bike/Scooter)</option>
            <option value="Four-wheeler">Four-Wheeler (Car/SUV)</option>
            <option value="Auto">Auto / Cargo vehicle</option>
            <option value="None">None (On Foot / Public Transit)</option>
          </select>
        </div>
      </div>
      <div class="mock-form-group">
        <label for="volAvailability">Availability</label>
        <select id="volAvailability" required>
          <option value="Flexible" selected>Flexible / On-call</option>
          <option value="Weekends">Weekends only</option>
          <option value="Mornings">Mornings (7 AM - 11 AM)</option>
          <option value="Evenings">Evenings (6 PM - 10 PM)</option>
        </select>
      </div>
    `;
  }

  container.innerHTML = `
    <form class="mock-form-wrapper" onsubmit="submitMockForm(event, '${type}')">
      <div class="mock-form-header">
        <h3>${formTitle}</h3>
        <p>${formSubtitle}</p>
      </div>
      <div class="mock-form-fields">
        ${formFieldsHTML}
        <button type="submit" class="mock-form-submit-btn ${submitClass}">
          <i class="fas ${btnIcon}"></i> ${btnText}
        </button>
      </div>
    </form>
  `;
}

function selectMockAmount(button) {
  const wrapper = button.closest('.mock-form-fields');
  if (!wrapper) return;
  wrapper.querySelectorAll('.mock-amount-chip').forEach(chip => chip.classList.remove('active'));
  button.classList.add('active');
  const customInput = wrapper.querySelector('#donCustomAmount');
  if (customInput) customInput.value = '';
}

function clearMockAmountChips(input) {
  const wrapper = input.closest('.mock-form-fields');
  if (!wrapper) return;
  wrapper.querySelectorAll('.mock-amount-chip').forEach(chip => chip.classList.remove('active'));
}

function submitMockForm(event, type) {
  event.preventDefault();
  
  const content = document.getElementById('actionModalContent');
  if (!content) return;

  let headerText = "Submission Successful!";
  let subText = "Thank you for supporting ZeroZaya. Your information has been registered on our interactive staging environment. In a production build, this would automatically sync with Google Sheets or Firebase.";

  if (type === 'donate') {
    headerText = "Food Donation Registered!";
    subText = "Thank you, Food Hero! Our logistics team will review your pickup details and connect with you via WhatsApp to coordinate the collection. Together, we save food and serve lives!";
  } else if (type === 'request') {
    headerText = "Food Request Received!";
    subText = "We hear you. Your request has been logged and prioritized. Our emergency coordination team will verify food availability in your locality and contact you within the hour.";
  } else if (type === 'money') {
    const customAmountInput = content.querySelector('#donCustomAmount');
    const customVal = customAmountInput ? customAmountInput.value : '';
    const activeAmount = customVal || content.querySelector('.mock-amount-chip.active')?.dataset.amount || '1200';
    headerText = "Donation Initiated!";
    subText = `Amazing! You have chosen to support ZeroZaya with a contribution of ₹${activeAmount}. We will reach out to you via WhatsApp / Email with safe bank transfer and UPI instructions shortly!`;
  } else if (type === 'volunteer') {
    headerText = "Welcome to the Team!";
    subText = "Welcome to the ZeroZaya Food Rescue Network! You are now registered as an active volunteer. We will add you to our coordination group and notify you of any nearby pickups.";
  }

  content.innerHTML = `
    <div class="mock-success-screen">
      <div class="success-checkmark">
        <i class="fas fa-check"></i>
      </div>
      <h3>${headerText}</h3>
      <p>${subText}</p>
      <button class="success-done-btn" onclick="closeActionModal()">Close & Return</button>
    </div>
  `;
}

function toggleMenu() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  btn.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

function closeMobileMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Show a premium Framer Motion-style custom Toast notification
 * @param {string} message - Message to display
 */
function showPremiumToast(message = "Google form coming soon...") {
  // Remove existing premium toast(s)
  const existingToasts = document.querySelectorAll('.premium-toast');
  existingToasts.forEach(toast => toast.remove());

  // Create new toast element
  const toast = document.createElement('div');
  toast.className = 'premium-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger reflow to enable CSS transition
  toast.offsetHeight;

  // Animate in
  toast.classList.add('show');

  // Dismiss automatically after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('exit');
    
    // Remove from DOM after exit transition concludes
    toast.addEventListener('transitionend', function handler() {
      toast.remove();
      toast.removeEventListener('transitionend', handler);
    });
  }, 3000);
}

function showToast(msg) {
  showPremiumToast(msg);
}

// Global Click Interceptor for Dead and Placeholder Links (registered in capture phase)
document.addEventListener('click', function(event) {
  const target = event.target.closest('a, button');
  if (!target) return;

  // Exclude legitimate internal and external page routing actions
  const onclickAttr = target.getAttribute('onclick') || '';
  const isNavigation = 
    onclickAttr.includes('showPage') || 
    onclickAttr.includes('navGo') || 
    onclickAttr.includes('toggleMenu') || 
    onclickAttr.includes('closeMobileMenu') ||
    onclickAttr.includes('openGForm');

  if (isNavigation) {
    return;
  }

  let isDead = false;
  let href = target.getAttribute('href');

  // Intercept anchor tags with dead / placeholder links
  if (target.tagName.toLowerCase() === 'a') {
    if (!href || href === '#' || href === '' || href.toLowerCase().startsWith('javascript:') || href.includes('YOUR_') || href.includes('your_number')) {
      isDead = true;
    }
  }

  if (isDead) {
    event.preventDefault();
    event.stopPropagation();
    if (target.classList.contains('social-icon') || target.closest('.social-icons') || target.closest('.mobile-social')) {
      showPremiumToast("Social media links coming soon... 🚀");
    } else {
      showPremiumToast("Google form coming soon...");
    }
  }
}, true); // useCapture = true

function selectAmount(el) {
  document.querySelectorAll('.amount-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// Scroll shadow on nav
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 10);
});

// Counter animation
const targets = [12480, 3240, 580, 74];
const cIds = ['c1','c2','c3','c4'];
let animated = false;
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !animated) {
      animated = true;
      cIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        let cur = 0;
        const step = Math.ceil(targets[i] / 60);
        const iv = setInterval(() => {
          cur = Math.min(cur + step, targets[i]);
          el.textContent = cur.toLocaleString('en-IN');
          if (cur >= targets[i]) clearInterval(iv);
        }, 25);
      });
    }
  });
}, { threshold: 0.3 });
const impact = document.querySelector('.impact-section');
if (impact) obs.observe(impact);

// Close mobile nav on outside click
document.addEventListener('click', e => {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburger');
  if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) {
    closeMobileMenu();
  }
});
