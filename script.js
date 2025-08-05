document.addEventListener('DOMContentLoaded', function() {

    // --- Feather Icons ---
    feather.replace();

    // --- Typewriter Effect ---
    const headline = document.getElementById('hero-headline');
    if (headline) {
        const text = headline.innerText;
        headline.innerText = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                headline.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 70);
            }
        }
        typeWriter();
    }
    
    // --- Scroll Animations ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('is-visible');
    }

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } 
            // Optional: uncomment below to hide element when scrolling up
            // else {
            //     hideScrollElement(el);
            // }
        })
    }

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Trigger on load
    handleScrollAnimation();

    // --- AI Chatbot ---
    const chatBubble = document.getElementById('chat-bubble');
    const chatWidget = document.getElementById('chat-widget');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    let conversationHistory = [];

    const systemPrompt = {
        role: "system",
        content: `U bent een vriendelijke en professionele AI-assistent voor YFZA Agency.
YFZA Agency is gespecialiseerd in het bouwen van AI-ondersteunde websites, intelligente landingspagina's en aangepaste AI-integraties.
Uw doel is om vragen van bezoekers te beantwoorden over onze diensten en hen aan te moedigen contact op te nemen voor een project.
Geef duidelijke en beknopte antwoorden in het Nederlands.
Als u het antwoord niet weet of als de gebruiker een project wil starten, verwijs dan de gebruiker door naar het e-mailadres contact@yfza.agency of de WhatsApp-knop op de pagina.`
    };

    conversationHistory.push(systemPrompt);
    
    const addMessage = (sender, text) => {
        // Remove typing indicator if it exists
        const typingIndicator = chatMessages.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
    };

    const showTypingIndicator = () => {
        addMessage('bot', 'Aan het typen...');
        chatMessages.lastChild.classList.add('typing');
    };
    
    const toggleChatWidget = () => {
        chatWidget.classList.toggle('open');
        chatBubble.style.display = chatWidget.classList.contains('open') ? 'none' : 'flex';
        
        // Add initial message if it's the first time opening
        if (chatWidget.classList.contains('open') && chatMessages.children.length === 0) {
            setTimeout(() => {
                addMessage('bot', 'Hallo! Ik ben de AI-assistent van YFZA Agency. Hoe kan ik u helpen?');
            }, 300);
        }
    };

    chatBubble.addEventListener('click', toggleChatWidget);
    chatClose.addEventListener('click', toggleChatWidget);
    
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessage('user', userMessage);
        chatInput.value = '';

        conversationHistory.push({ role: 'user', content: userMessage });
        
        showTypingIndicator();
        
        try {
            const completion = await websim.chat.completions.create({
                messages: conversationHistory,
            });
            
            const botResponse = completion.content;
            addMessage('bot', botResponse);
            conversationHistory.push(completion); // Add the full response object
            
            // Keep history short to manage token usage
            if(conversationHistory.length > 10) {
                 conversationHistory = [systemPrompt, ...conversationHistory.slice(-9)];
            }

        } catch (error) {
            console.error('Error with AI Chat:', error);
            addMessage('bot', 'Sorry, er is iets misgegaan. Probeer het later opnieuw.');
        }
    });
});