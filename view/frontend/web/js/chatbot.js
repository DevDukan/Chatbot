(function() {
    const root = document.getElementById('godukkan-chatbot-root');
    if (!root) return;

    // Create chatbox container
    const box = document.createElement('div');
    box.className = 'godukkan-chatbot-box';
    box.innerHTML = `
        <div class="godukkan-chatbot-header">Godukkan Chatbot</div>
        <div class="godukkan-chatbot-messages" id="godukkan-chatbot-messages"></div>
        <form class="godukkan-chatbot-input" id="godukkan-chatbot-input-form" autocomplete="off">
            <input type="text" id="godukkan-chatbot-input" placeholder="Type your message..." autocomplete="off" />
            <button type="submit">Send</button>
        </form>
    `;
    root.appendChild(box);

    const messagesEl = document.getElementById('godukkan-chatbot-messages');
    const inputForm = document.getElementById('godukkan-chatbot-input-form');
    const inputEl = document.getElementById('godukkan-chatbot-input');

    // Conversation state
    let state = 'greeting';
    let userName = '';
    let refundData = {};
    let productSearch = {};
    let userEmail = '';
    let lastBotMsg = '';

    // Generate or get session ID
    function getSessionId() {
        let sid = sessionStorage.getItem('godukkan_chatbot_session');
        if (!sid) {
            sid = 'sess_' + Math.random().toString(36).substr(2, 10) + Date.now();
            sessionStorage.setItem('godukkan_chatbot_session', sid);
        }
        return sid;
    }

    // Log message to backend
    function logMessage(message, sender) {
        const payload = {
            session_id: getSessionId(),
            user_name: userName,
            user_email: userEmail,
            message: message,
            sender: sender
        };
        fetch('/chatbot/index/log', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: Object.keys(payload).map(k => encodeURIComponent(k)+'='+encodeURIComponent(payload[k]||'')).join('&')
        });
    }

    // Helper: get greeting
    function getGreeting() {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 18) return 'Good Afternoon';
        return 'Good Evening';
    }

    // Helper: add message
    function addMessage(text, sender = 'bot') {
        const msg = document.createElement('div');
        msg.className = 'godukkan-chatbot-message ' + sender;
        msg.innerHTML = `<div class="godukkan-chatbot-bubble">${text}</div>`;
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        logMessage(text, sender);
    }

    // Helper: add options
    function addOptions(options) {
        const optDiv = document.createElement('div');
        optDiv.className = 'godukkan-chatbot-options';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'godukkan-chatbot-option-btn';
            btn.textContent = opt.label;
            btn.onclick = () => {
                optDiv.remove();
                handleUserInput(opt.value, true);
            };
            optDiv.appendChild(btn);
        });
        messagesEl.appendChild(optDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Conversation logic
    function handleUserInput(input, isOption = false) {
        if (!isOption) addMessage(input, 'user');
        switch(state) {
            case 'greeting':
                setTimeout(() => {
                    addMessage(`Hello, ${getGreeting()}!`);
                    setTimeout(() => {
                        addMessage('How may I call you?');
                        state = 'ask_name';
                    }, 700);
                }, 300);
                state = 'wait_greeting';
                break;
            case 'ask_name':
                userName = input.trim();
                if (!userName) {
                    addMessage('Please enter your name.');
                    break;
                }
                addMessage(`Nice to meet you, ${userName}!`);
                setTimeout(() => {
                    addMessage('How may I help you?');
                    addOptions([
                        {label: 'Refund', value: 'refund'},
                        {label: 'Looking for product', value: 'product'},
                        {label: 'Chat with agent', value: 'agent'}
                    ]);
                    state = 'main_menu';
                }, 700);
                state = 'wait_main_menu';
                break;
            case 'main_menu':
                if (input === 'refund') {
                    addMessage('Let me help you with a refund.');
                    setTimeout(() => {
                        addMessage('Enter Product Name:');
                        state = 'refund_product_name';
                    }, 500);
                } else if (input === 'product') {
                    addMessage('Looking for a product? I can help!');
                    setTimeout(() => {
                        addMessage('What are you looking for?');
                        state = 'product_what';
                    }, 500);
                } else if (input === 'agent') {
                    addMessage('Connecting you to a live agent.');
                    setTimeout(() => {
                        addMessage('Before that, may I have your email?');
                        state = 'agent_email';
                    }, 500);
                } else {
                    addMessage('Please select an option.');
                }
                break;
            // Refund flow
            case 'refund_product_name':
                refundData.productName = input;
                addMessage('Enter Product SKU:');
                state = 'refund_sku';
                break;
            case 'refund_sku':
                refundData.sku = input;
                addMessage('Enter Purchase Date (YYYY-MM-DD):');
                state = 'refund_date';
                break;
            case 'refund_date':
                refundData.date = input;
                addMessage('Enter your email:');
                state = 'refund_email';
                break;
            case 'refund_email':
                refundData.email = input;
                addMessage('Thank you! Connecting you to a live agent...');
                // TODO: Integrate with live chat
                state = 'done';
                break;
            // Product search flow
            case 'product_what':
                productSearch.query = input;
                addMessage('What is your budget?');
                state = 'product_budget';
                break;
            case 'product_budget':
                productSearch.budget = input;
                addMessage('Fetching suggestions...');
                // TODO: AJAX to backend for category/product suggestion
                setTimeout(() => {
                    // Stub: show categories
                    addMessage('Please select a category:');
                    addOptions([
                        {label: 'Television', value: 'cat_tv'},
                        {label: 'Mobile', value: 'cat_mobile'},
                        {label: 'Laptop', value: 'cat_laptop'}
                    ]);
                    state = 'product_category';
                }, 1000);
                state = 'wait_category';
                break;
            case 'product_category':
                productSearch.category = input;
                addMessage('Please select a subcategory:');
                // Stub: show subcategories
                addOptions([
                    {label: 'LED', value: 'sub_led'},
                    {label: 'OLED', value: 'sub_oled'}
                ]);
                state = 'product_subcategory';
                break;
            case 'product_subcategory':
                productSearch.subcategory = input;
                addMessage('Here are some products:');
                // Stub: show product cards
                showProductCards([
                    {name: 'Super TV 55"', price: '$499', img: '', sku: 'TV-001'},
                    {name: 'Ultra TV 65"', price: '$799', img: '', sku: 'TV-002'}
                ]);
                state = 'done';
                break;
            // Agent flow
            case 'agent_email':
                userEmail = input;
                addMessage('Thank you! Connecting you to a live agent...');
                // TODO: Integrate with live chat
                state = 'done';
                break;
            case 'done':
                addMessage('Is there anything else I can help you with?');
                setTimeout(() => {
                    addOptions([
                        {label: 'Refund', value: 'refund'},
                        {label: 'Looking for product', value: 'product'},
                        {label: 'Chat with agent', value: 'agent'}
                    ]);
                    state = 'main_menu';
                }, 700);
                state = 'wait_main_menu';
                break;
            default:
                addMessage('Sorry, I did not understand that.');
        }
    }

    // Show product cards
    function showProductCards(products) {
        const wrap = document.createElement('div');
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.gap = '12px';
        products.forEach(p => {
            const card = document.createElement('div');
            card.style.background = '#fff';
            card.style.border = '1px solid #e3eafc';
            card.style.borderRadius = '8px';
            card.style.padding = '12px';
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.innerHTML = `
                <div style="flex:1">
                    <div style="font-weight:bold;">${p.name}</div>
                    <div>SKU: ${p.sku}</div>
                    <div style="color:#1a73e8; font-weight:bold;">${p.price}</div>
                </div>
            `;
            wrap.appendChild(card);
        });
        messagesEl.appendChild(wrap);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Form submit
    inputForm.onsubmit = function(e) {
        e.preventDefault();
        const val = inputEl.value.trim();
        if (!val) return;
        logMessage(val, 'user');
        handleUserInput(val);
        inputEl.value = '';
    };

    // Option click disables input
    function disableInput(disabled) {
        inputEl.disabled = disabled;
        inputForm.querySelector('button').disabled = disabled;
    }

    // Start conversation
    handleUserInput('');
})(); 