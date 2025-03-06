document.getElementById("messageForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const lastSubmitTime = localStorage.getItem("lastSubmitTime");
    const currentTime = Date.now();
    
    if (lastSubmitTime && (currentTime - lastSubmitTime) < 5000) { // 5 seconds cooldown
        alert("Please wait a few seconds before submitting another message.");
        return;
    }

    const message = document.getElementById("messageInput").value;
    const author = document.getElementById("authorInput").value || "Anonymous";

    if (!message.trim()) {
        alert("Please enter a message.");
        return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbx4QxfJrK2kPYmagGfBeQOEho0PJoPNjgRC4lpFhcZwcKtR-bGndOZUdJGzWdebzzqy/exec"; // Replace with your actual /exec URL

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
            localStorage.setItem("lastSubmitTime", Date.now()); // Save the time of submission
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
    const userMessagesContainer = document.getElementById("userMessagesContainer");

    messagesContainer.innerHTML = "<p>Loading messages...</p>";
    userMessagesContainer.innerHTML = "";

    const scriptURL = "https://script.google.com/macros/s/AKfycbx4QxfJrK2kPYmagGfBeQOEho0PJoPNjgRC4lpFhcZwcKtR-bGndOZUdJGzWdebzzqy/exec"; // Replace with your actual Web App URL

    fetch(scriptURL)
        .then(response => response.json())
        .then(messages => {
            messagesContainer.innerHTML = "";
            userMessagesContainer.innerHTML = "";

            if (messages.length === 0) {
                messagesContainer.innerHTML = "<p>No messages yet.</p>";
                return;
            }

            messages.forEach((msg, index) => {
                const rowIndex = index + 2;

                const messageCard = document.createElement("div");
                messageCard.classList.add("message-card");
                messageCard.setAttribute("data-row", rowIndex);
                messageCard.innerHTML = `
                    <p><strong>${msg.author}</strong> says:</p>
                    <p>"${msg.message}"</p>
                    <p class="date">${new Date(msg.date).toLocaleString()}</p>
                    <button class="like-button" onclick="likeMessage(${rowIndex})">❤️ ${msg.likes}</button>
                `;
                messagesContainer.appendChild(messageCard);
            });
        })
        .catch(error => {
            console.error("Error fetching messages:", error);
            messagesContainer.innerHTML = "<p>Failed to load messages.</p>";
        });
}

function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";
}

window.onload = () => {
    showSection('home'); // Show home by default
    fetchMessages();
};
