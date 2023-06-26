/*const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  responseTimeout: 10000,
  requestTimeout: 10000,
  env: {
    MAILSLURP_API_KEY:
      "5b429b4813f6b6b512f00a86c2cde4d28d1c64190da42895c4ec52d0f6b2aefd",
  },
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)

          return null
        },
      })
    }

  }
  
});*/

const { defineConfig } = require("cypress");
const { MailSlurp } = require("mailslurp-client");

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  responseTimeout: 10000,
  requestTimeout: 10000,
  env: {
    MAILSLURP_API_KEY:
      "5b429b4813f6b6b512f00a86c2cde4d28d1c64190da42895c4ec52d0f6b2aefd",
  },
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        createInbox() {
          const mailslurp = new MailSlurp({
            apiKey: "5b429b4813f6b6b512f00a86c2cde4d28d1c64190da42895c4ec52d0f6b2aefd",
          });
          return mailslurp.createInbox();
        },
      });
    },
  },
});
