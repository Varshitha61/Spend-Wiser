try {
  const { sendWelcomeEmail } = require('./services/emailService');
  console.log("Successfully imported emailService");
  
  sendWelcomeEmail("test@example.com", "Test User")
    .then(() => {
      console.log("sendWelcomeEmail resolved successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("sendWelcomeEmail rejected:", err);
      process.exit(1);
    });
} catch (e) {
  console.error("Import or call failed synchronously:", e);
  process.exit(1);
}
