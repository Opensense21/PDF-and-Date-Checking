
function getJD(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

const date = new Date(2026, 10, 22); // Nov 22, 2026
const jd = getJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
const branchIndex = (jd + 9) % 12;
const branches = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

console.log("Date:", date.toDateString());
console.log("JD:", jd);
console.log("Branch Index:", branchIndex);
console.log("Branch Name:", branches[branchIndex]);

// Check Lunar Month
const boundaries = [
    { y: 2026, m: 10, d: 9, lm: 9 },
    { y: 2026, m: 11, d: 9, lm: 10 }
];
// Nov 22 is after Nov 9, so it's Lunar Month 10.
console.log("Lunar Month: 10");
