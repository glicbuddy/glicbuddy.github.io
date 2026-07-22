const appRoutes = {
  home: { path: '/', label: 'Home' },
  form: { path: '/registrar', label: 'Registrar' },
  stats: { path: '/estatisticas', label: 'Estatísticas' },
  settings: { path: '/configuracoes', label: 'Configurações' }
}

export default {
  appName: import.meta.env.VITE_APP_NAME,
  appDescription: import.meta.env.VITE_APP_DESCRIPTION,
  appActions: [appRoutes.form.path, appRoutes.stats.path, appRoutes.settings.path],
  appRoutes
}
