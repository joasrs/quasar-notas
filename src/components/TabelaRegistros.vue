<template>
  <q-page class="q-pa-md">
    <q-list bordered>
      <q-item v-for="nota in notas" :key="nota.id" clickable @click="abrirNota(nota.id)">
        <q-item-section>{{ nota.titulo }}</q-item-section>
        <q-item-section side>{{ new Date(nota.data).toLocaleDateString('pt-BR') }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const { notas } = defineProps({
  notas: {
    type: Array,
    default: () => [],
  },
})

function abrirNota(id) {
  router.push({ name: 'alterar', params: { id } })
}
</script>
