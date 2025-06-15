Gemini-Powered Chatbot 💬

A fully functional chatbot built using HTML, CSS, JavaScript (Vanilla JS) with a secure Express.js backend, powered by Google Gemini API. Supports both text and image inputs with contextual conversation memory.

🚀 Features

✅ Real-time chat interface (like ChatGPT)

🧠 Context-aware conversation (remembers past messages)

🖼️ Image input support (base64 image + text prompt)

🔒 Gemini API key secured using .env file

📦 Hosted locally via Express server (server.js)

📁 Clean folder structure (/public for frontend)

🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js + Express.js

AI: Gemini 2.0 Flash API (via Google AI Studio)

Hosting (optional): Vercel or Render (if deployed)

📂 Folder Structure

chatbot/
│
├── public/ # All frontend files (HTML, CSS, JS)
│ ├── index.html
│ ├── style.css
│ └── app.js
│
├── server.js # Express backend that connects to Gemini
├── .env # API Key (not committed to GitHub)
├── .gitignore
├── package.json
└── README.md

⚙️ How to Run Locally

Clone the repo:

git clone https://github.com/your-username/chatbot.git
cd chatbot

Install dependencies:

npm install

Create a .env file in root:

API_KEY=your_gemini_api_key

Start the server:

node server.js

Visit:

http://localhost:3000
