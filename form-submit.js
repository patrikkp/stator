document.querySelectorAll("form[data-email-form]").forEach((form) => {
  const status = form.querySelector(".support-form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  if (!status || !submitButton) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Šaljemo vašu poruku…";
    status.dataset.state = "pending";
    submitButton.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const result = await response.json();

      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error(result.message || `Slanje nije uspjelo (HTTP ${response.status}).`);
      }

      form.reset();
      status.textContent = "Poruka je poslana. Javit ćemo vam se uskoro.";
      status.dataset.state = "success";
    } catch (error) {
      console.error("Slanje obrasca nije uspjelo:", error);
      status.textContent = "Poruka nije poslana. Pokušajte ponovno ili nam se javite telefonom.";
      status.dataset.state = "error";
    } finally {
      submitButton.disabled = false;
    }
  });
});
