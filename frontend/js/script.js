// =========================
// LOADER
// =========================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 600);
  }
});

// =========================
// MOBILE MENU
// =========================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// Close mobile menu when clicking nav link
document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    if (navLinks) navLinks.classList.remove("show");
  });
});

// =========================
// DARK / LIGHT MODE
// =========================
const themeToggle = document.getElementById("themeToggle");

function setTheme(mode) {
  if (mode === "light") {
    document.body.classList.add("light-mode");
    if (themeToggle) themeToggle.textContent = "☀";
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-mode");
    if (themeToggle) themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  setTheme("light");
} else {
  setTheme("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("light-mode")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  });
}

// =========================
// SCROLL PROGRESS
// =========================
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }
});

// =========================
// SCROLL TO TOP BUTTON
// =========================
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (scrollTopBtn) {
    if (window.scrollY > 300) {
      scrollTopBtn.style.display = "grid";
    } else {
      scrollTopBtn.style.display = "none";
    }
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// =========================
// REVEAL ON SCROLL
// =========================
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// =========================
// TYPING EFFECT (HOME PAGE)
// =========================
const typingText = document.getElementById("typingText");

if (typingText) {
  const roles = [
    "Java Developer",
    "Web Developer",
    "Full Stack Learner",
    "MCA Fresher"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1200);
        return;
      }
    } else {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }

  typeEffect();
}

// =========================
// COUNTER ANIMATION
// =========================
const counters = document.querySelectorAll(".counter");
let counterStarted = false;

function runCounters() {
  if (counterStarted) return;

  const statsSection = document.querySelector(".stats-grid");
  if (!statsSection) return;

  const top = statsSection.getBoundingClientRect().top;
  if (top < window.innerHeight - 100) {
    counterStarted = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const increment = Math.ceil(target / 50);

      const updateCounter = () => {
        count += increment;

        if (count >= target) {
          counter.textContent = target;
        } else {
          counter.textContent = count;
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();
    });
  }
}

window.addEventListener("scroll", runCounters);
runCounters();

// =========================
// SKILL BAR ANIMATION
// =========================
const skillFills = document.querySelectorAll(".skill-fill");
let skillsAnimated = false;

function animateSkills() {
  if (skillsAnimated) return;

  const skillsList = document.querySelector(".skills-list");
  if (!skillsList) return;

  const top = skillsList.getBoundingClientRect().top;
  if (top < window.innerHeight - 100) {
    skillsAnimated = true;

    skillFills.forEach(fill => {
      const width = fill.getAttribute("data-width");
      fill.style.width = width + "%";
    });
  }
}

window.addEventListener("scroll", animateSkills);
animateSkills();

// =========================
// CONTACT FORM SUBMIT
// Backend URL: http://localhost:5000/api/contact
// =========================
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      if (formMessage) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "#ff4d6d";
      }
      return;
    }

    try {
      if (formMessage) {
        formMessage.textContent = "Sending message...";
        formMessage.style.color = "#00d4ff";
      }

      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();

      if (response.ok) {
        if (formMessage) {
          formMessage.textContent = data.message || "Message sent successfully!";
          formMessage.style.color = "#00d084";
        }
        contactForm.reset();
      } else {
        if (formMessage) {
          formMessage.textContent = data.message || "Failed to send message.";
          formMessage.style.color = "#ff4d6d";
        }
      }
    } catch (error) {
      if (formMessage) {
        formMessage.textContent = "Server error. Please check backend connection.";
        formMessage.style.color = "#ff4d6d";
      }
      console.error("Contact Form Error:", error);
    }
  });
}

// =========================
// ADMIN PAGE - LOAD MESSAGES
// Backend URL: http://localhost:5000/api/contact
// =========================
const loadMessagesBtn = document.getElementById("loadMessagesBtn");
const clearMessagesBtn = document.getElementById("clearMessagesBtn");
const adminTableBody = document.getElementById("adminTableBody");
const adminStatus = document.getElementById("adminStatus");

if (loadMessagesBtn) {
  loadMessagesBtn.addEventListener("click", async () => {
    try {
      if (adminStatus) {
        adminStatus.textContent = "Loading messages...";
        adminStatus.style.color = "#00d4ff";
      }

      const response = await fetch("http://localhost:5000/api/contact");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load messages");
      }

      if (adminTableBody) {
        adminTableBody.innerHTML = "";

        if (!data.contacts || data.contacts.length === 0) {
          adminTableBody.innerHTML = `
            <tr>
              <td colspan="6" class="empty-row">No messages found.</td>
            </tr>
          `;
        } else {
          data.contacts.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${index + 1}</td>
              <td>${item.name}</td>
              <td>${item.email}</td>
              <td>${item.subject}</td>
              <td>${item.message}</td>
              <td>${new Date(item.createdAt).toLocaleString()}</td>
            `;
            adminTableBody.appendChild(row);
          });
        }
      }

      if (adminStatus) {
        adminStatus.textContent = "Messages loaded successfully.";
        adminStatus.style.color = "#00d084";
      }

    } catch (error) {
      console.error("Admin Fetch Error:", error);

      if (adminStatus) {
        adminStatus.textContent = "Could not load messages. Check backend/server.";
        adminStatus.style.color = "#ff4d6d";
      }
    }
  });
}

if (clearMessagesBtn) {
  clearMessagesBtn.addEventListener("click", () => {
    if (adminTableBody) {
      adminTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-row">No messages loaded yet.</td>
        </tr>
      `;
    }

    if (adminStatus) {
      adminStatus.textContent = "Table cleared.";
      adminStatus.style.color = "#00d4ff";
    }
  });
}