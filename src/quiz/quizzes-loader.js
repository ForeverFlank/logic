import { loadQuestions } from "./questions-manager.js";

async function getQuizzes(src) {
    let quizzes = [];
    await fetch(src)
        .then(response => response.text())
        .then(str => {
            const rows = str.split('\n');
            for (let row of rows) {
                quizzes.push(row)
            }
        });
    return quizzes;
}

async function openQuiz(obj) {
    let menuDiv = document.getElementById("learn-menu-container");
    let quizDiv = document.getElementById("learn-quiz-container");
    menuDiv.style.display = "none";
    quizDiv.style.display = "flex";
    loadQuestions(obj);
}

async function loadQuizzes() {
    let quizzes = await getQuizzes("./quizzes/quizzes-list.txt");
    let container = document.getElementById("learn-menu-container");
    let template = document.getElementById("learn-menu-item");
    for (let i = 0, len = quizzes.length; i < len; ++i) {
        const test = quizzes[i];
        await fetch("./quizzes/" + test + "/quiz.json")
        .then(response => response.json())
        .then(data => {
            let newDiv = template.content.children[0].cloneNode(true);
            newDiv.classList.remove("hidden");
            newDiv.children[0].innerText = data.title;
            newDiv.children[1].innerText = data.description;
            newDiv.children[2].addEventListener("click", () => openQuiz(data));
            // openQuiz(data)
            // console.log(newDiv.children)
            container.appendChild(newDiv);
        });
    }
}

export { loadQuizzes }