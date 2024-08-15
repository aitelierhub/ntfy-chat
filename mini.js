!(function () {
    // Chat configuration default parameters
    const chatParams = {
        username: "guest",   // default username
        room: "default-room", // default room
        title: "Chat Room"   // default title
    };

    // Main wrapper logic for the chat-room component
    const ATTRIBUTE_KEYS = {
        USERNAME: "username",
        ROOM: "room",
        TITLE: "title",
        HEIGHT: "height",
        WIDTH: "width",
        COLOR_MODE: "color-mode",
    };

    const OBSERVED_ATTRIBUTES = Object.values(ATTRIBUTE_KEYS);

    class ChatRoom extends HTMLElement {
        static get observedAttributes() {
            return OBSERVED_ATTRIBUTES;
        }

        constructor() {
            super();
            this.iframe = document.createElement("iframe");
            this.iframe.style.border = "none";
            this.iframe.style.display = "none"; // Ensure iframe is hidden until chat bubble is clicked
        }

        get username() {
            return this.getAttribute(ATTRIBUTE_KEYS.USERNAME) || chatParams.username;
        }

        get room() {
            return this.getAttribute(ATTRIBUTE_KEYS.ROOM) || chatParams.room;
        }

        get title() {
            return this.getAttribute(ATTRIBUTE_KEYS.TITLE) || chatParams.title;
        }

        get chatUrl() {
            const baseUrl = "https://aitelierhub.github.io/ntfy-chat/";
            const params = new URLSearchParams({
                username: this.username,
                room: this.room,
                title: this.title,
            });

            return `${baseUrl}?${params.toString()}`;
        }

        updateIframeAttributes() {
            this.iframe.src = this.chatUrl;

            const height = this.getAttribute(ATTRIBUTE_KEYS.HEIGHT) || "500px";
            const width = this.getAttribute(ATTRIBUTE_KEYS.WIDTH) || "100%";
            this.iframe.style.height = height;
            this.iframe.style.width = width;
        }

        connectedCallback() {
            this.attachShadow({ mode: "open" }).appendChild(this.iframe);
            this.updateIframeAttributes();
        }

        disconnectedCallback() {}

        attributeChangedCallback() {
            this.updateIframeAttributes();
        }
    }

    window.customElements.define("chat-room", ChatRoom);

    // Function to dynamically create the chat bubble and overlay
    function createChatElements() {
        // Create chat bubble
        const chatBubble = document.createElement('div');
        chatBubble.classList.add('chat-bubble');
        chatBubble.innerHTML = `<img src="https://cdn.icon-icons.com/icons2/806/PNG/512/chat-44_icon-icons.com_65944.png" alt="Chat">`;
        document.body.appendChild(chatBubble);

        // Create chat overlay (initially hidden)
        const chatOverlay = document.createElement('div');
        chatOverlay.classList.add('chat-overlay');
        chatOverlay.style.display = "none"; // Ensure the overlay is hidden initially
        chatOverlay.innerHTML = `
            <div class="chat-container">
                <button class="close-chat">×</button>
                <chat-room username="${chatParams.username}" room="${chatParams.room}" title="${chatParams.title}"></chat-room>
            </div>`;
        document.body.appendChild(chatOverlay);

        // Add event listeners for chat bubble and close button
        chatBubble.addEventListener('click', () => {
            chatOverlay.style.display = 'flex';
            const iframe = chatOverlay.querySelector('iframe');
            iframe.style.display = 'block'; // Show the iframe once the chat opens
        });

        const closeButton = chatOverlay.querySelector('.close-chat');
        closeButton.addEventListener('click', () => {
            chatOverlay.style.display = 'none';
        });
    }

    // Inject styles for chat bubble and overlay
    function injectStyles() {
        const styles = `
            /* Chat Bubble */
            .chat-bubble {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background-color: #ff5722;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                z-index: 1000;
            }
            .chat-bubble img {
                width: 30px;
                height: 30px;
            }
            /* Chat Overlay */
            .chat-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 999;
            }
            .chat-container {
                position: relative;
                width: 90%;
                height: 80%;
                max-width: 500px;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
            }
            /* Close Button */
            .close-chat {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: transparent;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #ff5722;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // Wait for DOMContentLoaded to inject the chat elements
    window.addEventListener('DOMContentLoaded', () => {
        // Inject chat bubble, overlay, and custom element
        createChatElements();
        injectStyles();
    });

    // Allow dynamic configuration via parameters passed to the script (optional)
    // Example: <script src="embed.js" data-username="jack" data-room="myuniqueroomid100" data-title="Room 100"></script>
    const scriptTag = document.currentScript;
    if (scriptTag) {
        chatParams.username = scriptTag.getAttribute('data-username') || chatParams.username;
        chatParams.room = scriptTag.getAttribute('data-room') || chatParams.room;
        chatParams.title = scriptTag.getAttribute('data-title') || chatParams.title;
    }
})();
