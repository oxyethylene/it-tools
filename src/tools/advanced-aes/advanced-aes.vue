<script setup lang="ts">
import cryptor from 'crypto-js';

const config = reactive({
  padding: 'Pkcs7',
  mode: 'CBC',
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

const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherSecret = ref('my secret key');
const cypherOutput = computed(() => cryptor.AES.encrypt(cypherInput.value, cypherSecret.value, { padding: pads.get(config.padding), mode: modes.get(config.mode) }).toString());

const decryptInput = ref('U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs');
const decryptSecret = ref('my secret key');
const decryptOutput = computed(() => cryptor.AES.decrypt(decryptInput.value, decryptSecret.value, { padding: pads.get(config.padding), mode: modes.get(config.mode) }).toString(cryptor.enc.Utf8));
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="max-width: 600px" mx-auto mb-5 flex gap-2>
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
          { label: 'CBC', value: 'CBC' },
          { label: 'CFB', value: 'CFB' },
          { label: 'CTR', value: 'CTR' },
          { label: 'OFB', value: 'OFB' },
          { label: 'ECB', value: 'ECB' },
        ]"
      />
    </div>
  </div>
  <c-card title="Encrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        label="Your text:"
        placeholder="The string to cypher"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <c-input-text v-model:value="cypherSecret" label="Your secret key:" clearable raw-text />
    </div>
    <c-input-text
      label="Your text encrypted:"
      :value="cypherOutput"
      rows="3"
      placeholder="Your string hash"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card title="Decrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        label="Your text:"
        placeholder="The string to cypher"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <c-input-text v-model:value="decryptSecret" label="Your secret key:" clearable raw-text />
    </div>
    <c-input-text
      label="Your text encrypted:"
      :value="decryptOutput"
      rows="3"
      placeholder="Your string hash"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
