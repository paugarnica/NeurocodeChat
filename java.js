const apiKey = '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'; // Reemplaza con tu clave
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const PREMISE = "El chatbot debe ser capaz de responder preguntas sobre conceptos básicos de programación. \
• Debe proporcionar explicaciones y ejemplos interactivos adaptados a las necesidades del estudiante. \
• El chatbot permitirá a los estudiantes realizar consultas sobre temas específicos y obtener respuestas instantáneas. \
• No responderá preguntas fuera de lugar o no relacionadas con programación.";

let conversationHistory = [
    { role: 'system', content: PREMISE }
];

function showInitialMessage() {
    const messageContainer = document.getElementById("messages");
    const initialMessage = "¡Hola! Soy un asistente experto en programación. Proporcióname tus dudas sobre código, y te ayudaré a resolverlas. 😊";
    
    const botMessageElement = document.createElement("div");
    botMessageElement.className = "message bot-message";
    botMessageElement.innerText = initialMessage;
    
    messageContainer.appendChild(botMessageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    
    conversationHistory.push({ role: 'assistant', content: initialMessage });
}

window.onload = function() {
    showInitialMessage();
};

async function getCompletion(prompt) {
    conversationHistory.push({ role: 'user', content: prompt });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
        }

        const data = await response.json();
        const botMessage = data.choices[0].message.content.trim();

        conversationHistory.push({ role: 'assistant', content: botMessage });

        return botMessage;

    } catch (error) {
        console.error('Error detallado:', error);
        throw error;
    }
}

function sendMessage() {
    const userInput = document.getElementById("userInput");
    const messageContainer = document.getElementById("messages");
    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    // Mostrar mensaje del usuario
    const userMessageElement = document.createElement("div");
    userMessageElement.className = "message user-message";
    userMessageElement.innerText = userMessage;
    messageContainer.appendChild(userMessageElement);

    // Limpiar input
    userInput.value = "";
    messageContainer.scrollTop = messageContainer.scrollHeight;

    // Indicador de escritura
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message bot-message typing";
    typingIndicator.innerText = "Escribiendo...";
    messageContainer.appendChild(typingIndicator);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    // Llamar a la API
    getCompletion(userMessage)
        .then(function(botMessage) {
            messageContainer.removeChild(typingIndicator);

            const botMessageElement = document.createElement("div");
            botMessageElement.className = "message bot-message";
            botMessageElement.innerText = botMessage;
            messageContainer.appendChild(botMessageElement);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        })
        .catch(function(error) {
            messageContainer.removeChild(typingIndicator);

            const errorMessageElement = document.createElement("div");
            errorMessageElement.className = "message bot-message";
            errorMessageElement.innerText = "Ocurrió un error: " + error.message;
            messageContainer.appendChild(errorMessageElement);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        });
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

document.getElementById("userInput").addEventListener("keypress", handleKeyPress);
