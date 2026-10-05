// Independent oracle: closed-form annuity-due FV (no step-up). Deliberately NOT the app's loop.
function futureValue(monthly, annualRate, years) {
  const i = annualRate / 12 / 100, n = years * 12;
  return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}
const parseInr = (t) => Number(String(t).replace(/[^\d.-]/g, ''));
module.exports = { futureValue, parseInr };
