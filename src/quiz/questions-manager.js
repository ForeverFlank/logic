import { Quiz } from "./quizzes-manager.js";

function selectChoice(num) {
    let indicatorContainer = document.getElementById("learn-question-indicator");
    let indicator = indicatorContainer.querySelector("[question='" + num + "'");
    indicator.classList.remove("bg-zinc-300");
    indicator.classList.add("bg-yellow-400");
}

async function loadQuestions(obj) {
    let container = document.getElementById("learn-question-container");
    let fieldset = document.getElementById("learn-question-fieldset");
    let radio = document.getElementById("learn-question-radio");

    let indicatorContainer = document.getElementById("learn-question-indicator");
    let indicator = document.getElementById("learn-question-indicator-template");
    console.log(obj)
    for (let i = 0, len = obj.questions.length; i < len; ++i) {
        let question = obj.questions[i];
        let newDiv = fieldset.content.children[0].cloneNode(true);
        newDiv.classList.remove("hidden");
        newDiv.children[0].children[0].innerHTML = (i + 1) + ".&ensp;"
        newDiv.children[0].children[1].innerText = question.question;
        if (question.src) {
            newDiv.children[1].setAttribute("src", "./quizzes/" + obj.id + "/" + question.src);
        }
        // newDiv.children[1] = ...
        for (let j = 0, len = question.answers.length; j < len; ++j) {
            const answer = question.answers[j];
            let newRadio = radio.content.children[0].cloneNode(true);
            newRadio.children[0].setAttribute("name", "question-" + (i + 1))
            newRadio.children[0].setAttribute("value", (j).toString());
            newRadio.children[1].innerText = answer;
            newDiv.appendChild(newRadio);
        }
        container.appendChild(newDiv);

        newDiv.addEventListener("input", () => selectChoice((i + 1)));

        let newIndicator = indicator.content.children[0].cloneNode();
        newIndicator.setAttribute("question", (i + 1).toString())
        indicatorContainer.appendChild(newIndicator);
    }
}

document.getElementById("learn-quiz-submit").addEventListener("click", () => checkAnswers());

document.getElementById("learn-quiz-back").addEventListener("click", () => {
    document.getElementById("learn-question-container").replaceChildren();
    document.getElementById("learn-question-indicator").replaceChildren();
    let menuDiv = document.getElementById("learn-menu-container");
    let quizDiv = document.getElementById("learn-quiz-container");
    menuDiv.style.display = "flex";
    quizDiv.style.display = "none";
    Quiz.activeQuiz = null;
});

function checkAnswers() {
    let quiz = Quiz.activeQuiz;
    let fieldsets = document.getElementById("learn-quiz-container").getElementsByTagName("fieldset");
    let indicators = document.getElementById("learn-question-indicator").getElementsByTagName("div");
    for (let i = 0, len = fieldsets.length; i < len; ++i) {
        fieldsets[i].disabled = true;
        let answerDivs = fieldsets[i].getElementsByTagName("label");
        let selectedRadio = fieldsets[i].querySelector("input:checked");
        let selectedAnswer = -1;
        let correctAnswer = quiz.questions[i].correctAnswer;
        if (selectedRadio) {
            selectedAnswer = parseInt(selectedRadio.getAttribute("value"));
        }
        
        if (selectedAnswer != correctAnswer) {
            if (selectedAnswer != -1) {
                answerDivs[selectedAnswer].children[1].innerHTML += "  &cross;"
                answerDivs[selectedAnswer].children[1].classList.add("text-red-500");
                indicators[i].classList.replace("bg-yellow-400", 'bg-red-500');
            } else {
                indicators[i].classList.replace("bg-zinc-300", 'bg-red-500');
            }
        } else {
            indicators[i].classList.replace("bg-yellow-400", 'bg-green-500');
        }
        answerDivs[correctAnswer].children[1].innerHTML += "  &check;"
        answerDivs[correctAnswer].children[1].classList.add("text-green-500");
    }
}

export { loadQuestions }