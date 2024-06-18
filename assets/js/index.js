function on(evt, selector, callback) {
  document.addEventListener(evt, (e) => {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
}
function ApiUrl(name) {
  return `${window.location.origin}/api/${name}`;
}
