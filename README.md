# 🎯 Habit Rhythm

A modern, full-stack habit tracker built with **Next.js 15**, **MongoDB**, and **NextAuth**.

Track your habits with a beautiful dot calendar, customizable colors, and secure authentication.

---

## ✨ Features

* 🔐 **User Authentication** via Google & GitHub (NextAuth)
* 📅 **Dot Calendar Habit Tracker** (inspired by GitHub contributions)
* 🎨 **Add, Edit, Remove Habits** with color picker
* ✅ **Track Completions by Day** (toggle with a dot click)
* 💾 **MongoDB Storage** (habits are saved per user)
* 📱 **Responsive, Modern UI**
* 🔔 **Toast Notifications** for all actions
* 🗑️ **Confirmation Modal** before deleting a habit
* 🧼 **TypeScript, ESLint, Prettier** for code quality

---

## 🛠️ Tech Stack

* [Next.js 15 (App Router)](https://nextjs.org/)
* [MongoDB](https://www.mongodb.com/) (via Docker or Atlas)
* [Mongoose](https://mongoosejs.com/)
* [NextAuth.js](https://next-auth.js.org/)
* [react-hot-toast](https://react-hot-toast.com/)
* [react-colorful](https://github.com/omgovich/react-colorful)
* [Lucide Icons](https://lucide.dev/)
* [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/habit-rhythm.git
cd habit-rhythm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

* **Local:**

```bash
docker run -d -p 27017:27017 --name mongo mongo
```

* **Or use [MongoDB Atlas](https://www.mongodb.com/atlas)**

### 4. Configure Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/habit-rhythm
NEXTAUTH_SECRET=your-random-secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
habit-rhythm/
├── app/
│   └── api/
│       └── habits/
│           ├── [habitId]/
│           │   └── route.ts
│           ├── [habitId]/
│           │   └── toggle/
│           │       └── route.ts
│           └── route.ts
├── components/
│   ├── habits/
│   │   ├── HabitCalendar.tsx
│   │   ├── HabitModal.tsx
│   │   ├── HabitSidebar.tsx
│   │   └── ConfirmModal.tsx
│   └── buttons/
│       └── Button.tsx
├── lib/
│   ├── mongoose.ts
│   ├── getUserFromSession.ts
│   └── colorUtils.ts
├── models/
│   └── User.ts
├── pages/
│   └── api/
│       └── auth/
│           └── [...nextauth].ts
├── styles/
│   └── globals.css
├── ...
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT License. Feel free to use and modify this project for your own habits!
