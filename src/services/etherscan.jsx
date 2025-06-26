const ETHERSCAN_API_KEY = "YNRGBKSHIMR3WN8ZEQNPSHTQ9T74KK1V2D";

export async function getTxListDetail(address) {
  const res = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
  );
  const json = await res.json();
  return json.result || [];
}
