function getDomainFromUrl(url) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return "";
    }
  }
  
  function renderList() {
    const listEl = document.getElementById("list");
    const whitelist = JSON.parse(localStorage.getItem("whitelist") || "[]");
  
    listEl.innerHTML = "";
    whitelist.forEach((domain, index) => {
      const li = document.createElement("li");
      li.textContent = domain;
  
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "X";
      removeBtn.onclick = () => {
        whitelist.splice(index, 1);
        localStorage.setItem("whitelist", JSON.stringify(whitelist));
        renderList();
      };
  
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });
  }
  
  document.getElementById("add").onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      const currentDomain = getDomainFromUrl(currentUrl);
      let whitelist = JSON.parse(localStorage.getItem("whitelist") || "[]");
  
      if (!whitelist.includes(currentDomain)) {
        whitelist.push(currentDomain);
        localStorage.setItem("whitelist", JSON.stringify(whitelist));
        renderList();
      }
    });
  };
  
  renderList();
  