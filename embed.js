!(function () {
    // Constants for attributes
    const ATTRIBUTE_KEYS = {
        USERNAME: "username",
        ROOM: "room",
        TITLE: "title",
        HEIGHT: "height",
        WIDTH: "width",
        COLOR_MODE: "color-mode",  // Optional future use
    };

    // List of standard attributes we will observe for changes
    const OBSERVED_ATTRIBUTES = Object.values(ATTRIBUTE_KEYS);

    // Custom ChatRoom Web Component
    class ChatRoom extends HTMLElement {
        static get observedAttributes() {
            return OBSERVED_ATTRIBUTES;
        }

        constructor() {
            super();
            this.iframe = document.createElement("iframe");
            this.iframe.style.border = "none";
        }

        // Getters for attributes
        get username() {
            return this.getAttribute(ATTRIBUTE_KEYS.USERNAME) || "guest";
        }

        get room() {
            return this.getAttribute(ATTRIBUTE_KEYS.ROOM) || "default-room";
        }

        get title() {
            return this.getAttribute(ATTRIBUTE_KEYS.TITLE) || "Chat Room";
        }

        // Construct the URL based on the parameters
        get chatUrl() {
            const baseUrl = "https://aitelierhub.github.io/ntfy-chat/";
            const params = new URLSearchParams({
                username: this.username,
                room: this.room,
                title: this.title,
            });

            return `${baseUrl}?${params.toString()}`;
        }

        // Update the iframe attributes and URL
        updateIframeAttributes() {
            this.iframe.src = this.chatUrl;

            // Optionally allow dynamic width/height configuration
            const height = this.getAttribute(ATTRIBUTE_KEYS.HEIGHT) || "500px";
            const width = this.getAttribute(ATTRIBUTE_KEYS.WIDTH) || "100%";
            this.iframe.style.height = height;
            this.iframe.style.width = width;
        }

        // Called when element is added to DOM
        connectedCallback() {
            this.attachShadow({ mode: "open" }).appendChild(this.iframe);
            this.updateIframeAttributes();
        }

        // Called when element is removed from DOM
        disconnectedCallback() {
            // Clean up if necessary
        }

        // Called when observed attributes change
        attributeChangedCallback() {
            this.updateIframeAttributes();
        }
    }

    // Register the custom element as <chat-room>
    window.customElements.define("chat-room", ChatRoom);
})();
