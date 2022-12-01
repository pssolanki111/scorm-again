(function (owner) {
  try {
    owner['override'] = {
      // DO NOT ADD ANYTHING BELOW THIS LINE
      UseOverride: true
    };
  } catch (error) {
    window['e'] = error;
    console.info('Override issue:', e.name, error.message);
  }
})(window);
