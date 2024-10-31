document.addEventListener('DOMContentLoaded', () => {
    const dino = document.querySelector('.dino');
    const grid = document.querySelector('.grid');
    const alert = document.getElementById('alert');
    const desert = document.getElementById('desert');
    const gameOver = document.querySelector('.gameOver');
    const gravity = 0.9;
    let isJumping = false;
    let isGameOver = false;
    function control(e) {
        if (e.code === "Space") {
            if (!isJumping) {
                jump();
            }
        }
    }

    document.addEventListener('keydown', control);

    let position = 0;
    function jump() {
        isJumping = true;
        let count = 0;
        let timerId = setInterval(() => {
            //move down
            if (count === 15) {
                clearInterval(timerId);
                let downTimerId = setInterval(() => {
                    if (count === 0) {
                        clearInterval(downTimerId);
                        isJumping = false;
                    }
                    position -= 5;
                    count--;
                    position *= gravity;
                    dino.style.bottom = position + 'px';
                }, 20)
            }
            //move up
            position += 30;
            count++;
            position *= gravity;
            dino.style.bottom = position + 'px';

        }, 20)
    }

    let score = 0;
    let scoreInterval;

    function startScoreCounter() {
        // Clear any previous score interval if it exists
        clearInterval(scoreInterval);

        // Update score every 100ms we can also adjust frequency as needed
        scoreInterval = setInterval(() => {
            if (!isGameOver) {
                score += 1;
                alert.innerHTML = "Score: " + score;
            } else {
                clearInterval(scoreInterval); // Stop score if game is over
            }
        }, 100); // we can Adjust this interval for faster or slower scoring
    }


    function generateHurdles() {
        if (isGameOver) return; // Stop creating hurdles if the game is over

        let hurdlePosition = 1000;
        const hurdle = document.createElement('div');
        hurdle.classList.add('hurdle');
        grid.appendChild(hurdle);
        hurdle.style.left = hurdlePosition + 'px';

        let timerId = setInterval(() => {
            if (hurdlePosition > 0 && hurdlePosition < 90 && position < 90) {
                clearInterval(timerId);
                gameOver.style.display = "block";
                gameOver.style.margin = "auto";
                isGameOver = true;
                desert.style.animation = "none";
                alert.style.color = "red";
                // Stop score counter
                clearInterval(scoreInterval);

                // Removing all children
                while (grid.firstChild) {
                    grid.removeChild(grid.firstChild);
                }
                return;
            }

            // Move the hurdle to the left
            hurdlePosition -= 10;
            hurdle.style.left = hurdlePosition + 'px';

            // Remove hurdle if it goes out of view
            if (hurdlePosition < -50) {
                clearInterval(timerId);
                grid.removeChild(hurdle);
            }
        }, 20);

        // Schedule the next hurdle creation if the game is still active
        if (!isGameOver) {
            setTimeout(generateHurdles, Math.random() * 4000);
        }
    }

    // Start the score counter and generate hurdles when the game begins
    startScoreCounter();
    generateHurdles();

})