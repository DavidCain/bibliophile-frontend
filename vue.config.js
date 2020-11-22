module.exports = {
  lintOnSave: false,
  integrity: true,
  // The full build of Vue needs unsafe-eval in the CSP so that it may compile templates from strings.
  // We don't need that behavior, since all templates are `.vue` files.
  // The default setting of this is already false, but we're explicit about our dependence on it.
  runtimeCompiler: false
};
