# Blogging Site with AI

A modern, full-stack blogging platform that leverages AI to supercharge content creation, engagement, and discoverability. Write, publish, manage, and share blogs seamlessly—augmented with smart AI features for compelling titles and summaries.

---

## 🚀 Features

- **AI-Powered Title Generator:** Generate SEO-friendly, engaging blog titles using OpenAI.
- **AI Blog Summaries:** Instantly create concise summaries for your posts.
- **Rich Blog CRUD:** Create, read, update, and delete blogs with images, categories, and tags.
- **User Profiles & Authentication:** Secure user accounts and personalized dashboards.
- **Like & Comment System:** Engage with posts, discuss, and interact.
- **Newsletter Subscription:** Readers can subscribe for updates.
- **Image Uploads:** Upload and manage blog thumbnails via Cloudinary.
- **Admin Dashboard:** Manage your posts and comments efficiently.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Redux, React Router)
- Tailwind CSS
- Axios
- Sonner/Toast for notifications

**Backend:**
- Node.js, Express
- MongoDB, Mongoose
- Cloudinary (images)
- OpenAI API (AI features)
- JWT Authentication

---

## 📦 Installation & Setup

1. **Clone the Repository**
    ```bash
    git clone https://github.com/pranavcherkar/blogging-site-with-AI.git
    cd blogging-site-with-ai
    ```

2. **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create a .env file with:
    # MONGO_URI=your_mongodb_uri
    # JWT_SECRET=your_jwt_secret
    # CLOUDINARY_API_KEY=your_cloudinary_key
    # CLOUDINARY_API_SECRET=your_cloudinary_secret
    npm start
    ```

3. **Setup Frontend**
    ```bash
    cd ../frontend
    cd ./blog-site
    npm install
    # Create a .env file with:
    # VITE_OPENAI_API_KEY=your_openai_key
    npm run dev
    ```

4. **Access the App**
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:8086`

---

## ✨ Usage

- **Register/Login:** Create your account to start blogging.
- **Create Blog:** Write your post, use AI to generate a catchy title and summary!
- **Add Images:** Upload a thumbnail for visual appeal.
- **Interact:** Like, comment, and subscribe to the newsletter.
- **Dashboard:** Manage your posts and see engagement stats.

---

## 🤖 AI Integration

- Powered by [OpenAI GPT](https://openai.com).
- Smart prompts ensure titles are SEO-friendly and summaries are concise.
- All AI features are securely configured with API keys via environment variables.

---

## 🧩 Project Structure

```
blogging-site-with-ai/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/blog-site
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── assets/
│   └── index.html
└── README.md
```

---

## 🛡️ Security & Best Practices

- All sensitive keys are stored in `.env` files.
- Auth middleware ensures only authorized actions.
- Secure image uploads and user data handling.
- Error handling throughout frontend and backend.

---

## 📈 Future Improvements

- Real-time notifications (Socket.io)
- Blog scheduling and drafts
- Multi-language support
- Advanced analytics dashboard

---

## 🙋 FAQ

**Q:** How does AI generate blog titles?  
**A:** It analyzes your content and uses OpenAI to suggest catchy, SEO-friendly titles.

**Q:** Can I use this project for my portfolio?  
**A:** Absolutely! Fork, star, and customize as you like.

**Q:** Is image upload secure?  
**A:** Images are uploaded via Cloudinary with validated user sessions.

---

## 📄 License

MIT

---

## 👤 Author

Made with ❤️ by [Your Name](https://github.com/your-username)

---

## 📬 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin new-feature`)
5. Open a Pull Request

---

## 🌐 Links

- [Live Demo](#) <!-- Add your deployed URL if available -->
- [OpenAI](https://openai.com)
- [Cloudinary](https://cloudinary.com)
