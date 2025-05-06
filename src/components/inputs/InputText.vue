<template>
    <q-input filled v-model="text" label="Filled" />
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      text: ref('')
    }
  }
}
</script>