import { Notify, Dialog } from 'quasar'

function notificar(mensagem, tipo) {
  Notify.create({
    type: tipo,
    message: mensagem,
    icon: 'check_circle',
    position: 'top',
    timeout: 3000,
    actions: [
      {
        icon: 'close',
        color: tipo === 'warning' ? 'black' : 'white',
        round: true,
        handler: () => {
          /* ... */
        },
      },
    ],
  })
}

function perguntar(titulo, mensagem, onOkFunction) {
  Dialog.create({
    title: titulo,
    message: mensagem,
    cancel: true,
    persistent: true,
  }).onOk(onOkFunction)
}

export default { notificar, perguntar }
