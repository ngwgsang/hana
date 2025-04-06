(function () {
  let chatBox = null;
  let activeTab = "Trích xuất";

  const toggleChatBox = () => {
    if (chatBox) {
      chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
      return;
    }

    chatBox = document.createElement("div");
    Object.assign(chatBox.style, {
      position: "fixed",
      bottom: "70px",
      right: "20px",
      width: "350px",
      height: "450px",
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

    const tabs = ["Trích xuất", "Đọc hiểu"];
    let messagesData = JSON.parse(localStorage.getItem("chat_history") || "{}");
    if (!messagesData[activeTab]) messagesData[activeTab] = [];

    const tabContainer = document.createElement("div");
    Object.assign(tabContainer.style, {
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #ddd",
      background: "#f1f1f1"
    });

    const tabGroup = document.createElement("div");
    Object.assign(tabGroup.style, {
      display: "flex",
      flex: "1"
    });

    tabs.forEach(tab => {
      const tabBtn = document.createElement("div");
      tabBtn.textContent = tab;
      tabBtn.dataset.tab = tab;
      Object.assign(tabBtn.style, {
        padding: "10px 15px",
        cursor: "pointer",
        flex: "1",
        textAlign: "center",
        fontWeight: "bold",
        borderBottom: tab === activeTab ? "3px solid #4CAF50" : "none"
      });

      tabBtn.onclick = () => {
        activeTab = tab;
        [...tabGroup.children].forEach(child => {
          child.style.borderBottom = "none";
        });
        tabBtn.style.borderBottom = "3px solid #4CAF50";

        if (!messagesData[activeTab]) messagesData[activeTab] = [];
        renderMessages();
        renderFooter();
      };

      tabGroup.appendChild(tabBtn);
    });

    const clearBtn = document.createElement("div");
    clearBtn.textContent = "🔄️";
    clearBtn.title = "Xoá lịch sử tab hiện tại";
    Object.assign(clearBtn.style, {
      padding: "10px",
      cursor: "pointer",
      fontSize: "18px",
      userSelect: "none"
    });

    clearBtn.onclick = () => {
      if (confirm(`Bạn có chắc muốn xoá toàn bộ lịch sử của tab "${activeTab}" không?`)) {
        messagesData[activeTab] = [];
        saveHistory();
        renderMessages();
      }
    };

    tabContainer.appendChild(tabGroup);
    tabContainer.appendChild(clearBtn);

    const messagesContainer = document.createElement("div");
    Object.assign(messagesContainer.style, {
      flex: "1",
      padding: "10px",
      overflowY: "auto",
      fontSize: "14px",
      display: "flex",
      flexDirection: "column"
    });

    const footerContainer = document.createElement("div");

    chatBox.appendChild(tabContainer);
    chatBox.appendChild(messagesContainer);
    chatBox.appendChild(footerContainer);
    document.body.appendChild(chatBox);

    const saveHistory = () => {
      localStorage.setItem("chat_history", JSON.stringify(messagesData));
    };

    const renderMessageItem = (msg, index) => {
      const { text, sender, type = "text", meta = {} } = msg;
      const msgWrapper = document.createElement("div");
      msgWrapper.dataset.index = index;
      msgWrapper.style.position = "relative";

      const msgDiv = document.createElement("div");
      msgDiv.textContent = text;
      Object.assign(msgDiv.style, {
        marginBottom: "8px",
        padding: "6px 10px",
        borderRadius: "8px",
        background: sender === "user" ? "#DCF8C6" : "#f1f1f1",
        alignSelf: sender === "user" ? "flex-end" : "flex-start",
        maxWidth: "80%",
        whiteSpace: "pre-wrap"
      });
      msgWrapper.appendChild(msgDiv);

      if (type === "flashcard") {
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "📝 copy";
        Object.assign(saveBtn.style, {
          marginTop: "5px",
          alignSelf: "flex-start",
          padding: "6px 10px",
          fontSize: "13px",
          background: "#FF9800",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        });

        saveBtn.onclick = () => {
          navigator.clipboard.writeText(meta.front + "\n" + meta.back);
          saveHistory();
          renderMessages();
        };

        const deleteBtn = document.createElement("div");
        deleteBtn.textContent = "❌";
        Object.assign(deleteBtn.style, {
          position: "absolute",
          top: "0px",
          right: "0px",
          padding: "4px",
          cursor: "pointer",
          fontSize: "14px",
          color: "#999"
        });

        deleteBtn.onclick = () => {
          messagesData[activeTab].splice(index, 1);
          saveHistory();
          renderMessages();
        };

        msgWrapper.appendChild(saveBtn);
        msgWrapper.appendChild(deleteBtn);
      }

      messagesContainer.appendChild(msgWrapper);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const addNewMessage = (text, sender, type = "text", meta = {}) => {
      const msg = { text, sender, type, meta };
      messagesData[activeTab].push(msg);
      saveHistory();
      renderMessages();
    };

    const renderMessages = () => {
      messagesContainer.innerHTML = "";
      messagesData[activeTab].forEach((msg, index) => renderMessageItem(msg, index));
    };

    const agentAction = async (msg) => {
      const endpoint = 'https://hana-x.vercel.app/agentAction';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: msg })
      });
      const data = await response.json();
      return data.response;
    };

    const exportCSV = () => {
      const rows = messagesData["Trích xuất"]
        .filter(m => m.type === "flashcard")
        .map(m => [m.meta.front, m.meta.back]);
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "front,back\n" + rows.map(r => r.map(x => '"' + x.replace(/"/g, '""') + '"').join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "flashcards.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const renderFooter = () => {
      footerContainer.innerHTML = "";
      if (activeTab === "Trích xuất") {
        const extractBtn = document.createElement("button");
        extractBtn.textContent = "Tạo thẻ";
        Object.assign(extractBtn.style, {
          width: "100%",
          padding: "10px",
          background: "#2196F3",
          color: "#fff",
          border: "none",
          borderTop: "1px solid #ddd",
          cursor: "pointer",
          fontWeight: "bold"
        });

        extractBtn.onclick = () => {
          const front = document.querySelector(".main-word")?.innerText?.trim();
          let means = [];
          document.querySelectorAll(".mean-word").forEach(e => means.push(e.innerText));
          const back = (document.querySelector(".phonetic-word")?.innerText?.trim() || "") + "\n" + means.join("\n");

          if (!front || !back.trim()) {
            addNewMessage("❌ Trích xuất không thành công", "bot");
            return;
          }

          const exists = messagesData["Trích xuất"].some(m => m.type === "flashcard" && m.meta.front === front);
          if (exists) {
            alert("⚠️ Thẻ đã tồn tại, không thể thêm lại.");
            return;
          }

          const cardContent = `📘 Flashcard:\nFront: ${front}\nBack: ${back}`;
          addNewMessage(cardContent, "bot", "flashcard", { front, back });
        };

        const exportBtn = document.createElement("button");
        exportBtn.textContent = "📤 Xuất CSV";
        Object.assign(exportBtn.style, {
          width: "100%",
          padding: "10px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderTop: "1px solid #ddd",
          cursor: "pointer",
          fontWeight: "bold"
        });
        exportBtn.onclick = exportCSV;

        footerContainer.appendChild(extractBtn);
        footerContainer.appendChild(exportBtn);
      } else {
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
        footerContainer.appendChild(inputContainer);

        sendButton.onclick = async () => {
          const msg = input.value.trim();
          if (!msg) return;
          input.value = "";
          addNewMessage(msg, "user");
          const res = await agentAction(msg);
          addNewMessage(res, "bot");
        };

        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") sendButton.click();
        });
      }
    };

    renderMessages();
    renderFooter();
  };

  // Bắt phím tắt Ctrl + Space để mở/ẩn chatbox
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.code === "Space") {
      e.preventDefault();
      toggleChatBox();
    }
  });
})();
