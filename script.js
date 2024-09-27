// Steps

/*

1. Create a function called readJSONFile that takes one parameter “url” which will
be the path to the questions.json file.This function should return a JSON object.

2. Create a function called getRandomQuestions that takes two parameters “type”
eg: html, css, js, or all and “num” which is the total number of questions that
should be returned.This function when called, should call readJSONFile and
manipulate the response to get the type(html, css, js, or all) and the number of
questions and return the randomly selected questions as an object.

3. Set questions limit to 5 minimum and 25 maximum.

4. A time limit should be set for each quiz based on the number of questions.Each
question should be 1 minute max.Eg: if there are 10 questions, the quiz time
should be 10 minutes.

5. Create a function called displayQuestions that takes one parameter “questions”.
The questions object generated from getRandomQuestions should be passed as
    an argument when calling displayQuestions.

6.Display the user’s score at the end of the game showing all the correct and wrong
answers.For the incorrect answers, show what the correct answer is.

6.Users should be able to select the type of questions they want(only HTML, CSS,
    JS, or All) and the number of questions between 5 and 25.

7.Divide 100 by the total number of questions to determine the weight of each
question.

*/

// Testing connection
// alert(`Connection established!`)

//Get refrence to HTML elements
let gameTitle = document.querySelector('#heading'),
    playBtn = document.querySelector('#playBtn'),
    infoText = document.querySelector('.info-text'),
    categorySection = document.querySelector('#category'),
    categories = document.querySelectorAll('#category button'),
    gameHeader = document.querySelector('.header-elements'),
    logo = document.querySelector('.exercise-icon'),
    headerContainer = document.querySelector('.heading-container'),
    questionContainer = document.querySelector('.questions-container'),
    mainQuestionContainer = document.querySelector('#main-question-tag'),
    questionOptions = document.querySelector('.options'),
    backBtn = document.querySelector('.back'),
    // questionCounting = document.querySelector('.counting'),
    timerDisplay = document.querySelector('.count-down');
// resetBtn = document.querySelector('.next'); // Reference to the reset button; // Add a timer display

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer; // Timer variable
let timeLimit = 60; // 1 minute per question
let timeLeft


// Function to fetch JSON data
async function readJSONFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching JSON data: ${error}`);
        return null;
    }
}

// Function to get random questions based on type and number
async function getRandomQuestions(type, num) {
    const data = await readJSONFile('./questions.json'); // Path to our JSON file
    if (!data) {
        return [];//return empty array if file not found
    }

    let questions = [];

    if (type === 'all') {

        Object.values(data).forEach(category => {
            questions = questions.concat(Object.values(category));
        });

    } else if (data[type]) {
        questions = Object.values(data[type]);
    }

    questions = questions.sort(() => 0.5 - Math.random()).slice(0, num);
    return questions;
}

// Function to start the quiz
function startQuiz(questions) {

    currentQuestions = questions;
    currentQuestionIndex = 0;
    score = 0;
    timeLimit = questions.length * 1; // 1 minute per question

    startTimer();
    displayQuestion();
}

// Function to display the current question
function displayQuestion() {

    if (currentQuestionIndex < currentQuestions.length) {

        const question = currentQuestions[currentQuestionIndex];

        mainQuestionContainer.innerHTML = `<h6>${question.question}</h6>`;
        questionOptions.innerHTML = ''; // Clearing previous options

        const unOrderedList = document.createElement('ul');

        Object.entries(question.choices).forEach(([key, choice]) => {

            const listItem = document.createElement('li');

            listItem.textContent = choice;
            listItem.classList.add('li-bg');
            unOrderedList.appendChild(listItem);

            // Add event listener for each li click
            listItem.addEventListener('click', () => {
                selectAnswer(key); // Answer validation function

                // Disable further clicks after one is made
                unOrderedList.querySelectorAll('li').forEach(li => {
                    li.style.pointerEvents = 'none'; // Disable all options after selection
                });

                // Check if the answer is correct or wrong
                if (key === question.correctAnswer) {
                    listItem.classList.remove('li-bg');
                    listItem.classList.add('success'); // Apply success class for right answer
                } else {
                    listItem.classList.remove('li-bg');
                    listItem.classList.add('danger'); // Apply danger class for wrong answer

                    // Optionally highlight the correct answer
                    unOrderedList.querySelectorAll('li').forEach(li => {
                        if (li.textContent === question.choices[question.correctAnswer]) {
                            li.classList.remove('li-bg');
                            li.classList.add('success'); // Show the correct answer
                        }
                    });
                }

                console.log('The answer is: ', key);
            });
        });

        questionOptions.appendChild(unOrderedList); // Append the entire ul after all listItems are added

    } else {
        endQuiz(); // When all questions are done
        // timerDisplay.innerText = `: 0`;
    }


}

// Function to handle answer selection
function selectAnswer(selected) {
    const correctAnswer = currentQuestions[currentQuestionIndex].correctAnswer;
    if (selected === correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    displayQuestion();
}

// Function to start the timer
function startTimer() {

    timerDisplay.textContent = timeLimit;
    timer = setInterval(() => {
        timeLimit--;

        timerDisplay.textContent = timeLimit;

        if (timeLimit <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 60000); // Decrement timer every minute
}

// Function to end the quiz and show results
function endQuiz() {
    clearInterval(timer);

    if (timeLeft < 1) {
        timerDisplay.innerText = `: 0`;
    }

    // Display score and reset UI
    questionContainer.style.display = 'none';
    infoText.textContent = `Your score: ${score} out of ${currentQuestions.length}`;
    infoText.style.display = 'block';
    playBtn.innerText = 'Play Again?'
    playBtn.style.display = 'block';
    questionCounting.classList.remove('showBtn');


    playBtn.addEventListener('click', () => {
        console.log('Play again button has been clicked');

        if (playBtn.textContent === 'Play Again?') {

            console.log('True')
            timerDisplay.innerText = `: 0`;

            gameTitle.innerHTML = `<h6>Choose Category</h6>`;
            console.log(gameTitle)
            infoText.style.display = 'none';
            playBtn.style.display = 'none';
            logo.style.display = 'none';
            questionContainer.style.display = 'none';
            categorySection.style.display = 'flex';
            // backBtn.classList.add('showBtn');
            questionCounting.classList.remove('showBtn');

        } else {
            return false;
        }
    })
}

// Event listener for Play button
playBtn.addEventListener('click', () => {
    sectionOne(); // Show categories
});

// Loop over categories and add click events
categories.forEach((categoryOption, index) => {
    categoryOption.addEventListener('click', async () => {

        gameHeader.style.display = 'flex';
        headerContainer.style.display = 'none';
        questionContainer.style.display = 'flex';
        categorySection.style.display = 'none';
        backBtn.classList.remove('showBtn');
        questionCounting.classList.add('showBtn');

        let categoryType = ['all', 'css', 'html', 'js'][index];
        const questions = await getRandomQuestions(categoryType, 10); // Change number of questions as needed
        startQuiz(questions);
    });
});

// Function to hide the initial section
function sectionOne() {

    gameTitle.innerHTML = `<h6>Choose Category</h6>`;
    infoText.style.display = 'none';
    playBtn.style.display = 'none';
    logo.style.display = 'none';
    questionContainer.style.display = 'none';
    categorySection.style.display = 'flex';
    // backBtn.classList.add('showBtn');

}

// Back button functionality
backBtn.addEventListener('click', () => {

    gameTitle.innerHTML = `<h6> Quiz App </h6>`;
    infoText.style.display = 'flex';
    playBtn.style.display = 'flex';
    logo.style.display = 'flex';
    questionContainer.style.display = 'none';
    categorySection.style.display = 'none';
    backBtn.classList.remove('showBtn');

});


function startTimer() {

    timeLeft = timeLimit;

    timer = setInterval(() => {

        if (timeLeft < 1) {

            // alert("Time's up!");

            // Show user score 
            endQuiz()
            clearInterval(timer);

        } else {

            timerDisplay.innerText = `: ${timeLeft} min`;
            timeLeft--;
        }

    }, 2000);
}


// Reset button functionality
// resetBtn.addEventListener('click', () => {
//     resetBtn.style.display = 'flex'; // Hide the reset button
//     infoText.style.display = 'none'; // Hide score info
//     categorySection.style.display = 'flex'; // Show category selection
// })
