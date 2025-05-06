<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Quasar Notas</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <TabelaRegistros :notas="notas" />
      <div
        class="fixed-bottom q-pa-md"
        style="background-color: white; box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1)"
      >
        <q-btn label="Adicionar" color="primary" class="full-width" to="/incluir" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import TabelaRegistros from 'components/TabelaRegistros.vue'

const notas = JSON.parse(localStorage.getItem('quasar-notas')) || []
</script>
