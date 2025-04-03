(function () {
    // Tạo nút Hello
    const button = document.createElement("button");
    button.textContent = "Hello";
    Object.assign(button.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "9999",
      padding: "10px 15px",
      background: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
    });
  
    document.body.appendChild(button);
  
    // Tạo box chat
    let chatBox = null;
  
    button.onclick = () => {
      if (chatBox) {
        // Toggle hiện / ẩn
        chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
        return;
      }
  
      chatBox = document.createElement("div");
      Object.assign(chatBox.style, {
        position: "fixed",
        bottom: "70px",
        right: "20px",
        width: "300px",
        height: "400px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: "9999",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif"
      });
  
      const messagesContainer = document.createElement("div");
      Object.assign(messagesContainer.style, {
        flex: "1",
        padding: "10px",
        overflowY: "auto",
        fontSize: "14px"
      });
  
      const inputContainer = document.createElement("div");
      Object.assign(inputContainer.style, {
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #ddd"
      });
  
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Nhập tin nhắn...";
      Object.assign(input.style, {
        flex: "1",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginRight: "5px"
      });
  
      const sendButton = document.createElement("button");
      sendButton.textContent = "Gửi";
      Object.assign(sendButton.style, {
        padding: "8px 10px",
        background: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      });
  
      inputContainer.appendChild(input);
      inputContainer.appendChild(sendButton);
      chatBox.appendChild(messagesContainer);
      chatBox.appendChild(inputContainer);
      document.body.appendChild(chatBox);
  
      // Hàm hiển thị tin nhắn
      const addMessage = (text, isUser) => {
        const msg = document.createElement("div");
        msg.textContent = text;
        Object.assign(msg.style, {
          marginBottom: "8px",
          padding: "6px 10px",
          borderRadius: "8px",
          background: isUser ? "#DCF8C6" : "#f1f1f1",
          alignSelf: isUser ? "flex-end" : "flex-start",
          maxWidth: "80%"
        });
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      };
  
      // Hàm phản hồi giả lập
      const fakeResponse = (userMsg) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(`Bot: Bạn vừa nói "${userMsg}" phải không? 😄`);
          }, 1000);
        });
      };
  
      // Gửi tin nhắn
      sendButton.onclick = async () => {
        const msg = input.value.trim();
        if (!msg) return;
        addMessage(msg, true);
        input.value = "";
  
        const response = await fakeResponse(msg);
        addMessage(response, false);
      };
  
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendButton.click();
      });
    };
  })();