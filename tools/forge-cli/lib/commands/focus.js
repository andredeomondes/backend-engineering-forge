export function focus(state, text) {
  if (!text || !text.trim()) {
    throw new Error('Uso: forge focus "Fase X / Unidade Y — tema"');
  }
  return { ...state, currentFocus: text.trim() };
}
