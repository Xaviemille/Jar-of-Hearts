document.getElementById("messageForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const message = document.getElementById("messageInput").value;
    const author = document.getElementById("authorInput").value || "Anonymous";

    if (!message.trim()) {
        alert("Please enter a message.");
        return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbyvH2zj8iqw6Zel1TZoKHViKHray6NXqY3H1IvW3PknVd1ezUD4sTgipe8llkyEwAF_/exec"; // Replace with your actual /exec URL

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
        console.error("Error submitting message:", error);
        alert("There was an error submitting your message. Please check the console.");
    });
});

function fetchMessages() {
    const messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.innerHTML = "<p>Loading messages...</p>";

    const scriptURL = "https://script.google.com/macros/s/AKfycbyvH2zj8iqw6Zel1TZoKHViKHray6NXqY3H1IvW3PknVd1ezUD4sTgipe8llkyEwAF_/exec"; // Replace with your actual /exec URL

    fetch(scriptURL)
        .then(response => response.json())
        .then(messages => {
            messagesContainer.innerHTML = ""; // Clear loading text

            if (messages.length === 0) {
                messagesContainer.innerHTML = "<p>No messages yet.</p>";
                return;
            }

            messages.forEach((msg, index) => {
                const messageCard = document.createElement("div");
                messageCard.classList.add("message-card");
                messageCard.innerHTML = `
                    <p><strong>${msg.author}</strong> says:</p>
                    <p>"${msg.message}"</p>
                    <p class="date">${new Date(msg.date).toLocaleString()}</p>
                    <button class="like-button" onclick="likeMessage(${index + 2})">❤️ ${msg.likes}</button>
                `;
                messagesContainer.appendChild(messageCard);
            });
        })
        .catch(error => {
            console.error("Error fetching messages:", error);
            messagesContainer.innerHTML = "<p>Failed to load messages.</p>";
        });
}

function likeMessage(row) {
    const scriptURL = "https://script.google.com/macros/s/AKfycbyvH2zj8iqw6Zel1TZoKHViKHray6NXqY3H1IvW3PknVd1ezUD4sTgipe8llkyEwAF_/exec"; // Replace with your actual /exec URL

    fetch(scriptURL + "?action=like&row=" + row, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.querySelector(`[data-row='${row}'] .like-button`).innerHTML = `❤️ ${data.likes}`;
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error liking message:", error);
    });
}


// Load messages when the page loads
window.onload = fetchMessages;
