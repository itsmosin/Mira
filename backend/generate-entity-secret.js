const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
require('dotenv').config();

async function main() {
  if (!process.env.CIRCLE_API_KEY) {
    console.error('FATAL ERROR: CIRCLE_API_KEY is not set in your .env file.');
    return;
  }

  // The SDK requires the full client to be initialized to generate the ciphertext.
  const circleClient = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY,
  });

  const { entitySecret, entitySecretCiphertext } = await circleClient.generateEntitySecretCiphertext();

  console.log(`
================================================================================
Your new Entity Secret is:

${entitySecret}

IMPORTANT: Please copy this value and update the ENTITY_SECRET in your
.env file. The application will not work without this new secret.
================================================================================

================================================================================
Your Entity Secret Ciphertext is:

${entitySecretCiphertext}

You MUST register this value in the Circle Developer Console.
Navigate to Settings -> Developer Controlled Wallets -> Register Entity Secret
and paste the value above.
================================================================================
  `);
}

main(); 