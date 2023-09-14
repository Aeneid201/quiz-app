"use strict";

// DOM
const choose__form = document.querySelector(".choose");
const quiz__section = document.querySelector(".quiz");

choose__form.addEventListener("submit", function (e) {
  e.preventDefault();

  let inputs = this.elements;
  let category = inputs[0];
  let difficulty = inputs[1];
  let type = inputs[2];
  this.classList.add("d-none");
  renderQuiz(category.value, difficulty.value, type.value);
});

function renderQuiz(category, difficulty, type) {
  fetchQuiz(category, difficulty, type).then(function (data) {
    let count = 0;
    renderQuestion(data.results[count], count);

    document.addEventListener("click", function (e) {
      let choices = document.querySelectorAll(".choice");
      let el = e.target;
      count++;
      if (el.classList.contains("choice")) {
        let correct_answer = data.results[count]["correct_answer"];
        if (el.textContent === correct_answer) {
          el.classList.add("correct");
        } else {
          el.classList.add("wrong");
        }

        setTimeout(() => {
          quiz__section.innerHTML = "";
          renderQuestion(data.results[count], count);
        }, 3000);
      } else {
        return;
      }
    });
  });
}

async function fetchQuiz(category = "", difficulty = "", type = "") {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`
    );

    return response.json();
  } catch (err) {
    console.error(err.message);
  }
}

function renderQuestion(obj, id) {
  let choices = shuffle(obj["incorrect_answers"].concat(obj["correct_answer"]));
  let html = `<div data-id="${id}" class="card">
    <div class="question">${obj["question"]}</div>
    <div class="choices">`;
  for (const choice of choices) {
    html += `<div class="choice">${choice}</div>`;
  }
  html += `</div></div>`;
  quiz__section.insertAdjacentHTML("beforeend", html);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
