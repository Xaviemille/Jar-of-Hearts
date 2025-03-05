document.getElementById("messageForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const message = document.getElementById("messageInput").value;
    const author = document.getElementById("authorInput").value || "Anonymous";

    if (!message.trim()) {
        alert("Please enter a message.");
        return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbxu8adlb0iz94Tyx3Ya81rVrKH_NG_xhw13L8SZFmg1O4719e5p6dUU1qTSG0YSWhFG/exec"; // 🔹 Replace this with your actual Web App URL

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

    const scriptURL = "https://script.google.com/macros/s/AKfycbxu8adlb0iz94Tyx3Ya81rVrKH_NG_xhw13L8SZFmg1O4719e5p6dUU1qTSG0YSWhFG/exec"; // 🔹 Replace this with your actual Web App URL

    fetch(scriptURL)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(messages => {
            messagesContainer.innerHTML = ""; // Clear loading text

            if (messages.length === 0) {
                messagesContainer.innerHTML = "<p>No messages yet.</p>";
                return;
            }

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
