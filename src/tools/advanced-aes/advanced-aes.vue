<script setup lang="ts">
import cryptor from 'crypto-js';

const config = reactive({
  padding: 'Pkcs7',
  mode: 'ECB',
  secret: 'my secret key',
});

const modes = new Map<string, any>();
modes.set('CBC', cryptor.mode.CBC);
modes.set('CFB', cryptor.mode.CFB);
modes.set('CTR', cryptor.mode.CTR);
modes.set('OFB', cryptor.mode.OFB);
modes.set('ECB', cryptor.mode.ECB);

const pads = new Map<string, any>();
pads.set('Pkcs7', cryptor.pad.Pkcs7);
pads.set('Iso97971', cryptor.pad.Iso97971);
pads.set('AnsiX923', cryptor.pad.AnsiX923);
pads.set('Iso10126', cryptor.pad.Iso10126);
pads.set('ZeroPadding', cryptor.pad.ZeroPadding);
pads.set('NoPadding', cryptor.pad.NoPadding);

const raw = ref('');
const encrypted = ref('');
const errorMessage = ref('');
const showError = ref(false);

function handleEncrypt() {
  errorMessage.value = '';
  showError.value = false;

  try {
    encrypted.value = cryptor.AES.encrypt(
      raw.value,
      cryptor.enc.Utf8.parse(config.secret),
      {
        padding: pads.get(config.padding),
        mode: modes.get(config.mode),
      },
    ).toString();
  }
  catch (error) {
    errorMessage.value = 'Failed to encrypt: Invalid settings or configuration';
    showError.value = true;
    console.error('Encryption error:', error);
  }
}

function handleDecrypt() {
  errorMessage.value = '';
  showError.value = false;

  try {
    const cipherParams = cryptor.lib.CipherParams.create({
      ciphertext: cryptor.enc.Base64.parse(encrypted.value),
    });

    const decrypted = cryptor.AES.decrypt(
      cipherParams,
      cryptor.enc.Utf8.parse(config.secret),
      {
        padding: pads.get(config.padding),
        mode: modes.get(config.mode),
      },
    ).toString(cryptor.enc.Utf8);

    // Check if decryption was successful
    if (!decrypted) {
      throw new Error('Decryption failed - invalid output');
    }

    raw.value = decrypted;
  }
  catch (error) {
    errorMessage.value = 'Failed to decrypt: Invalid ciphertext, key, or settings';
    showError.value = true;
    console.error('Decryption error:', error);
  }
}

function closeError() {
  showError.value = false;
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="max-width: 600px" mx-auto mb-5>
      <div class="flex gap-2">
        <c-select
          v-model:value="config.padding"
          flex-1
          label="Padding"
          :options="[
            { label: 'PKCS7', value: 'Pkcs7' },
            { label: 'Iso97971', value: 'Iso97971' },
            { label: 'AnsiX923', value: 'AnsiX923' },
            { label: 'Iso10126', value: 'Iso10126' },
            { label: 'ZeroPadding', value: 'ZeroPadding' },
            { label: 'NoPadding', value: 'NoPadding' },
          ]"
        />
        <c-select
          v-model:value="config.mode"
          flex-1
          label="Mode"
          :options="[
            { label: 'ECB', value: 'ECB' },
            { label: 'CBC', value: 'CBC' },
            { label: 'CFB', value: 'CFB' },
            { label: 'CTR', value: 'CTR' },
            { label: 'OFB', value: 'OFB' },
          ]"
        />
      </div>
      <div class="mt-2">
        <c-input-text
          v-model:value="config.secret"
          label="Secret"
          clearable
          raw-text
          style="width: 100%"
        />
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-4">
    <c-card title="Raw" flex-1 style="width: 100%; max-width: 800px; margin: 0 auto;">
      <div style="max-height: 300px; overflow-y: auto;">
        <c-input-text
          v-model:value="raw"
          rows="4"
          placeholder=""
          multiline raw-text monospace autosize flex-1
        />
      </div>
    </c-card>

    <div class="my-2 flex justify-center gap-4">
      <c-button @click="handleEncrypt">
        Encrypt ↓
      </c-button>
      <c-button @click="handleDecrypt">
        Decrypt ↑
      </c-button>
    </div>

    <!-- Error message alert -->
    <c-alert
      v-if="showError"
      type="error"
      dismissible
      class="mb-2"
      @dismiss="closeError"
    >
      {{ errorMessage }}
    </c-alert>

    <c-card title="Encrypted" flex-1 style="width: 100%; max-width: 800px; margin: 0 auto;">
      <div style="max-height: 300px; overflow-y: auto;">
        <c-input-text
          v-model:value="encrypted"
          rows="4"
          placeholder=""
          multiline raw-text monospace autosize flex-1
        />
      </div>
    </c-card>
  </div>
</template>
