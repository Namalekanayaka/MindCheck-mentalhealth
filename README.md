# MindCheck - Mental Health Support Web App 

## Project Overview
**MindCheck** is a responsive and interactive **mental health support web application** built with **React** and **Tailwind CSS**.  
The frontend allows users to:  
- Take a **mental health quiz**  
- View **personalized results** with color-coded feedback  
- Track **past quiz results and mood history**  
- Access **resources and emergency hotlines**  
- Optional **login/register UI** (backend-ready)

> ⚠️ Disclaimer: This project is for **educational purposes only**. It is **not a medical diagnostic tool**. Users should consult professionals for mental health advice.

---

## Features (Frontend Only)

- Single Page Application (SPA) with **React Router**  
- **One-question-at-a-time quiz** with score calculation  
- **Color-coded results and feedback**  
- Mood tracking charts using **Recharts**  
- Animated hero, quiz transitions, and resource cards using **Framer Motion**  
- Local storage for quiz results before backend integration  
- Responsive design using **Tailwind CSS**  
- Resources & hotlines page  
- Optional login/register UI for future backend integration  

---

## Tech Stack

- **React 18 + Vite** – SPA framework and fast bundler  
- **Tailwind CSS** – utility-first styling for responsive UI  
- **React Router Dom** – page navigation without reloads  
- **Axios** – API requests to backend or local JSON  
- **Framer Motion** – animations and transitions  
- **Recharts** – charts for visualizing mood trends  
- **Lottie-React** – optional animations for engagement  
- **localStorage** – temporary storage for quiz results  

---

## Project Structure

src/
api/
api.js # Axios instance & API helper functions
components/
Navbar.jsx # Navigation bar
Footer.jsx # Footer
QuestionCard.jsx # Quiz question component
ResultCard.jsx # Display results
Chart.jsx # Mood history chart
data/
sampleQuestions.json # Sample quiz questions
sampleResources.json # Sample resources
pages/
Home.jsx # Hero, intro, start quiz
Quiz.jsx # Quiz page, question flow
Result.jsx # Shows quiz results
Tracker.jsx # Tracks previous results (localStorage)
Resources.jsx # Hotlines & articles
Auth.jsx # Optional login/register page
App.jsx
main.jsx
index.css
tailwind.config.cjs
package.json
README.md

pgsql


---



