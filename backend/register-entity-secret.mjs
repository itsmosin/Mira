import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets';
import 'dotenv/config';
import fs from 'fs/promises';

async function main() {
  const apiKey = process.env.CIRCLE_API_KEY;
  const entitySecret = process.env.ENTITY_SECRET;

  if (!apiKey || !entitySecret) {
    console.error('Error: CIRCLE_API_KEY and ENTITY_SECRET must be set in your .env file.');
    process.exit(1);
  }

  console.log('Attempting to register Entity Secret with Circle...');

  try {
    const response = await registerEntitySecretCiphertext({
      apiKey: apiKey,
      entitySecret: entitySecret,
    });

    if (response.data?.recoveryFile) {
      const recoveryData = response.data.recoveryFile;
      const filename = `circle-recovery-${new Date().toISOString()}.dat`;
      await fs.writeFile(filename, recoveryData);
      
      console.log('✅ Entity Secret registered successfully!');
      console.log(`\nIMPORTANT: A recovery file named "${filename}" has been saved in your 'backend' directory.`);
      console.log('Please store this file in a safe and secure location. If you lose your Entity Secret, you will need this file to regain access to your wallets.');

    } else {
      console.log('✅ Entity Secret registered successfully! (No recovery file was returned)');
    }

  } catch (error) {
    console.error('\n❌ Failed to register Entity Secret.');
    if (error.response) {
        console.error('Error Status:', error.response.status);
        console.error('Error Body:', JSON.stringify(error.response.data, null, 2));
    } else {
        console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

main(); 