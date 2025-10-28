// Copy CA function
document.getElementById("copyHeader").addEventListener("click", () => {
  navigator.clipboard.writeText("5H1jkA7erRxwD8uqH8KimMD74ctjUYBd32rbp2jubonk");
  alert("CA copied to clipboard!");
});

// Expand / Collapse "How to Buy"
const expandBtn = document.getElementById("expandBtn");
const instructions = document.getElementById("instructions");

expandBtn.addEventListener("click", () => {
  if (instructions.style.display === "block") {
    instructions.style.display = "none";
    expandBtn.textContent = "How to Buy ▼";
  } else {
    instructions.style.display = "block";
    expandBtn.textContent = "Hide ▲";
  }
});

// FAQ Toggle
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((q) => {
  q.addEventListener("click", () => {
    const answer = q.nextElementSibling;
    if (answer.style.display === "block") {
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }
  });
});
