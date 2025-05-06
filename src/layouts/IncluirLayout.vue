<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-btn icon="arrow_back" flat round dense @click="voltar" aria-label="Voltar" />
        <q-toolbar-title>{{ tituloPaginaRef }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-sm">
        <q-input filled v-model="tituloRef" label="Título da Nota" dense />
      </div>

      <div class="q-pa-sm" style="height: 500px">
        <div class="relative-position fit">
          <q-input
            filled
            v-model="conteudoRef"
            type="textarea"
            label="Digite sua nota..."
            class="fit"
            input-style="height: 500px;"
          />

          <q-btn
            round
            icon="mic"
            color="primary"
            class="absolute-bottom-right q-ma-md"
            @click="gravarNota"
          />
        </div>
      </div>
      <div
        class="fixed-bottom q-pa-md"
        style="background-color: white; box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1)"
      >
        <q-btn
          :label="idRef ? 'Salvar' : 'Adicionar'"
          color="primary"
          class="full-width"
          @click="registrar"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

const idRef = ref(0)
const tituloRef = ref('')
const conteudoRef = ref('')
const tituloPaginaRef = ref('Adicionar Nota')

function gravarNota() {
  console.log('Gravando por voz...')
}

function voltar() {
  router.back()
}

function registrar() {
  let notas = JSON.parse(localStorage.getItem('quasar-notas'))
  const id = idRef.value
  const titulo = tituloRef.value
  const conteudo = conteudoRef.value

  if (notas) {
    if (id) {
      const nota = notas.find((e) => e.id == id)

      if (nota) {
        nota.conteudo = conteudo
        nota.titulo = titulo
        nota.data = Date.now()
      }
    } else {
      const id = notas.reduce((max, item) => Math.max(max, item.id), 0) + 1
      notas.push({ id, titulo, conteudo, data: Date.now() })
    }
  } else {
    notas = [{ id: 1, titulo, conteudo, data: Date.now() }]
  }

  localStorage.setItem('quasar-notas', JSON.stringify(notas))
  voltar()
}

onMounted(() => {
  idRef.value = Number(route.params.id)
  if (idRef.value) {
    tituloPaginaRef.value = 'Alterar Nota'
    const nota = JSON.parse(localStorage.getItem('quasar-notas')).find((n) => n.id === idRef.value)
    if (nota) {
      tituloRef.value = nota.titulo
      conteudoRef.value = nota.conteudo
    }
  }
})
</script>
