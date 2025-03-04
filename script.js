document.addEventListener('DOMContentLoaded', loadMessages);

function submitMessage() {
    const message = document.getElementById("messageInput").value;
    const author = document.getElementById("authorInput").value || "Anonymous";

    if (!message.trim()) {
        alert("Please enter a message.");
        return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbxxpNlbm1r-LolWyG2YajDwJaoo1MuRNR6E09DtllFIqH8Y6fE9V3sKuZ1VGEDWFbH5/exec"; // Replace this

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
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error!", error);
        alert("There was an error submitting your message. Please check the console.");
    });
}


function loadMessages() {
    const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj09nAVTJGfEdy3Ao563cgex8G8ETZXf6GpJOwfmCes8VshtIwrEaZVpaA5kqzXlUHJcYIlNbwSZl9/pubhtml';
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = '';
    
    fetch(sheetURL)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1);
            rows.forEach(row => {
                const [timestamp, message, author] = row.split(',');
                if (message) {
                    const card = document.createElement('div');
                    card.className = 'message-card';
                    card.innerHTML = `
                        <div class="message-content">"${message.trim()}"</div>
                        <div class="message-author">- ${author ? author.trim() : 'Anonymous'}</div>
                        <div class="share-buttons">
                            <button onclick="shareMessage('${message.trim()}')">Share</button>
                        </div>
                    `;
                    messageContainer.appendChild(card);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function shareMessage(message) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(message);
    const shareURL = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareURL, '_blank');
}
