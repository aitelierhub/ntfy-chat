!(function () {
    const chatParams = {
        username: "guest",
        room: "default-room",
        title: "Chat Room"
    };

    const ATTRIBUTE_KEYS = {
        USERNAME: "username",
        ROOM: "room",
        TITLE: "title",
        HEIGHT: "height",
        WIDTH: "width"
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
            this.iframe.style.display = "block";
            this.iframe.style.width = "100%";
            this.iframe.style.height = "100%";
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

    function createChatElements() {
        const chatBubble = document.createElement('div');
        chatBubble.classList.add('chat-bubble');
        chatBubble.innerHTML = `<img src="https://img.icons8.com/ios-filled/50/ffffff/speech-bubble.png" alt="Chat">`;
        document.body.appendChild(chatBubble);

        const chatOverlay = document.createElement('div');
        chatOverlay.classList.add('chat-overlay');
        chatOverlay.style.display = "none";
        chatOverlay.innerHTML = `
            <div class="chat-container">
                <button class="close-chat">×</button>
                <chat-room username="${chatParams.username}" room="${chatParams.room}" title="${chatParams.title}"></chat-room>
            </div>`;
        document.body.appendChild(chatOverlay);

        const iframe = chatOverlay.querySelector('iframe');
        if (iframe) {
            iframe.style.display = 'block';
        }

        chatBubble.addEventListener('click', () => {
            chatOverlay.style.display = 'flex';
        });

        const closeButton = chatOverlay.querySelector('.close-chat');
        closeButton.addEventListener('click', () => {
            chatOverlay.style.display = 'none';
        });
    }

    function injectStyles() {
        const styles = `
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
            .chat-overlay {
                position: fixed;
                bottom: 0;
                right: 0;
                width: 350px;
                height: 500px;
                background-color: rgba(0, 0, 0, 0.6);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 999;
                padding: 10px;
                box-sizing: border-box;
                border-radius: 10px;
                overflow: hidden;
            }
            .chat-container {
                position: relative;
                width: 100%;
                height: 100%;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
            }
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

    window.addEventListener('DOMContentLoaded', () => {
        createChatElements();
        injectStyles();
    });

    const scriptTag = document.currentScript;
    if (scriptTag) {
        chatParams.username = scriptTag.getAttribute('data-username') || chatParams.username;
        chatParams.room = scriptTag.getAttribute('data-room') || chatParams.room;
        chatParams.title = scriptTag.getAttribute('data-title') || chatParams.title;
    }
})();
