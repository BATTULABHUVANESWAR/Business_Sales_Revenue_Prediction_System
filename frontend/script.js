const form = document.getElementById("predictionForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                test: "connection"
            })
        });

        const result = await response.json();

        document.getElementById("predictionValue").textContent =
            result.prediction;

        document.getElementById("resultMessage").textContent =
            result.message;

        document.getElementById("result").scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);

        document.getElementById("resultMessage").textContent =
            "Backend connection failed. Please start Flask server.";
    }
});