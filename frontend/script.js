document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("predictionForm");

    const predictionValue =
        document.getElementById("predictionValue");

    const resultMessage =
        document.getElementById("resultMessage");

    const resultSection =
        document.getElementById("result");


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const button =
            document.querySelector(".forecast-button");

        const originalButtonText =
            button.innerHTML;


        // -----------------------------
        // GET FORM VALUES
        // -----------------------------

        const data = {

            store:
                document.getElementById("store").value,

            department:
                document.getElementById("dept").value,

            prediction_date:
                document.getElementById("prediction_date").value,

            holiday:
                document.getElementById("holiday").value,

            markdown1:
                document.getElementById("markdown1").value || 0,

            markdown2:
                document.getElementById("markdown2").value || 0,

            markdown3:
                document.getElementById("markdown3").value || 0,

            markdown4:
                document.getElementById("markdown4").value || 0,

            markdown5:
                document.getElementById("markdown5").value || 0

        };


        // -----------------------------
        // BUTTON LOADING
        // -----------------------------

        button.disabled = true;

        button.innerHTML =
            "Generating Forecast...";


        try {

            const response = await fetch(
                "/api/predict",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


            const result =
                await response.json();


            // -----------------------------
            // SUCCESS
            // -----------------------------

            if (result.success) {

                const prediction =
                    Number(result.prediction);


                predictionValue.textContent =
                    prediction.toLocaleString(
                        "en-IN",
                        {
                            maximumFractionDigits: 2
                        }
                    );


                resultMessage.textContent =
                    "Forecast generated successfully for the selected business period.";


                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


            } else {

                alert(
                    result.message ||
                    "Unable to generate forecast."
                );

            }


        } catch (error) {

            console.error(
                "Prediction Error:",
                error
            );


            alert(
                "Unable to connect to the prediction server."
            );

        }


        // -----------------------------
        // RESTORE BUTTON
        // -----------------------------

        button.disabled = false;

        button.innerHTML =
            originalButtonText;

    });

});