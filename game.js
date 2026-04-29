// BuzzWords — Word Scramble Game

const wordBank = [
  // Digital Marketing
  { word: "ALGORITHM", hint: "The secret formula platforms use to decide what content you see", category: "Digital Marketing" },
  { word: "CONVERSION", hint: "When a visitor takes the desired action (buy, sign up...)", category: "Digital Marketing" },
  { word: "ENGAGEMENT", hint: "Likes, comments, shares — this measures how people interact", category: "Digital Marketing" },
  { word: "ANALYTICS", hint: "Data and stats that show how your campaigns are performing", category: "Digital Marketing" },
  { word: "RETARGETING", hint: "Showing ads to people who already visited your site", category: "Digital Marketing" },
  { word: "IMPRESSION", hint: "Every time your ad is displayed — even if nobody clicks", category: "Digital Marketing" },
  { word: "CLICKTHROUGH", hint: "The rate of people who click your ad after seeing it", category: "Digital Marketing" },
  { word: "FUNNEL", hint: "The customer journey from awareness to purchase", category: "Digital Marketing" },
  { word: "PERSONA", hint: "A fictional profile representing your ideal customer", category: "Digital Marketing" },
  { word: "COPYWRITING", hint: "Writing persuasive text for ads, emails, and landing pages", category: "Digital Marketing" },

  // E-commerce
  { word: "CHECKOUT", hint: "The final step before completing an online purchase", category: "E-commerce" },
  { word: "DROPSHIP", hint: "Selling products you don't physically stock yourself", category: "E-commerce" },
  { word: "UPSELL", hint: "Encouraging a customer to buy a more expensive version", category: "E-commerce" },
  { word: "REFUND", hint: "Money returned to a customer after a return or complaint", category: "E-commerce" },
  { word: "INVENTORY", hint: "All the products a store currently has in stock", category: "E-commerce" },
  { word: "COUPON", hint: "A discount code entered at checkout", category: "E-commerce" },
  { word: "LOGISTICS", hint: "The system behind storing, packing, and delivering orders", category: "E-commerce" },
  { word: "WISHLIST", hint: "A saved list of products a shopper wants to buy later", category: "E-commerce" },
  { word: "STOREFRONT", hint: "The main page of an online shop", category: "E-commerce" },
  { word: "GATEWAY", hint: "The technology that processes online payments securely", category: "E-commerce" },

  // TikTok
  { word: "VIRAL", hint: "Content that spreads rapidly and gets millions of views", category: "TikTok" },
  { word: "HASHTAG", hint: "A # tag used to categorize and discover content", category: "TikTok" },
  { word: "DUET", hint: "A TikTok feature where you react side-by-side with another video", category: "TikTok" },
  { word: "FYPAGE", hint: "The For You page — TikTok's main content discovery feed", category: "TikTok" },
  { word: "STITCH", hint: "A TikTok feature to clip and respond to someone else's video", category: "TikTok" },
  { word: "CREATOR", hint: "Someone who makes content on TikTok", category: "TikTok" },
  { word: "LIVESTREAM", hint: "Broadcasting video in real time to your followers", category: "TikTok" },
  { word: "TRENDING", hint: "Content or sounds that are currently very popular", category: "TikTok" },
  { word: "COLLAB", hint: "When two creators work together on content", category: "TikTok" },
  { word: "SOUNDBITE", hint: "A short, catchy audio clip used in short-form videos", category: "TikTok" },

  // Shopee
  { word: "FLASHSALE", hint: "A super short-time discount event on Shopee", category: "Shopee" },
  { word: "VOUCHER", hint: "A digital discount ticket applied at Shopee checkout", category: "Shopee" },
  { word: "SELLER", hint: "A person or business listing products on the platform", category: "Shopee" },
  { word: "REVIEW", hint: "Customer feedback left after receiving an order", category: "Shopee" },
  { word: "BUNDLE", hint: "Buying multiple products together for a discount", category: "Shopee" },
  { word: "PREFERRED", hint: "A Shopee badge given to top-performing shops", category: "Shopee" },
  { word: "SHIPPING", hint: "The cost and process of delivering your order", category: "Shopee" },
  { word: "CASHBACK", hint: "Getting a portion of your spending returned to you", category: "Shopee" },
  { word: "BIDDING", hint: "Competing with other sellers in Shopee Ads placement", category: "Shopee" },
  { word: "BOOSTADS", hint: "A Shopee feature to promote your listing with one click", category: "Shopee" },

  // Meta
  { word: "PIXEL", hint: "A tracking code placed on your website by Meta", category: "Meta" },
  { word: "CAMPAIGN", hint: "An organized advertising effort with a specific goal", category: "Meta" },
  { word: "ADSET", hint: "The layer in Meta Ads that defines audience and budget", category: "Meta" },
  { word: "LOOKALIKE", hint: "An audience Meta builds that resembles your existing customers", category: "Meta" },
  { word: "CREATIVE", hint: "The actual image or video shown in your ad", category: "Meta" },
  { word: "ROAS", hint: "Return on Ad Spend — revenue divided by ad cost", category: "Meta" },
  { word: "PLACEMENT", hint: "Where your ad appears: Feed, Stories, Reels, etc.", category: "Meta" },
  { word: "FREQUENCY", hint: "How many times the same person sees your ad", category: "Meta" },
  { word: "AUDIENCE", hint: "The group of people Meta shows your ads to", category: "Meta" },
  { word: "SPLITEST", hint: "Running two versions of an ad to see which performs better", category: "Meta" }
];

const LEADERBOARD_KEY = "buzzwords_leaderboard_v1";

let gameState = {
  round: 0, // 0-based index
  score: 0,
  streak: 0,
  totalRounds: 10,
  hintUsed: false,
  currentWord: null,
  shuffledDeck: [],
  correctCount: 0,
  isLocked: false
};

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scrambleWord(word) {
  const original = word.toUpperCase().trim();
  const letters = original.split("");
  const allSame = letters.every((ch) => ch === letters[0]);
  if (allSame || letters.length < 2) return original;

  for (let attempt = 0; attempt < 20; attempt++) {
    const shuffled = shuffleArray(letters);
    const result = shuffled.join("");
    if (result !== original) return result;
  }
  // Fallback: swap last two (helps avoid original in most cases)
  const swapped = letters.slice();
  const last = swapped.length - 1;
  [swapped[last], swapped[last - 1]] = [swapped[last - 1], swapped[last]];
  return swapped.join("");
}

function themeForCategory(category) {
  switch (category) {
    case "Digital Marketing":
      return "green";
    case "E-commerce":
      return "orange";
    case "TikTok":
      return "pink";
    case "Shopee":
      return "orange-red";
    case "Meta":
      return "blue";
    default:
      return "green";
  }
}

function categoryTag(category) {
  return `#${category}`;
}

function countUpInt(el, from, to, duration = 420) {
  const start = performance.now();
  const delta = to - from;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round(from + delta * eased);
    el.textContent = String(value);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initLeaderboardUI() {
  renderLeaderboard();
  const yearNow = document.getElementById("yearNow");
  if (yearNow) yearNow.textContent = String(new Date().getFullYear());
}

function setupNav() {
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!hamburgerBtn || !mobileMenu) return;

  hamburgerBtn.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    hamburgerBtn.setAttribute("aria-expanded", String(open));
    hamburgerBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });

  mobileMenu.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName.toLowerCase() === "a") {
      document.body.classList.remove("nav-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function setupGame() {
  const gameCard = document.getElementById("gameCard");
  const scrambledWordEl = document.getElementById("scrambledWord");
  const categoryBadgeEl = document.getElementById("categoryBadge");
  const hintBtn = document.getElementById("hintBtn");
  const skipBtn = document.getElementById("skipBtn");
  const submitBtn = document.getElementById("submitBtn");
  const inputEl = document.getElementById("answerInput");
  const hintTextEl = document.getElementById("hintText");
  const feedbackEl = document.getElementById("feedback");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  const scoreValueEl = document.getElementById("scoreValue");
  const roundValueEl = document.getElementById("roundValue");
  const streakValueEl = document.getElementById("streakValue");

  const modalOverlay = document.getElementById("gameOverModal");
  const modalSummary = document.getElementById("gameOverSummary");
  const finalScoreEl = document.getElementById("finalScore");
  const finalCorrectEl = document.getElementById("finalCorrect");
  const playerNameEl = document.getElementById("playerName");
  const saveScoreBtn = document.getElementById("saveScoreBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const saveNoteEl = document.getElementById("saveNote");

  function updateProgress() {
    const percent = ((gameState.round + 1) / gameState.totalRounds) * 100;
    progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `Round ${gameState.round + 1} of ${gameState.totalRounds}`;
  }

  function setTheme(category) {
    const theme = themeForCategory(category);
    gameCard.dataset.theme = theme;
  }

  function clearFeedback() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
  }

  function setFeedbackCorrect(points) {
    feedbackEl.className = "feedback feedback--correct";
    feedbackEl.textContent = `✅ Correct! +${points} pts`;
  }

  function setFeedbackWrong() {
    feedbackEl.className = "feedback feedback--wrong";
    feedbackEl.textContent = "❌ Not quite — shake it off and try again!";
  }

  function lockGame(locked) {
    gameState.isLocked = locked;
    inputEl.disabled = locked;
    hintBtn.disabled = locked;
    skipBtn.disabled = locked;
    submitBtn.disabled = locked;
  }

  function enableHintControls() {
    hintBtn.disabled = false;
    submitBtn.disabled = false;
    skipBtn.disabled = false;
    hintBtn.classList.remove("is-used");
  }

  function loadRound() {
    gameState.hintUsed = false;
    gameState.isLocked = false;
    // Ensure previous game-over locking doesn't keep the input disabled.
    lockGame(false);

    const deckIndex = gameState.round;
    gameState.currentWord = gameState.shuffledDeck[deckIndex];

    if (!gameState.currentWord) return;

    clearFeedback();
    hintTextEl.hidden = true;
    hintTextEl.textContent = "";
    enableHintControls();
    inputEl.value = "";
    inputEl.focus();

    scrambledWordEl.classList.remove("bounce");

    const scrambled = scrambleWord(gameState.currentWord.word);
    scrambledWordEl.textContent = scrambled;

    categoryBadgeEl.textContent = categoryTag(gameState.currentWord.category);
    setTheme(gameState.currentWord.category);

    scoreValueEl.textContent = String(gameState.score);
    roundValueEl.textContent = `${gameState.round + 1}/${gameState.totalRounds}`;
    streakValueEl.textContent = String(gameState.streak);

    updateProgress();
  }

  function nextRound() {
    gameState.round += 1;
    if (gameState.round >= gameState.totalRounds) {
      showGameOver();
      return;
    }
    loadRound();
  }

  function showHint() {
    if (gameState.isLocked) return;
    if (gameState.hintUsed) return;
    if (!gameState.currentWord) return;

    gameState.hintUsed = true;
    hintTextEl.hidden = false;
    hintTextEl.textContent = gameState.currentWord.hint;

    hintBtn.disabled = true;
    hintBtn.textContent = "Hint Used 💡";
  }

  function skipWord() {
    if (gameState.isLocked) return;
    if (!gameState.currentWord) return;

    lockGame(true);
    gameState.streak = 0;
    streakValueEl.textContent = "0";

    clearFeedback();
    feedbackEl.className = "feedback feedback--wrong";
    feedbackEl.textContent = `⏭ Skipped! Answer was ${gameState.currentWord.word}.`;

    setTimeout(() => {
      lockGame(false);
      nextRound();
    }, 1200);
  }

  function submitAnswer() {
    if (gameState.isLocked) return;
    if (!gameState.currentWord) return;

    const answer = inputEl.value.trim().toUpperCase();
    if (!answer) {
      setFeedbackWrong();
      inputEl.classList.remove("shake");
      inputEl.offsetHeight; // restart animation
      inputEl.classList.add("shake");
      setTimeout(() => inputEl.classList.remove("shake"), 500);
      return;
    }

    const isCorrect = answer === gameState.currentWord.word;
    if (isCorrect) {
      lockGame(true);
      const beforeScore = gameState.score;
      const points = gameState.hintUsed ? 5 : 10;

      gameState.score += points;
      gameState.streak += 1;
      gameState.correctCount += 1;

      setFeedbackCorrect(points);
      streakValueEl.textContent = String(gameState.streak);

      const from = beforeScore;
      const to = gameState.score;
      countUpInt(scoreValueEl, from, to);

      scrambledWordEl.classList.remove("bounce");
      scrambledWordEl.offsetHeight; // restart animation
      scrambledWordEl.classList.add("bounce");

      setTimeout(() => {
        lockGame(false);
        nextRound();
      }, 900);
      return;
    }

    // Wrong
    gameState.streak = 0;
    streakValueEl.textContent = "0";
    setFeedbackWrong();

    inputEl.classList.remove("shake");
    inputEl.offsetHeight; // restart
    inputEl.classList.add("shake");
    setTimeout(() => inputEl.classList.remove("shake"), 500);

    inputEl.value = "";
    inputEl.focus();
  }

  function updateLeaderboard(entry) {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    let list = [];
    try {
      list = raw ? JSON.parse(raw) : [];
    } catch {
      list = [];
    }

    list.push(entry);
    list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // earlier date wins ties (stable-ish)
      return String(a.date).localeCompare(String(b.date));
    });

    list = list.slice(0, 5);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
  }

  function renderLeaderboard() {
    const tbody = document.getElementById("leaderboardBody");
    if (!tbody) return;

    const raw = localStorage.getItem(LEADERBOARD_KEY);
    let list = [];
    try {
      list = raw ? JSON.parse(raw) : [];
    } catch {
      list = [];
    }

    tbody.innerHTML = "";
    if (!list.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.className = "leaderboard-empty";
      td.textContent = "Play once to set the leaderboard.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    list.forEach((item, idx) => {
      const tr = document.createElement("tr");

      const tdRank = document.createElement("td");
      tdRank.textContent = String(idx + 1);

      const tdName = document.createElement("td");
      tdName.textContent = item.name;

      const tdScore = document.createElement("td");
      tdScore.textContent = String(item.score);

      const tdDate = document.createElement("td");
      const d = new Date(item.date);
      tdDate.textContent = Number.isNaN(d.getTime()) ? item.date : d.toLocaleDateString();

      tr.appendChild(tdRank);
      tr.appendChild(tdName);
      tr.appendChild(tdScore);
      tr.appendChild(tdDate);

      tbody.appendChild(tr);
    });
  }

  function showGameOver() {
    lockGame(true);
    if (gameCard) gameCard.style.display = "none";

    const score = gameState.score;
    const correct = gameState.correctCount;
    const total = gameState.totalRounds;

    if (modalSummary) {
      modalSummary.textContent = `You finished ${correct}/${total} correct rounds.`;
    }
    finalScoreEl.textContent = String(score);
    finalCorrectEl.textContent = `${correct}/${total}`;

    if (modalOverlay) modalOverlay.classList.add("is-open");
    if (playerNameEl) {
      playerNameEl.value = "";
      playerNameEl.focus();
    }
    if (saveNoteEl) saveNoteEl.textContent = "";
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove("is-open");
    if (gameCard) gameCard.style.display = "";
  }

  function initGame() {
    gameState = {
      round: 0,
      score: 0,
      streak: 0,
      totalRounds: 10,
      hintUsed: false,
      currentWord: null,
      shuffledDeck: shuffleArray(wordBank).slice(0, 10),
      correctCount: 0,
      isLocked: false
    };

    // UI reset
    if (modalOverlay) modalOverlay.classList.remove("is-open");
    if (gameCard) gameCard.style.display = "";

    scoreValueEl.textContent = "0";
    roundValueEl.textContent = `1/10`;
    streakValueEl.textContent = "0";
    progressFill.style.width = "0%";
    if (progressText) progressText.textContent = "Round 1 of 10";

    loadRound();
  }

  hintBtn.addEventListener("click", showHint);
  skipBtn.addEventListener("click", skipWord);
  submitBtn.addEventListener("click", submitAnswer);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAnswer();
    }
  });

  // Modal: save score + play again
  saveScoreBtn.addEventListener("click", () => {
    const rawName = (playerNameEl.value || "").trim();
    const name = rawName ? rawName.slice(0, 20) : "Anonymous";

    const entry = {
      name,
      score: gameState.score,
      date: new Date().toISOString()
    };
    updateLeaderboard(entry);
    renderLeaderboard();

    if (saveNoteEl) saveNoteEl.textContent = `Saved! ${name}, your score is ${gameState.score}.`;
  });

  playAgainBtn.addEventListener("click", () => {
    closeModal();
    initGame();
  });

  // Initialize first leaderboard + first round
  renderLeaderboard();
  initGame();
}

document.addEventListener("DOMContentLoaded", () => {
  initLeaderboardUI();
  setupNav();
  setupGame();
});

