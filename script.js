import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ⚠️ Remplace par TES infos Supabase
const SUPABASE_URL = "https://mxwdmkhzdxuscmnzofyq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14d2Rta2h6ZHh1c2NtbnpvZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzOTA5MzIsImV4cCI6MjA3Mzk2NjkzMn0.kJlzqCvY94-zw4EPHijQi8gvoqvMkySuos6pKc677Ys";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Envoi du formulaire
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const feedback = {
    name: form.name.value,
    session: form.session.value,
    mood: form.mood.value,
    rating: parseInt(form.rating.value),
    comment: form.comment.value,
  };

  const { data, error } = await supabase.from("feedbacks").insert([feedback]);

  if (error) {
    console.error(error);
    alert("Erreur lors de l'envoi");
  } else {
    addFeedbackCard(data[0]);
    form.reset();
  }
});

// Charger les avis existants
async function loadFeedbacks() {
  const { data, error } = await supabase
    .from("feedbacks")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error) {
    data.forEach(addFeedbackCard);
  }
}

function addFeedbackCard(feedback) {
  const list = document.getElementById("feedbackList");
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h3>${feedback.name} — ${feedback.session}</h3>
    <p>Humeur : ${feedback.mood} | Note : ${feedback.rating}/5</p>
    <p>${feedback.comment || ""}</p>
    <small>${new Date(feedback.created_at).toLocaleString()}</small>
  `;
  list.prepend(card);
}

loadFeedbacks();
