<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Quasar Notas</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- <TabelaRegistros :notasRef="notasRef" /> -->
      <q-list bordered class="q-pa-md">
        <q-item v-for="nota in notasRef" :key="nota.id" clickable @click="abrirNota(nota)">
          <q-item-section>{{ nota.titulo }}</q-item-section>
          <div class="row items-center">
            <div class="q-mr-lg">
              {{ new Date(nota.data || Date.now()).toLocaleDateString('pt-BR') }}
            </div>
            <q-icon class="q-mr-lg" :name="nota.bloqueado ? 'lock' : 'lock_open'" />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click.stop="confirmarExclusao(nota)"
            />
          </div>
        </q-item>
      </q-list>
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
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { Autenticacao } from 'src/services/Autenticacao'

const autenticacao = new Autenticacao()

const notasRef = ref(JSON.parse(localStorage.getItem('quasar-notas')) || [])
const $q = useQuasar()
const router = useRouter()

async function abrirNota(nota) {
  console.log(nota.bloqueado)
  if (nota.bloqueado) {
    const permitido = await autenticacao.solicitarBiometria()
    if (!permitido) return
  }

  router.push({ name: 'alterar', params: { nota: JSON.stringify(nota) } })
}

function confirmarExclusao(nota) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir esta nota?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    console.log(nota)
    if (!nota.bloqueado || (await autenticacao.solicitarBiometria())) {
      excluirNota(nota.id)
    }
  })
}

function excluirNota(id) {
  notasRef.value = notasRef.value.filter((n) => n.id !== id)
  localStorage.setItem('quasar-notas', JSON.stringify(notasRef.value))
  $q.notify({
    type: 'positive',
    message: 'Nota excluída com sucesso.',
    position: 'top',
    actions: [
      {
        icon: 'close',
        color: 'white',
        round: true,
        handler: () => {
          /* ... */
        },
      },
    ],
  })
}
</script>
