const AMAZON_ASSOCIATE_TAG = "skincare0ea7-20";

// Query selectors
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitSection = document.getElementById("submitSection");
const form = document.getElementById("skincare-form");
const spinner = document.getElementById("spinner");
const resultCard = document.getElementById("resultCard");
const productList = document.getElementById("productList");
const backToFormBtn = document.getElementById("backToFormBtn");

let currentStep = 0;

// Realistic affiliate links with tracking placeholder
const products = [
  // Under $15
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1% Serum",
    description: "Reduces appearance of blemishes and congestion.",
    price: 7.5,
    affiliateUrl: "https://www.amazon.com/dp/B01MDTVZTZ/?tag=skincare0ea7-20",
    inStock: true,
  },
  {
    name: "CeraVe Hydrating Facial Cleanser",
    description: "Gentle cleanser for normal to dry skin.",
    price: 12.99,
    affiliateUrl: "https://www.amazon.com/dp/B01MSSDEPK/?tag=skincare0ea7-20",
    inStock: true,
  },
  {
    name: "Neutrogena Hydro Boost Body Lotion",
    description: "Hydrating gel moisturizer with hyaluronic acid.",
    price: 10.49,
    affiliateUrl: "https://www.amazon.com/dp/B07DJPC8JB/?tag=skincare0ea7-20",
    inStock: true,
  },

  // $15–30
  {
    name: "COSRX Snail Mucin 92% Face Moisturizer",
    description: "Repairs and soothes irritated skin.",
    price: 20.46,
    affiliateUrl: "https://www.amazon.com/dp/B01LEJ5MSK/?tag=skincare0ea7-20",
    inStock: true,
  },
  {
    name: "La Roche-Posay Micellar Cleansing Water for Sensitive Skin",
    description: "Hydrating gentle facial cleanser for normal to sensitive skin.",
    price: 18.39,
    affiliateUrl: "https://www.amazon.com/dp/B005EZSUS0/?tag=skincare0ea7-20",
    inStock: true,
  },
  {
    name: "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant",
    description: "Unclogs pores and smooths wrinkles.",
    price: 25.50,
    affiliateUrl: "https://www.amazon.com/dp/B07DK27V2F/?tag=skincare0ea7-20",
    inStock: true,
  },

  // $30–50
  {
    name: "La Roche-Posay Hyalu B5 Serum",
    description: "Plumping hyaluronic acid serum.",
    price: 44.99,
    affiliateUrl: "https://www.amazon.com/dp/B0DSQ2G3NY/?tag=skincare0ea7-20",
    inStock: true,
  },
  {
    name: "Vibriance Super C Serum for Mature Skin",
    description: "All-in-One Vitamin Formula Hydrates, Firms, Lifts, Smooths, Targets Age Spots, Wrinkles, 1 fl oz",
    price: 47,
    affiliateUrl: "https://www.amazon.com/dp/B08L8B5JR2/?tag=skincare0ea7-20",
    inStock: true,
  },
  {
    name: "Depology MATRIXYL® 3000 Serum",
    description: "Promotes Anti Wrinkle Serum, Skin Care Products for Face Elasticity",
    price: 40,
    affiliateUrl: "https://www.amazon.com/dp/B0CD25XNSG/?tag=skincare0ea7-20",
    inStock: true,
  },

  // $50+
  {
    name: "Paula's Choice BOOST C15 Super Booster",
    description: "15% Vitamin C with Vitamin E & Ferulic Acid, Skin Brightening Serum, 0.67 Ounce",
    price: 55,
    affiliateUrl: "https://www.amazon.com/dp/B00EYVSOKY/?tag=skincare0ea7-20",
    inStock: true,
  },
  {
    name: "Estée Lauder Advanced Night Repair Serum",
    description: "Hydrating and anti-aging serum for smoother skin.",
    price: 128,
    affiliateUrl: "https://www.amazon.com/dp/B08DHQCGH9/?tag=skincare0ea7-20",
    inStock: true,
  },
  {
    name: "Dr. Dennis Gross Alpha Beta Extra Strength Daily Peel",
    description: "2-Step Exfoliating Pads for Enhanced Anti-Aging, Smoother Skin, and Radiant Complexion, 60 Treatments",
    price: 153,
    affiliateUrl: "https://www.amazon.com/dp/B00CPKH9Y8/?tag=skincare0ea7-20",
    inStock: true,
  },
];

// Show current step with navigation logic
function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("hidden", i !== index);
  });

  if (progressBar) {
    progressBar.textContent = `Step ${index + 1} of ${steps.length}`;
  }

  if (prevBtn) prevBtn.classList.toggle("hidden", index === 0);
  if (nextBtn) nextBtn.classList.toggle("hidden", index === steps.length - 1);
  if (submitSection) submitSection.classList.toggle("hidden", index !== steps.length - 1);
}

// Navigation buttons
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const currentInputs = steps[currentStep].querySelectorAll("input, select");
    for (const input of currentInputs) {
      if (
        input.required &&
        ((input.type === "radio" && !steps[currentStep].querySelector(`input[name="${input.name}"]:checked`)) ||
         (input.type !== "radio" && !input.value))
      ) {
        alert("Please complete this step.");
        return;
      }
    }
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });
}

// Handle form submit
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (spinner) spinner.classList.remove("hidden");

    setTimeout(() => {
      if (spinner) spinner.classList.add("hidden");
      renderResults();
    }, 1200);
  });
}

// Render results
function renderResults() {
  const formData = new FormData(form);
  const selectedBudget = formData.get("budget");

  const budgetRange = {
    "Under $15": [0, 15],
    "$15-30": [15, 30],  // use hyphen-minus here
    "$30-50": [30, 50],  // use hyphen-minus here
    "$50+": [50, Infinity],
};


  const [minBudget, maxBudget] = budgetRange[selectedBudget] || [0, Infinity];

  // FIX: inclusive upper bound
  const filteredProducts = products.filter(
    (p) => p.inStock && p.price >= minBudget && p.price <= maxBudget
  );

  productList.innerHTML = "";

  if (filteredProducts.length === 0) {
    productList.innerHTML = `
      <p class="text-red-500 text-center">
        😔 Sorry, no products found in your selected budget and availability.
      </p>`;
  } else {
    filteredProducts.forEach((product) => {
      const card = document.createElement("div");
      card.className =
        "p-4 border rounded-2xl bg-blush shadow hover:shadow-lg transition-transform transform hover:scale-[1.02]";

      card.innerHTML = `
        <h4 class="text-lg font-bold text-lavender mb-1">${product.name}</h4>
        <p class="text-gray-700 mb-1">${product.description}</p>
        <p class="text-sm text-gray-500 mb-2">~ $${product.price.toFixed(2)}</p>
        <a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer"
           class="bg-lavender text-white px-3 py-2 rounded-lg shadow inline-block hover:bg-lavender-dark transition">
           View on Amazon
        </a>
      `;
      productList.appendChild(card);
    });
  }

  if (resultCard) resultCard.classList.remove("hidden");
  if (form) form.classList.add("hidden");

console.log("Selected budget:", selectedBudget);
console.log("Budget range:", budgetRange[selectedBudget]);

}


// Back to form button
if (backToFormBtn) {
  backToFormBtn.addEventListener("click", () => {
    if (resultCard) resultCard.classList.add("hidden");
    if (form) form.classList.remove("hidden");
    productList.innerHTML = "";
    currentStep = 0;
    showStep(currentStep);
  });
}

// Initialize on load
showStep(currentStep);


