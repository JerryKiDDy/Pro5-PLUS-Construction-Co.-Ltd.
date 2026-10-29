const popup = document.getElementById('project-popup');
const popupImage = document.getElementById('popup-image');
const closeButton = document.querySelector('.popup-close');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const prevButton = document.getElementById('gallery-prev');
const nextButton = document.getElementById('gallery-next');
const galleryCounter = document.getElementById('gallery-counter');
let lastFocusedCard = null;

let currentImages = [];
let currentImageIndex = 0;

// Gallery ပုံပြောင်းမယ်
function showGalleryImage(index) {
    if (currentImages.length === 0) return;

    currentImageIndex =
        (index + currentImages.length) % currentImages.length;

    popupImage.src = currentImages[currentImageIndex];

    galleryCounter.textContent =
        `${currentImageIndex + 1} / ${currentImages.length}`;

    // ပုံတစ်ပုံတည်းဆို Arrow မပြဘူး
    const showArrows = currentImages.length > 1;

    prevButton.hidden = !showArrows;
    nextButton.hidden = !showArrows;
    galleryCounter.hidden = !showArrows;
}

// ဘယ်ဘက် Arrow
prevButton.addEventListener('click', function (event) {
    event.stopPropagation();
    showGalleryImage(currentImageIndex - 1);
});

// ညာဘက် Arrow
nextButton.addEventListener('click', function (event) {
    event.stopPropagation();
    showGalleryImage(currentImageIndex + 1);
});

// Popup ဖွင့်တဲ့ Function
function openProject(card) {
    lastFocusedCard = card;
    const data = card.dataset;


let galleryImages = [];

try {
    galleryImages = JSON.parse(data.gallery || '[]');
} catch (error) {
    galleryImages = [];
}

// Gallery ထဲ ပုံမထည့်ရသေးရင် မူလ data-image ကို သုံးမယ်
currentImages = galleryImages.length
    ? galleryImages
    : (data.image ? [data.image] : []);

popupImage.alt = data.title || "Project photo";

showGalleryImage(0);



const fields = [
    ['popup-name', data.name],
    ['popup-client', data.client],
    ['popup-site-location', data.siteLocation || data.location],
    ['popup-building-type', data.buildingType],
    ['popup-construction-period', data.constructionPeriod],
    ['popup-design', data.design],
    ['popup-design-cost', data.designCost],
    ['popup-total-cost', data.totalCost],
    ['popup-design-qc', data.designQc],
    ['popup-supervisor', data.supervisor]
];

fields.forEach(([id, value]) => {
    const element = document.getElementById(id);
    const row = element.closest('.detail-row');
    const text = (value || '').trim();

    element.textContent = text;

    // အချက်အလက်မရှိရင် Row ကို ဖျောက်မယ်
    const isMissing =
        !text ||
        text === '' ||
        text === '' ||
        text.includes('( )') ||
        /^Engr;\s*-\s*$/.test(text);

    row.style.display = isMissing ? 'none' : '';
});


    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-open');
    closeButton.focus();
}

// Popup ပိတ်တဲ့ Function
function closeProject() {
    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-open');
    popupImage.src = '';
    if (lastFocusedCard) lastFocusedCard.focus();
}

projectCards.forEach(card => card.addEventListener('click', () => openProject(card)));
closeButton.addEventListener('click', closeProject);
popup.addEventListener('click', event => {
    if (event.target === popup) closeProject();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && popup.classList.contains('open')) closeProject();
});


// ==========================================
// Filter နဲ့ Load More အပိုင်း (ပြင်ဆင်ပြီး)
// ==========================================

const loadMoreBtn = document.getElementById("loadMore");

// ပထမဆုံး ၅ ပုံကို အရင်ပြမယ်
let visibleProjects = 5; 
let currentFilter = 'all';

function updateDisplay() {
    let matchedCards = [];

    // ၁။ လက်ရှိ Filter နဲ့ ကိုက်ညီတဲ့ ကတ်တွေကို အရင်ရှာမယ်
    projectCards.forEach(card => {
        const category = card.dataset.category;
        if (currentFilter === 'all' || category === currentFilter) {
            matchedCards.push(card);
        }
    });

    // ၂။ အကုန်လုံးကို အရင်ဖျောက်ထားမယ်
    projectCards.forEach(card => {
        card.style.display = "none";
    });

    // ၃။ Filter နဲ့ကိုက်တဲ့ ကတ်တွေထဲက visibleProjects အရေအတွက်အထိပဲ ပြမယ်
    for (let i = 0; i < visibleProjects && i < matchedCards.length; i++) {
        // မူလပုံ (50) လို ဒေါင်လိုက်ဖြစ်စေရန် "block" ကို သုံးပါ
        matchedCards[i].style.display = "block"; 
    }

    // ၄။ Load More ခလုတ်ကို ပြ/ဖျောက် စစ်မယ်
    if (visibleProjects >= matchedCards.length) {
        loadMoreBtn.style.display = "none"; // အကုန်ပြပြီးသွားရင် ခလုတ်ဖျောက်
    } else {
        loadMoreBtn.style.display = "block"; // ကျန်သေးရင် ခလုတ်ပြ
    }
}

// Filter ခလုတ်တွေ နှိပ်ရင် အလုပ်လုပ်မယ့် အပိုင်း
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(item => item.classList.toggle('active', item === button));
        
        currentFilter = button.dataset.filter;
        
        // အဓိက ပြင်ဆင်ချက် - Filter ပြောင်းတိုင်း အရေအတွက်ကို ၅ ခုကနေ ပြန်စမယ်
        visibleProjects = 5; 
        
        updateDisplay();
    });
});

// Load More နှိပ်ရင် အလုပ်လုပ်မယ့် အပိုင်း
loadMoreBtn.addEventListener("click", function() {
    visibleProjects += 5; // နှိပ်တိုင်း ၅ ခုစီ ထပ်တိုးမယ်
    updateDisplay();
});

// စစချင်း Website ပွင့်တာနဲ့ တစ်ခါခေါ်ပြမယ်
updateDisplay();