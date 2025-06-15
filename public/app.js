let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imgbtn = document.querySelector("#image");
let imginput = document.querySelector("#image input");
let image = document.querySelector("#image img");
let subnitbtn = document.querySelector("#submit");

const API_URL = "/api/gemini";

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null
  }
};

let conversationHistory = [];

function handleChatResponse(message) {
  user.message = message.trim();
  if (!user.message && !user.file?.data) return;

  let html = `<div class="user-chatarea">
    ${user.message}
    ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
  </div>
  <img src="user.png" alt="User" id="userimage" />`;

  prompt.value = "";

  let userChatbox = createChatbox(html, "user-chatbox");
  chatContainer.appendChild(userChatbox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    let html = `<img src="robot.png" alt="AI" id="aiimage" />
    <div class="ai-chatarea">
    <img src="load.gif" alt="" class="load" width="50px">
    </div>`;

    let aichatBox = createChatbox(html, "ai-chatbox");
    chatContainer.appendChild(aichatBox);

    generateResponse(aichatBox);
  }, 600);
}

function createChatbox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

function markdownToHtml(text) {
  text = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`(.*?)`/gim, '<code>$1</code>');

  const lines = text.split('\n');
  let insideList = false;
  let result = '';

  lines.forEach(line => {
    if (line.trim().startsWith('* ')) {
      if (!insideList) {
        result += '<ul>';
        insideList = true;
      }
      result += `<li>${line.trim().substring(2).trim()}</li>`;
    } else {
      if (insideList) {
        result += '</ul>';
        insideList = false;
      }
      result += line + '<br>';
    }
  });

  if (insideList) result += '</ul>';
  return result;
}

async function generateResponse(aichatBox) {
  let text = aichatBox.querySelector(".ai-chatarea");

  let userParts = [{ text: user.message }];
  if (user.file?.data) {
    userParts.push({ inline_data: { mime_type: user.file.mime_type, data: user.file.data } });
  }

  conversationHistory.push({
    role: "user",
    parts: userParts
  });

  let requestOptions = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: conversationHistory
    })
  };

  try {
    let response = await fetch(API_URL, requestOptions);
    let data = await response.json();

    let rawText = "Unexpected response from Gemini.";
    if (
      data?.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content?.parts?.length > 0
    ) {
      rawText = data.candidates[0].content.parts[0].text.trim();
    }

    let formattedText = markdownToHtml(rawText);
    text.innerHTML = formattedText;

    conversationHistory.push({
      role: "model",
      parts: [{ text: rawText }]
    });
  } catch (error) {
    console.log(error);
    text.innerHTML = "<i>Error fetching response</i>";
  } finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    image.src = `img.png`;
    image.classList.remove("choose");
    user.file = {};
  }
}

prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    handleChatResponse(prompt.value);
  }
});

subnitbtn.addEventListener("click", () => {
  handleChatResponse(prompt.value);
});

imginput.addEventListener("change", () => {
  const file = imginput.files[0];
  if (!file) return;

  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("Image too large. Please choose a file under 4 MB.");
    return;
  }

  let reader = new FileReader();
  reader.onload = (e) => {
    let base64string = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64string
    };

    image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    image.classList.add("choose");
  };

  reader.readAsDataURL(file);
});

imgbtn.addEventListener("click", () => {
  imgbtn.querySelector("input").click();
});
