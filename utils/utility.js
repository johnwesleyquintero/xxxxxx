export function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay); // Preserve 'this' context
  };
  // Note: Behavior with delay <= 0 is dependent on the JavaScript runtime (e.g., immediate execution or no debouncing).
}
