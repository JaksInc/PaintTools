const { combineColors } = require('../public/js/combine.js');

test('drops exceeding 383 increase ounces', () => {
  const colorA = { KXL: [0, 300] };
  const colorB = { KXL: [1, 300] };
  const result = combineColors(colorA, colorB);
  expect(result).toEqual({ KXL: [1, 108] });
});

