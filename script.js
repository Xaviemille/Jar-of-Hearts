document.getElementById("messageForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const message = document.getElementById("messageInput").value;
    const author = document.getElementById("authorInput").value || "Anonymous";

    if (!message.trim()) {
        alert("Please enter a message.");
        return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbyJdUhGryio7v4bVwe5wYfMz2PBN5tKz8aDEF8r68NDee_nwGG6tCudxlUaC74vg7zx/exec"; // Replace with your /exec URL

    const formData = new URLSearchParams();
    formData.append("Message", message);
    formData.append("Author", author);

    fetch(scriptURL, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            alert("Message submitted successfully!");
            document.getElementById("messageInput").value = "";
            document.getElementById("authorInput").value = "";
            fetchMessages(); // Reload messages after submission
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error!", error);
        alert("There was an error submitting your message. Please check the console.");
    });
});

function fetchMessages() {
    const messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.innerHTML = "<p>Loading messages...</p>";

    const scriptURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTj09nAVTJGfEdy3Ao563cgex8G8ETZXf6GpJOwfmCes8VshtIwrEaZVpaA5kqzXlUHJcYIlNbwSZl9/pubhtml"; // Replace with your /exec URL

    fetch(scriptURL)
        .then(response => response.json())
        .then(messages => {
            messagesContainer.innerHTML = ""; // Clear loading text

            messages.forEach(msg => {
                const messageCard = document.createElement("div");
                messageCard.classList.add("message-card");
                messageCard.innerHTML = `
                    <p><strong>${msg.author}</strong> says:</p>
                    <p>"${msg.message}"</p>
                    <p class="date">${new Date(msg.date).toLocaleString()}</p>
                `;
                messagesContainer.appendChild(messageCard);
            });
        })
        .catch(error => {
            console.error("Error fetching messages:", error);
            messagesContainer.innerHTML = "<p>Failed to load messages.</p>";
        });
}

// Load messages when the page loads
window.onload = fetchMessages;
