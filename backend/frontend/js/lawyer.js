/* REGISTER */

if (document.getElementById("registerForm")) {

  document.getElementById("registerForm")
  .addEventListener("submit", async function(e) {

    e.preventDefault();

    const data = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      password: password.value
    };

    const response = await fetch("http://localhost:3000/lawyer/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
  });
}


/* LOGIN */

if (document.getElementById("loginForm")) {

  document.getElementById("loginForm")
  .addEventListener("submit", async function(e) {

    e.preventDefault();

    const data = {
      email: loginEmail.value,
      password: loginPassword.value
    };

    const response = await fetch("http://localhost:3000/lawyer/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
  });
}