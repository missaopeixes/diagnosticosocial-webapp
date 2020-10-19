# App Diagnóstico Social

Uma iniciativa [Missão Peixes](https://www.missaopeixes.com/) 🐟 para automatização de diagnósticos sociais em comunidades de vulnerabilidade social.

## Objetivo

 O objetivo desse projeto é auxiliar ONGs, projetos sociais e agências missionárias a coletar dados e gerar relatórios para realizar diagnósticos sociais das comunidades de atuação.

### Contribuição

Sinta-se a vontade para contribuir com esse projeto.
Ele é feito pela **comunidade** e para a **comunidade**! 😆

---

# diagnosticosocial-webapp

Front-end da aplicação Diagnóstico Social para a web.

Back-end - [diagnosticosocial-server](https://github.com/missaopeixes/diagnosticosocial-server)

### Requisitos

- Nodejs 10+
- Python 2.7
  - Pode ser instalado via ``npm`` através do seguinte comando: ``npm install --global windows-build-tools``.
  - Talvez seja necessário executar ``npm rebuild node-sass`` para funcionar corretamente.

### Preparando o ambiente local

```
npm install
```

### Executando

```
npm start
```
Obs.: Confira se o apontamento para o servidor está correto em `src/enviroments/enviroment.prod.ts` (parâmetro **serverUrl**)