import dayjs from "dayjs";

export function groupTxByMonth(transactions, walletAddress) {
  // walletAddress phải là lowerCase!
  const grouped = {};

  transactions.forEach((tx) => {
    const month = dayjs(tx.timestamp).format("YYYY-MM"); // lấy tháng
    const value = Number(tx.value) / 1e18;
    const isIn = tx.to_address?.toLowerCase() === walletAddress;
    const isOut = tx.from_address?.toLowerCase() === walletAddress;
    if (!grouped[month]) grouped[month] = { incoming: 0, outgoing: 0 };
    if (isIn) grouped[month].incoming += value;
    if (isOut) grouped[month].outgoing += value;
  });

  // Đảm bảo đủ 12 tháng gần nhất, sort tháng tăng dần (Jan -> Dec)
  const months = [];
  for (let i = 11; i >= 0; --i) {
    months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
  }
  const data = {
    months: months.map((m) => dayjs(m).format("MMM")), // Jan, Feb...
    incoming: months.map((m) => grouped[m]?.incoming || 0),
    outgoing: months.map((m) => grouped[m]?.outgoing || 0),
  };
  data.netFlow = data.incoming.map((v, i) => v - data.outgoing[i]);
  return data;
}
