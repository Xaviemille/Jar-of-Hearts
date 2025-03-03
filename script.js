document.addEventListener('DOMContentLoaded', loadMessages);

function submitMessage() {
    const message = document.getElementById('messageInput').value;
    const author = document.getElementById('authorInput').value || 'Anonymous';

    if (!message.trim()) {
        alert("Please enter a message.");
        return;
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwphJ-LTAde4lg15RBo5-lEGXmSymdGApmXhGBz4Q1CIdZuZ1NosIlrh8bBBQay660DhA/exec'; // Replace this
    const formData = { message, author };

    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json()) // Parse JSON correctly
    .then(data => {
        if (data.status === "Success") {
            alert("Message submitted successfully!");
            document.getElementById('messageInput').value = '';
            document.getElementById('authorInput').value = '';
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error!', error);
        alert("There was an error submitting your message.");
    });
}



function loadMessages() {
    const sheetURL = 'https://dochttps://docs.google.com/spreadsheets/d/e/2PACX-1vTIE0fatBnUXUO6kO4O4z2lW3jy3YNwsLbCHmlF6YCNAajztEG7r7g4LLiHmJoH_7qXOrhBcrYzfBwW/pubhtmlhttps://docs.google.com/spreadsheets/d/e/2PACX-1vTIE0fatBnUXUO6kO4O4z2lW3jy3YNwsLbCHmlF6YCNAajztEG7r7g4LLiHmJoH_7qXOrhBcrYzfBwW/pubhtmls.google.com/spreadsheets/d/e/2PACX-1vQHUSmyhSiUU7YitaZoEcfePDFEHMJC1IlFX_kKziQpGog0MHKmFMGn5LggcXT40xCk_fYo8BGOGCQj/pubhtmlSHEET_URL';
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
