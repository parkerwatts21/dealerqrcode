(function initContentScript() {
  console.log("[DealerQR] Content script loaded");
  let widgetContainer = null;
  let popupContainer = null;
  let isWidgetInitialized = false;
  const injectStyles = () => {
    try {
      console.log("[DealerQR] Attempting to inject styles");
      const existingStyle = document.getElementById("dealerqrcode-styles");
      if (existingStyle) {
        console.log("[DealerQR] Styles already exist");
        return;
      }
      const styleSheet = document.createElement("style");
      styleSheet.id = "dealerqrcode-styles";
      styleSheet.textContent = `
        #dealerqrcode-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 28px;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 2147483647;
          transition: all 0.2s ease;
          border: none;
          outline: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 24px;
        }
        
        #dealerqrcode-button::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          border-radius: 31px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        #dealerqrcode-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        
        #dealerqrcode-button:hover::before {
          opacity: 1;
        }
        
        #dealerqrcode-button.dragging {
          cursor: grabbing;
          transform: scale(1.1);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        
        #dealerqrcode-button svg {
          width: 28px;
          height: 28px;
          fill: currentColor;
        }

        #dealerqrcode-popup {
          position: absolute;
          bottom: calc(100% + 16px);
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 800px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          z-index: 2147483646;
          display: none;
          overflow: hidden;
        }

        #dealerqrcode-popup::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          background: white;
          transform-origin: center;
          transform: translateX(-50%) rotate(45deg);
          box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
          z-index: -1;
        }

        #dealerqrcode-popup iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .dealerqrcode-wrapper {
          position: fixed;
          z-index: 2147483647;
        }
      `;
      document.head.appendChild(styleSheet);
      console.log("[DealerQR] Styles injected successfully");
    } catch (error) {
      console.error("[DealerQR] Failed to inject styles:", error);
    }
  };
  const createWidget = () => {
    try {
      console.log("[DealerQR] Creating widget");
      const existingWidget = document.getElementById("dealerqrcode-wrapper");
      if (existingWidget) {
        console.log("[DealerQR] Widget already exists");
        widgetContainer = existingWidget.querySelector("#dealerqrcode-button");
        popupContainer = existingWidget.querySelector("#dealerqrcode-popup");
        return;
      }
      const wrapper = document.createElement("div");
      wrapper.className = "dealerqrcode-wrapper";
      wrapper.style.bottom = "24px";
      wrapper.style.right = "24px";
      widgetContainer = document.createElement("div");
      widgetContainer.id = "dealerqrcode-button";
      widgetContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v3h-2v-3h-3v-2h3v-3h2v3h3zm-3 7h6v2h-6z"/>
        </svg>
      `;
      popupContainer = document.createElement("div");
      popupContainer.id = "dealerqrcode-popup";
      const iframe = document.createElement("iframe");
      iframe.src = chrome.runtime.getURL("popup.html");
      popupContainer.appendChild(iframe);
      wrapper.appendChild(widgetContainer);
      wrapper.appendChild(popupContainer);
      let isDragging = false;
      let startX;
      let startY;
      let initialLeft;
      let initialTop;
      const onMouseDown = (e) => {
        isDragging = true;
        widgetContainer == null ? void 0 : widgetContainer.classList.add("dragging");
        startX = e.clientX;
        startY = e.clientY;
        const rect = wrapper.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        e.preventDefault();
      };
      const onMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;
        const maxX = window.innerWidth - wrapper.offsetWidth;
        const maxY = window.innerHeight - wrapper.offsetHeight;
        newLeft = Math.min(Math.max(0, newLeft), maxX);
        newTop = Math.min(Math.max(0, newTop), maxY);
        wrapper.style.left = `${newLeft}px`;
        wrapper.style.top = `${newTop}px`;
      };
      const onMouseUp = () => {
        isDragging = false;
        widgetContainer == null ? void 0 : widgetContainer.classList.remove("dragging");
      };
      widgetContainer == null ? void 0 : widgetContainer.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      let clickStartTime;
      widgetContainer == null ? void 0 : widgetContainer.addEventListener("mousedown", () => {
        clickStartTime = Date.now();
      });
      widgetContainer == null ? void 0 : widgetContainer.addEventListener("mouseup", () => {
        const clickDuration = Date.now() - clickStartTime;
        if (clickDuration < 200 && !isDragging && popupContainer) {
          const isVisible = popupContainer.style.display === "block";
          popupContainer.style.display = isVisible ? "none" : "block";
        }
      });
      const styles = document.createElement("style");
      styles.textContent = `
        .dealerqrcode-wrapper {
          position: fixed;
          z-index: 2147483647;
          transition: none;
          touch-action: none;
          user-select: none;
        }
        
        #dealerqrcode-button {
          cursor: grab;
        }
        
        #dealerqrcode-button.dragging {
          cursor: grabbing;
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
      `;
      document.head.appendChild(styles);
      if (!wrapper.style.left && !wrapper.style.top) {
        wrapper.style.right = "24px";
        wrapper.style.bottom = "24px";
      }
      document.body.appendChild(wrapper);
      console.log("[DealerQR] Widget created and added to page");
    } catch (error) {
      console.error("[DealerQR] Failed to create widget:", error);
    }
  };
  const initWidget = () => {
    try {
      console.log("[DealerQR] Initializing widget");
      if (!isWidgetInitialized) {
        injectStyles();
        createWidget();
        isWidgetInitialized = true;
      }
      if (widgetContainer) {
        widgetContainer.style.display = "flex";
        console.log("[DealerQR] Widget displayed");
      }
    } catch (error) {
      console.error("[DealerQR] Failed to initialize widget:", error);
    }
  };
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log("[DealerQR] Message received:", message);
    try {
      if (message.action === "ping") {
        console.log("[DealerQR] Ping received");
        sendResponse({ status: "alive" });
        return true;
      }
      if (message.action === "toggleWidget") {
        console.log("[DealerQR] Toggle widget requested");
        if (!isWidgetInitialized) {
          initWidget();
        } else if (widgetContainer) {
          widgetContainer.style.display = widgetContainer.style.display === "none" ? "flex" : "none";
          if (popupContainer) {
            popupContainer.style.display = "none";
          }
          console.log("[DealerQR] Widget visibility toggled to:", widgetContainer.style.display);
        }
        sendResponse({ success: true });
        return true;
      }
    } catch (error) {
      console.error("[DealerQR] Error handling message:", error);
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred"
      });
      return true;
    }
  });
  console.log("[DealerQR] Content script initialization complete");
})();
//# sourceMappingURL=contentScript.js.map
