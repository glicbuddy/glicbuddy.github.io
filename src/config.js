const appRoutes = {
  home: '/',
  form: '/registrar',
  stats: '/estatisticas',
  settings: '/configuracoes'
}

export default {
  appName: import.meta.env.VITE_APP_NAME,
  appDescription: import.meta.env.VITE_APP_DESCRIPTION,
  appActions: [appRoutes.form, appRoutes.stats, appRoutes.settings],
  appRoutes
}
