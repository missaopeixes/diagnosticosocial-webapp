import { FormGroup } from '@angular/forms';

export const confirmarSenha = (formularioSenha: FormGroup) => {
  const senha = formularioSenha.controls.senha.value;
  const confirmacao = formularioSenha.controls.confirmacao.value;

  if (!confirmacao || confirmacao.length <= 0) {
    return null;
  }

  if (confirmacao !== senha) {
    return {
      confirmacaoInvalida: true
    };
  }

  return null;
}
