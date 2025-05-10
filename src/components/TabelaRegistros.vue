<template>
  <q-page class="q-pa-md">
    <q-list bordered>
      <q-item v-for="nota in notas" :key="nota.id" clickable @click="abrirNota(nota.id)">
        <q-item-section>{{ nota.titulo }}</q-item-section>
        <div class="row items-center">
          <div class="q-mr-lg">
            {{ new Date(nota.data || Date.now()).toLocaleDateString('pt-BR') }}
          </div>
          <q-icon class="q-mr-lg" :name="nota.bloqueado ? 'lock' : 'lock_open'" />
          <q-btn dense flat icon="delete" color="negative" />
        </div>
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
