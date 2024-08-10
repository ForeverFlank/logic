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
        // newDiv.children[1] = ...
        for (let j = 0, len = question.answers.length; j < len; ++j) {
            const answer = question.answers[j];
            let newRadio = radio.content.children[0].cloneNode(true);
            newRadio.children[0].setAttribute("name", "question-" + (i + 1))
            newRadio.children[1].innerText = answer;
            newDiv.appendChild(newRadio);
        }
        container.appendChild(newDiv);

        newDiv.addEventListener("click", () => selectChoice((i + 1)));

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
});

function checkAnswers() {
    
}

export { loadQuestions }