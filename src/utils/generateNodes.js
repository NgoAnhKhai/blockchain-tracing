export function randomHexAddress() {
  const hex = Array.from(
    { length: 40 },
    () => "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
  return "0x" + hex;
}

export function generateRandomAddresses(count = 1000) {
  return Array.from({ length: count }, () => randomHexAddress());
}
