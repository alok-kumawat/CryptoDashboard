document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");
  
    // Dummy credentials for demo
    const validEmail = "alok@gmail.com";
    const validPassword = "alok123";
  
    // Check required fields
    if (!email || !password) {
      errorMessage.style.color = "red";
      errorMessage.textContent = "Please enter both email and password.";
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorMessage.style.color = "red";
      errorMessage.textContent = "Please enter a valid email address.";
      return;
    }
  
    // Check credentials
    if (email === validEmail && password === validPassword) {
      errorMessage.style.color = "green";
      errorMessage.textContent = "Logging in...";
  
      // Save user data to local storage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");
  
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } else {
      errorMessage.style.color = "red";
      errorMessage.textContent = "Incorrect email or password.";
    }
  });
  