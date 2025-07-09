const startBtn = document.getElementById('startBtn');
const reactionSection = document.getElementById('reactionSection');
const reactionBox = document.getElementById('reactionBox');
const instruction = document.getElementById('instruction');
const quizSection = document.getElementById('quizSection');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const submitAnswer = document.getElementById('submitAnswer');
const timerEl = document.getElementById('timer');
const resultSection = document.getElementById('resultSection');
const result = document.getElementById('result');
const stats = document.getElementById('stats');
const quoteEl = document.getElementById('quote');
const themeToggle = document.getElementById('themeToggle');

let reactionStart, reactionEnd, reactionTime;
let timer, timeLeft;

const questions = [
  { q: 'What is 12 + 7?', a: '19' },
  { q: 'What is the capital of France?', a: 'paris' },
  { q: '5 * 6 = ?', a: '30' },
  { q: 'What color do you get by mixing red and blue?', a: 'purple' },
  { q: 'What is the opposite of "cold"?', a: 'hot' }
];

const quotes = [
  'Push yourself, because no one else is going to do it for you.',
  'Success is not for the lazy.',
  'The harder you work for something, the greater you’ll feel when you achieve it.',
  'Don’t stop when you’re tired. Stop when you’re done.',
  'Great things never come from comfort zones.'
];

window.onload = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteEl.textContent = quote;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
};

themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', mode);
};

startBtn.onclick = () => {
  startBtn.classList.add('hidden');
  reactionSection.classList.remove('hidden');
  instruction.textContent = 'Wait for green...';
  reactionBox.style.backgroundColor = 'red';

  const delay = Math.random() * 2000 + 2000;
  setTimeout(() => {
    reactionBox.style.backgroundColor = 'green';
    instruction.textContent = 'CLICK NOW!';
    reactionStart = performance.now();

    reactionBox.onclick = () => {
      reactionEnd = performance.now();
      reactionTime = Math.floor(reactionEnd - reactionStart);
      showQuiz();
    };
  }, delay);
};

function showQuiz() {
  reactionSection.classList.add('hidden');
  quizSection.classList.remove('hidden');

  const randomQ = questions[Math.floor(Math.random() * questions.length)];
  questionEl.textContent = randomQ.q;
  answerEl.value = '';

  timeLeft = Math.max(5, Math.floor(700 - reactionTime) / 100);
  timerEl.textContent = `Time: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      evaluateAnswer(randomQ);
    }
  }, 1000);

  submitAnswer.onclick = () => {
    clearInterval(timer);
    evaluateAnswer(randomQ);
  };
}

function evaluateAnswer(q) {
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');

  const correct = answerEl.value.trim().toLowerCase() === q.a;
  const score = correct ? 10000 - reactionTime : 5000 - reactionTime;
  result.textContent = `Your reaction time was ${reactionTime}ms.\nHey!! answer was ${correct ? 'correct' : 'wrong'}.\nYour Brain Reflex Score: ${score}`;

  const prevBest = localStorage.getItem('bestScore') || 0;
  if (score > prevBest) {
    localStorage.setItem('bestScore', score);
    stats.textContent = `🎉 New High Score! (${score})`;
  } else {
    stats.textContent = `Your best score so far: ${prevBest}`;
  }
  localStorage.setItem('lastScore', score);
}