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

function handleEncrypt() {
  encrypted.value = cryptor.AES.encrypt(raw.value, config.secret, {
    padding: pads.get(config.padding),
    mode: modes.get(config.mode),
  }).toString();
}

function handleDecrypt() {
  raw.value = cryptor.AES.decrypt(encrypted.value, config.secret, {
    padding: pads.get(config.padding),
    mode: modes.get(config.mode),
  }).toString(cryptor.enc.Utf8);
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
    <c-card title="Raw" flex-1>
      <c-input-text
        v-model:value="raw"
        rows="4"
        placeholder=""
        multiline raw-text monospace autosize flex-1
      />
    </c-card>

    <div class="my-2 flex justify-center gap-4">
      <c-button @click="handleEncrypt">
        Encrypt ↓
      </c-button>
      <c-button @click="handleDecrypt">
        Decrypt ↑
      </c-button>
    </div>

    <c-card title="Encrypted" flex-1>
      <c-input-text
        v-model:value="encrypted"
        rows="4"
        placeholder=""
        multiline raw-text monospace autosize flex-1
      />
    </c-card>
  </div>
</template>
