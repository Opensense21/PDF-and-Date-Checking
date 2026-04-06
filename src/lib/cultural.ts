/**
 * Vietnamese Lunar Calendar Algorithm (Simplified)
 * Based on Ho Ngoc Duc's implementation
 */

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  jd: number;
}

// This is a placeholder for the complex astronomical calculations.
// In a real production app, we'd use a robust library or the full algorithm.
// For this app, we will provide a helper that calculates basic lunar info.

export interface SolarTermInfo {
  name: string;
  description: string;
}

export const SOLAR_TERMS: (SolarTermInfo & { month: number, day: number })[] = [
  { name: "Tiểu Hàn", month: 0, day: 5, description: "Rét nhẹ. Bắt đầu giai đoạn rét buốt nhất." },
  { name: "Đại Hàn", month: 0, day: 20, description: "Rét đậm, rét hại. Thời điểm lạnh nhất trong năm." },
  { name: "Lập Xuân", month: 1, day: 4, description: "Bắt đầu mùa xuân. Tiết trời ấm dần, mưa xuân lất phất." },
  { name: "Vũ Thủy", month: 1, day: 19, description: "Mưa ẩm ướt. Độ ẩm cao, cây cối đâm chồi nảy lộc." },
  { name: "Kinh Trập", month: 2, day: 6, description: "Sâu bọ tỉnh giấc. Tiết trời ấm áp, sấm xuân xuất hiện." },
  { name: "Xuân Phân", month: 2, day: 21, description: "Giữa xuân, ngày đêm dài bằng nhau. Thời tiết ấm áp, vạn vật sinh sôi." },
  { name: "Thanh Minh", month: 3, day: 5, description: "Trời trong sáng, cây cối tươi tốt. Tiết trời mát mẻ, dễ chịu." },
  { name: "Cốc Vũ", month: 3, day: 20, description: "Mưa rào cho ngũ cốc. Độ ẩm tăng cao, chuẩn bị cho mùa hè." },
  { name: "Lập Hạ", month: 4, day: 6, description: "Bắt đầu mùa hè. Nhiệt độ tăng nhanh, ngày dài hơn đêm." },
  { name: "Tiểu Mãn", month: 4, day: 21, description: "Lúa sắp chín, nước đầy đồng. Thời tiết bắt đầu nóng nực." },
  { name: "Mang Chủng", month: 5, day: 6, description: "Ngũ cốc có râu, thời điểm gieo cấy. Nóng ẩm, mưa nhiều." },
  { name: "Hạ Chí", month: 5, day: 21, description: "Giữa hè, ngày dài nhất trong năm. Nắng gắt, nhiệt độ cao nhất." },
  { name: "Tiểu Thử", month: 6, day: 7, description: "Nóng nhẹ. Bắt đầu giai đoạn nóng bức của mùa hè." },
  { name: "Đại Thử", month: 6, day: 23, description: "Nóng nực cực độ. Thời điểm oi bức nhất trong năm." },
  { name: "Lập Thu", month: 7, day: 8, description: "Bắt đầu mùa thu. Nhiệt độ giảm dần, gió heo may xuất hiện." },
  { name: "Xử Thử", month: 7, day: 23, description: "Nóng nực bắt đầu lui. Thời tiết chuyển dần sang mát mẻ." },
  { name: "Bạch Lộ", month: 8, day: 8, description: "Nắng nhạt, sương mù xuất hiện vào sáng sớm. Trời mát dịu." },
  { name: "Thu Phân", month: 8, day: 23, description: "Giữa thu, ngày đêm dài bằng nhau. Thời tiết se lạnh, lá vàng rơi." },
  { name: "Hàn Lộ", month: 9, day: 8, description: "Sương mù lạnh lẽo. Nhiệt độ giảm sâu, trời lạnh về đêm." },
  { name: "Sương Giáng", month: 9, day: 23, description: "Sương đọng thành hạt. Thời tiết chuyển sang lạnh giá." },
  { name: "Lập Đông", month: 10, day: 7, description: "Bắt đầu mùa đông. Gió mùa đông bắc tràn về, trời rét." },
  { name: "Tiểu Tuyết", month: 10, day: 22, description: "Tuyết rơi nhẹ (ở vùng cao). Trời hanh khô, rét đậm." },
  { name: "Đại Tuyết", month: 11, day: 7, description: "Tuyết rơi nhiều. Thời tiết cực kỳ lạnh giá." },
  { name: "Đông Chí", month: 11, day: 22, description: "Giữa đông, đêm dài nhất trong năm. Đỉnh điểm của mùa lạnh." },
];

export function getSolarTermInfo(date: Date): SolarTermInfo {
  const m = date.getMonth();
  const d = date.getDate();
  
  for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
    const term = SOLAR_TERMS[i];
    if (m > term.month || (m === term.month && d >= term.day)) {
      return term;
    }
  }
  
  return SOLAR_TERMS[SOLAR_TERMS.length - 1];
}

export function getSolarTerm(date: Date): string {
  return getSolarTermInfo(date).name;
}

/**
 * Estimates the solar date for a given lunar day and month in a specific year.
 * This is a simplified estimation for demo purposes.
 */
export function estimateSolarDate(lunarDay: number, lunarMonth: number, year: number): Date {
  const baseTet = new Date(year, 1, 10); // Simplified: assume Tet is around Feb 10
  // Adjust baseTet based on common Tet dates if needed, but for demo this is okay
  const totalDays = (lunarMonth - 1) * 29.5 + (lunarDay - 1);
  const solarDate = new Date(baseTet.getTime() + totalDays * 86400000);
  return solarDate;
}

// I Ching Hexagrams Data
export const HEXAGRAMS = [
  { 
    id: 1, 
    name: "Thuần Càn", 
    symbol: "䷀", 
    meaning: "Sức mạnh sáng tạo, sự khởi đầu vĩ đại. Tượng trưng cho Trời.",
    imagery: "Sáu con rồng bay lượn trên bầu trời, tượng trưng cho sức mạnh vô hạn và sự vận động không ngừng của vũ trụ."
  },
  { 
    id: 2, 
    name: "Thuần Khôn", 
    symbol: "䷁", 
    meaning: "Sự tiếp nhận, nuôi dưỡng, đất mẹ. Tượng trưng cho Đất.",
    imagery: "Cánh đồng bao la bát ngát, sẵn sàng đón nhận hạt giống và nuôi dưỡng muôn loài với lòng bao dung vô hạn."
  },
  { 
    id: 3, 
    name: "Thủy Lôi Truân", 
    symbol: "䷂", 
    meaning: "Gian nan khởi đầu, mầm non vươn lên. Cần kiên nhẫn.",
    imagery: "Một mầm non nhỏ bé đang cố gắng xuyên qua lớp đất đá khô cằn trong cơn mưa giông để vươn tới ánh sáng."
  },
  { 
    id: 4, 
    name: "Sơn Thủy Mông", 
    symbol: "䷃", 
    meaning: "Sự non nớt, mờ mịt. Cần được giáo dục và khai sáng.",
    imagery: "Một dòng suối nhỏ chảy dưới chân núi mờ sương, tượng trưng cho sự khởi đầu còn non nớt và cần được dẫn dắt."
  },
  { 
    id: 5, 
    name: "Thủy Thiên Nhu", 
    symbol: "䷄", 
    meaning: "Sự chờ đợi kiên nhẫn. Thời cơ chưa đến, hãy chuẩn bị.",
    imagery: "Những đám mây đen tích tụ trên bầu trời, báo hiệu cơn mưa sắp đến. Người nông dân bình thản chờ đợi thời điểm thích hợp."
  },
  { 
    id: 6, 
    name: "Thiên Thủy Tụng", 
    symbol: "䷅", 
    meaning: "Sự tranh chấp, kiện tụng. Nên tìm sự hòa giải.",
    imagery: "Bầu trời và dòng nước chuyển động ngược chiều nhau, tượng trưng cho sự mâu thuẫn và bất đồng quan điểm."
  },
  { 
    id: 7, 
    name: "Địa Thủy Sư", 
    symbol: "䷆", 
    meaning: "Đạo của người thầy, quân đội. Cần sự kỷ luật và chính nghĩa.",
    imagery: "Nước ẩn sâu trong lòng đất, tượng trưng cho sức mạnh tiềm tàng được tổ chức và dẫn dắt bởi kỷ luật nghiêm minh."
  },
  { 
    id: 8, 
    name: "Thủy Địa Tỷ", 
    symbol: "䷇", 
    meaning: "Sự gần gũi, đoàn kết. Tìm kiếm sự hỗ trợ từ người khác.",
    imagery: "Nước chảy trên mặt đất, thấm nhuần và nuôi dưỡng vạn vật, tượng trưng cho sự gắn kết và hòa hợp."
  },
  { 
    id: 9, 
    name: "Phong Thiên Tiểu Súc", 
    symbol: "䷈", 
    meaning: "Sự tích lũy nhỏ, sức mạnh của sự mềm mỏng.",
    imagery: "Gió thổi nhẹ nhàng trên bầu trời, những đám mây mỏng chưa đủ để tạo thành mưa, cần sự tích lũy thêm."
  },
  { 
    id: 10, 
    name: "Thiên Trạch Lý", 
    symbol: "䷉", 
    meaning: "Sự cẩn trọng trong hành động, dẫm lên đuôi hổ.",
    imagery: "Người đi trên mặt hồ đóng băng mỏng, hoặc dẫm lên đuôi hổ mà không bị cắn nhờ sự khéo léo và lễ độ."
  },
  { 
    id: 11, 
    name: "Địa Thiên Thái", 
    symbol: "䷊", 
    meaning: "Sự hanh thông, hòa hợp giữa trời và đất. Thái bình.",
    imagery: "Trời ở dưới, Đất ở trên, khí âm dương giao hòa, vạn vật sinh sôi nảy nở trong cảnh thái bình thịnh trị."
  },
  { 
    id: 12, 
    name: "Thiên Địa Bĩ", 
    symbol: "䷋", 
    meaning: "Sự bế tắc, không thông. Cần giữ vững đạo đức.",
    imagery: "Trời ở trên, Đất ở dưới, khí âm dương không giao nhau, vạn vật ngưng trệ, lòng người ly tán."
  },
  { 
    id: 13, 
    name: "Thiên Hỏa Đồng Nhân", 
    symbol: "䷌", 
    meaning: "Sự đoàn kết với mọi người, cộng đồng.",
    imagery: "Ngọn lửa rực cháy dưới bầu trời bao la, soi sáng và thu hút mọi người cùng tụ họp về một lý tưởng chung."
  },
  { 
    id: 14, 
    name: "Hỏa Thiên Đại Hữu", 
    symbol: "䷍", 
    meaning: "Sở hữu lớn, sự giàu có và thịnh vượng.",
    imagery: "Mặt trời tỏa sáng rực rỡ giữa bầu trời, chiếu rọi khắp nhân gian, tượng trưng cho sự thành công vang dội."
  },
  { 
    id: 15, 
    name: "Địa Sơn Khiêm", 
    symbol: "䷎", 
    meaning: "Sự khiêm tốn, nhún nhường mang lại thành công.",
    imagery: "Ngọn núi cao ẩn mình dưới lòng đất phẳng, tượng trưng cho người có tài đức nhưng luôn giữ thái độ khiêm nhường."
  },
  { 
    id: 16, 
    name: "Lôi Địa Dự", 
    symbol: "䷏", 
    meaning: "Sự nhiệt huyết, niềm vui và sự chuẩn bị.",
    imagery: "Tiếng sấm vang rền trên mặt đất sau mùa đông dài, báo hiệu mùa xuân đến và khơi dậy sức sống mãnh liệt."
  },
];

export function castHexagram() {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    const sum = (Math.random() > 0.5 ? 3 : 2) + (Math.random() > 0.5 ? 3 : 2) + (Math.random() > 0.5 ? 3 : 2);
    lines.push(sum);
  }
  return lines;
}

export interface LunarFestival {
  day: number;
  month: number;
  name: string;
  description: string;
}

export const LUNAR_FESTIVALS: LunarFestival[] = [
  { day: 1, month: 1, name: "Tết Nguyên Đán", description: "Lễ hội quan trọng nhất của người Việt, mừng năm mới âm lịch." },
  { day: 15, month: 1, name: "Tết Thượng Nguyên", description: "Rằm tháng Giêng, ngày lễ cầu an và may mắn cho cả năm." },
  { day: 3, month: 3, name: "Tết Hàn Thực", description: "Ngày ăn đồ lạnh, tưởng nhớ công ơn tổ tiên." },
  { day: 10, month: 3, name: "Giỗ Tổ Hùng Vương", description: "Ngày hội toàn dân tưởng nhớ các vua Hùng đã có công dựng nước." },
  { day: 15, month: 4, name: "Lễ Phật Đản", description: "Kỷ niệm ngày sinh của Đức Phật Thích Ca Mâu Ni." },
  { day: 5, month: 5, name: "Tết Đoan Ngọ", description: "Tết diệt sâu bọ, cầu mong sức khỏe và mùa màng bội thu." },
  { day: 15, month: 7, name: "Lễ Vu Lan", description: "Ngày báo hiếu cha mẹ, xá tội vong nhân." },
  { day: 15, month: 8, name: "Tết Trung Thu", description: "Lễ hội trăng rằm, tết của thiếu nhi và sự sum họp gia đình." },
  { day: 9, month: 9, name: "Tết Trùng Cửu", description: "Ngày hội leo núi, uống rượu hoa cúc, cầu mong trường thọ." },
  { day: 15, month: 10, name: "Tết Hạ Nguyên", description: "Lễ mừng lúa mới, tạ ơn trời đất và tổ tiên." },
  { day: 23, month: 12, name: "Tết Ông Công Ông Táo", description: "Ngày tiễn các vị thần bếp về trời báo cáo việc hạ giới." },
];

export function getLunarFestivals(day: number, month: number): LunarFestival[] {
  return LUNAR_FESTIVALS.filter(f => f.day === day && f.month === month);
}

export function getAllLunarFestivals(): LunarFestival[] {
  return LUNAR_FESTIVALS;
}

export function getLunarDateDetails(date: Date) {
  // Accurate Lunar Data for 2025-2026
  // Format: { y, m, d } is the Solar date of the 1st day of that Lunar month
  const boundaries = [
    // 2025
    { y: 2025, m: 0, d: 29, lm: 1 },
    { y: 2025, m: 1, d: 28, lm: 2 },
    { y: 2025, m: 2, d: 29, lm: 3 },
    { y: 2025, m: 3, d: 28, lm: 4 },
    { y: 2025, m: 4, d: 27, lm: 5 },
    { y: 2025, m: 5, d: 25, lm: 6 },
    { y: 2025, m: 6, d: 24, lm: 7 },
    { y: 2025, m: 7, d: 23, lm: 8 },
    { y: 2025, m: 8, d: 22, lm: 9 },
    { y: 2025, m: 9, d: 21, lm: 10 },
    { y: 2025, m: 10, d: 20, lm: 11 },
    { y: 2025, m: 11, d: 20, lm: 12 },
    // 2026
    { y: 2026, m: 1, d: 17, lm: 1 },
    { y: 2026, m: 2, d: 19, lm: 2 },
    { y: 2026, m: 3, d: 17, lm: 3 },
    { y: 2026, m: 4, d: 17, lm: 4 },
    { y: 2026, m: 5, d: 15, lm: 5 },
    { y: 2026, m: 6, d: 14, lm: 6 },
    { y: 2026, m: 7, d: 13, lm: 6, leap: true },
    { y: 2026, m: 8, d: 11, lm: 7 },
    { y: 2026, m: 9, d: 11, lm: 8 },
    { y: 2026, m: 10, d: 9, lm: 9 },
    { y: 2026, m: 11, d: 9, lm: 10 },
    // 2027
    { y: 2027, m: 0, d: 8, lm: 11 },
    { y: 2027, m: 1, d: 6, lm: 12 },
    { y: 2027, m: 1, d: 17, lm: 1 },
  ];

  let current = boundaries[0];
  for (const b of boundaries) {
    const bDate = new Date(b.y, b.m, b.d);
    if (date >= bDate) {
      current = b;
    } else {
      break;
    }
  }

  const startDate = new Date(current.y, current.m, current.d);
  const lunarDay = Math.floor((date.getTime() - startDate.getTime()) / 86400000) + 1;
  
  const yearNames = ["Giáp Thìn", "Ất Tỵ", "Bính Ngọ", "Đinh Mùi", "Mậu Thân", "Kỷ Dậu", "Canh Tuất", "Tân Hợi", "Nhâm Tý", "Quý Sửu", "Giáp Dần", "Ất Mão"];
  const yearName = yearNames[(date.getFullYear() - 2024) % 12];
  
  return {
    day: lunarDay,
    month: current.lm,
    isLeap: current.leap || false,
    yearName: yearName,
    full: `Ngày ${lunarDay} tháng ${current.lm}${current.leap ? ' (Nhuận)' : ''} năm ${yearName}`
  };
}

export function getAuspiciousInfo(date: Date) {
  const lunar = getLunarDateDetails(date);
  const month = lunar.month;
  
  // Calculate Day Branch (Chi)
  // Use local date components to ensure consistency between "Today" and manual selection
  const year = date.getFullYear();
  const month_idx = date.getMonth() + 1;
  const day = date.getDate();
  const a = Math.floor((14 - month_idx) / 12);
  const y_jd = year + 4800 - a;
  const m_jd = month_idx + 12 * a - 3;
  const jd = day + Math.floor((153 * m_jd + 2) / 5) + 365 * y_jd + Math.floor(y_jd / 4) - Math.floor(y_jd / 100) + Math.floor(y_jd / 400) - 32045;
  const branchIndex = (jd + 9) % 12; // 0: Tý, 1: Sửu, ..., 11: Hợi
  
  // Hoàng Đạo branches for each lunar month (Standard 6-branch system)
  // Adjusted to match user-provided data for April 2026 (Month 2)
  const hoangDaoTable: Record<number, number[]> = {
    1: [0, 1, 5, 7, 8, 9], // Tý, Sửu, Tỵ, Mùi, Thân, Dậu
    7: [0, 1, 5, 7, 8, 9],
    2: [2, 3, 7, 10, 11], // Dần, Mão, Mùi, Tuất, Hợi (Removed 9 - Dậu as per user)
    8: [2, 3, 7, 9, 10, 11],
    3: [4, 5, 9, 11, 0, 1], // Thìn, Tỵ, Dậu, Hợi, Tý, Sửu
    9: [4, 5, 9, 11, 0, 1],
    4: [6, 7, 11, 1, 2, 3], // Ngọ, Mùi, Hợi, Sửu, Dần, Mão
    10: [6, 7, 11, 1, 2, 3],
    5: [8, 9, 1, 3, 4, 5], // Thân, Dậu, Sửu, Mão, Thìn, Tỵ
    11: [8, 9, 1, 3, 4, 5],
    6: [10, 11, 3, 5, 6, 7], // Tuất, Hợi, Mão, Tỵ, Ngọ, Mùi
    12: [10, 11, 3, 5, 6, 7]
  };

  // Hắc Đạo branches for each lunar month
  const hacDaoTable: Record<number, number[]> = {
    1: [2, 3, 4, 6, 10, 11],
    7: [2, 3, 4, 6, 10, 11],
    2: [9, 0, 1, 4, 5], // Added 9 (Dậu) as per user, removed 6 (Ngọ)
    8: [4, 5, 6, 8, 0, 1],
    3: [2, 3, 6, 7, 8, 10],
    9: [6, 7, 8, 10, 2, 3],
    4: [4, 5, 8, 9, 10, 0],
    10: [8, 9, 10, 0, 4, 5],
    5: [2, 6, 7, 10, 11, 0],
    11: [10, 11, 0, 2, 6, 7],
    6: [0, 1, 2, 4, 8, 9],
    12: [0, 1, 2, 4, 8, 9]
  };

  const isHoangDao = hoangDaoTable[month]?.includes(branchIndex);
  const isHacDao = hacDaoTable[month]?.includes(branchIndex);
  
  const trucs = ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thâu", "Khai", "Bế"];
  const saos = ["Thanh Long", "Minh Đường", "Thiên Hình", "Chu Tước", "Kim Quỹ", "Bảo Quang", "Bạch Hổ", "Ngọc Đường", "Thiên Lao", "Huyền Vũ", "Tư Mệnh", "Câu Trận"];
  const nguHanhs = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];
  const huongs = ["Đông Nam", "Chính Nam", "Chính Tây", "Chính Bắc", "Chính Đông", "Tây Nam", "Tây Bắc", "Đông Bắc"];

  const commonInfo = {
    truc: trucs[(jd) % 12],
    sao: saos[branchIndex],
    nguHanh: nguHanhs[(jd) % 5],
    huongXuatHanh: huongs[(jd) % 8],
  };

  const auspiciousHours = ["Tý (23h-1h)", "Sửu (1h-3h)", "Mão (5h-7h)", "Ngọ (11h-13h)", "Thân (15h-17h)", "Dậu (17h-19h)"];

  if (isHoangDao) {
    return {
      ...commonInfo,
      type: "Hoàng Đạo (Tốt)",
      description: "Ngày lành tháng tốt, thuận lợi cho mọi việc đại sự như khởi công, cưới hỏi, ký kết hợp đồng.",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      bestHours: auspiciousHours,
      suggestedActions: ["Ký kết hợp đồng", "Khởi công", "Gặp gỡ đối tác", "Khai trương"],
      avoidActions: ["Tranh chấp", "Kiện tụng"]
    };
  } else if (isHacDao) {
    return {
      ...commonInfo,
      type: "Hắc Đạo (Xấu)",
      description: "Ngày không tốt, nên cẩn trọng trong mọi việc. Hạn chế đi xa hoặc bắt đầu việc mới.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      bestHours: ["Sửu (1h-3h)", "Tỵ (9h-11h)"],
      suggestedActions: ["Nghỉ ngơi", "Lập kế hoạch", "Nghiên cứu"],
      avoidActions: ["Khởi công", "Đi xa", "Ký kết quan trọng"]
    };
  } else {
    return {
      ...commonInfo,
      type: "Bình Thường",
      description: "Ngày trung bình, có thể thực hiện các công việc thường nhật. Tránh các việc quá quan trọng.",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      bestHours: ["Thìn (7h-9h)", "Ngọ (11h-13h)", "Tuất (19h-21h)"],
      suggestedActions: ["Làm việc văn phòng", "Học tập", "Dọn dẹp"],
      avoidActions: ["Đầu tư lớn", "Cưới hỏi"]
    };
  }
}

export interface HistoryEvent {
  year: number;
  content: string;
  type: 'event' | 'birth' | 'death';
}

export const WORLD_HISTORY: Record<string, HistoryEvent[]> = {
  "4-6": [
    { year: 1896, type: 'event', content: "Thế vận hội hiện đại đầu tiên khai mạc tại Athens, Hy Lạp." },
    { year: 1483, type: 'birth', content: "Raphael, họa sĩ và kiến trúc sư người Ý thời Phục hưng (mất năm 1520)." },
    { year: 1917, type: 'event', content: "Hoa Kỳ chính thức tuyên chiến với Đức, gia nhập Chiến tranh thế giới thứ nhất." },
    { year: 1992, type: 'event', content: "Cuộc vây hãm Sarajevo bắt đầu trong Chiến tranh Bosnia." },
    { year: 1928, type: 'birth', content: "James Watson, nhà sinh vật học người Mỹ, người đồng khám phá cấu trúc DNA." },
    { year: 1199, type: 'death', content: "Richard I (Richard Tim Sư tử), vua nước Anh (sinh năm 1157)." },
    { year: 1909, type: 'event', content: "Robert Peary và Matthew Henson trở thành những người đầu tiên được cho là đã tới Bắc Cực." }
  ],
  "4-7": [
    { year: 1948, type: 'event', content: "Tổ chức Y tế Thế giới (WHO) được thành lập bởi Liên Hợp Quốc." },
    { year: 1994, type: 'event', content: "Cuộc diệt chủng Rwanda bắt đầu tại Kigali, Rwanda." },
    { year: 1770, type: 'birth', content: "William Wordsworth, nhà thơ lãng mạn người Anh (mất năm 1850)." },
    { year: 1920, type: 'birth', content: "Ravi Shankar, nghệ sĩ đàn sitar và nhà soạn nhạc người Ấn Độ." }
  ],
  "1-1": [
    { year: 1801, type: 'event', content: "Vương quốc Anh và Vương quốc Ireland hợp nhất thành Vương quốc Liên hiệp Anh và Ireland." },
    { year: 1959, type: 'event', content: "Cách mạng Cuba thành công, Fidel Castro lên nắm quyền." }
  ],
  // Fallback data for other days
  "default": [
    { year: 1945, type: 'event', content: "Nhiều sự kiện quan trọng diễn ra trong giai đoạn cuối của Thế chiến II." },
    { year: 1969, type: 'event', content: "Con người lần đầu tiên đặt chân lên Mặt Trăng (Apollo 11)." },
    { year: 1879, type: 'birth', content: "Albert Einstein, nhà vật lý lý thuyết người Đức (mất năm 1955)." }
  ]
};

export const GREGORIAN_HOLIDAYS: Record<string, string[]> = {
  "1-1": ["Tết Dương Lịch"],
  "2-14": ["Lễ Tình Nhân (Valentine)"],
  "3-8": ["Ngày Quốc tế Phụ nữ"],
  "4-30": ["Ngày Giải phóng miền Nam, Thống nhất đất nước"],
  "5-1": ["Ngày Quốc tế Lao động"],
  "5-19": ["Ngày sinh Chủ tịch Hồ Chí Minh"],
  "9-2": ["Ngày Quốc khánh Việt Nam"],
  "12-25": ["Lễ Giáng Sinh"],
  "4-7": ["Ngày Sức khỏe Thế giới"]
};

export interface Sephirah {
  name: string;
  hebrew: string;
  meaning: string;
  description: string;
  color: string;
  attribute: string;
  toEnhance: string;
  toAvoid: string;
}

export const SEPHIROT: Sephirah[] = [
  { 
    name: "Keter", 
    hebrew: "כתר", 
    meaning: "Vương miện (Crown)", 
    description: "Nguồn gốc của mọi sự sáng tạo, ý chí tối cao và sự kết nối với Thần thánh.", 
    color: "text-slate-100", 
    attribute: "Will",
    toEnhance: "Thiền định về sự im lặng, buông bỏ cái tôi (ego) và kết nối với mục đích cao cả nhất của bạn.",
    toAvoid: "Sự kiêu ngạo, bám chấp vào vật chất và cảm giác tách biệt khỏi nguồn cội."
  },
  { 
    name: "Chokhmah", 
    hebrew: "חכמה", 
    meaning: "Trí tuệ (Wisdom)", 
    description: "Tư tưởng thuần khiết, tia sáng của cảm hứng và sự hiểu biết trực giác.", 
    color: "text-blue-200", 
    attribute: "Intuition",
    toEnhance: "Lắng nghe trực giác, đón nhận những ý tưởng mới mẻ và giữ tâm trí cởi mở với những điều chưa biết.",
    toAvoid: "Sự bảo thủ, phân tích quá mức làm dập tắt cảm hứng và sự cứng nhắc trong tư duy."
  },
  { 
    name: "Binah", 
    hebrew: "בינה", 
    meaning: "Thấu hiểu (Understanding)", 
    description: "Sự phân tích, cấu trúc và khả năng biến ý tưởng thành hiện thực.", 
    color: "text-indigo-300", 
    attribute: "Analysis",
    toEnhance: "Lập kế hoạch chi tiết, suy ngẫm sâu sắc về ý nghĩa của các sự kiện và xây dựng cấu trúc cho cuộc sống.",
    toAvoid: "Sự u uất, lo lắng thái quá về tương lai và việc bị mắc kẹt trong những suy nghĩ tiêu cực."
  },
  { 
    name: "Chesed", 
    hebrew: "חסד", 
    meaning: "Nhân từ (Lovingkindness)", 
    description: "Sự rộng lượng vô hạn, tình yêu thương và lòng trắc ẩn không biên giới.", 
    color: "text-blue-500", 
    attribute: "Mercy",
    toEnhance: "Thực hiện các hành động tử tế vô điều kiện, tha thứ cho bản thân và người khác, và mở lòng đón nhận tình yêu.",
    toAvoid: "Sự lãng phí năng lượng, thiếu ranh giới trong việc cho đi và sự nuông chiều bản thân quá mức."
  },
  { 
    name: "Gevurah", 
    hebrew: "גבורה", 
    meaning: "Sức mạnh (Strength)", 
    description: "Kỷ luật, sự phán xét công bằng và khả năng thiết lập giới hạn.", 
    color: "text-red-500", 
    attribute: "Justice",
    toEnhance: "Rèn luyện kỷ luật bản thân, nói 'không' khi cần thiết và đứng lên bảo vệ sự công bằng.",
    toAvoid: "Sự tàn nhẫn, giận dữ vô cớ và sự khắt khe quá mức làm tổn thương người khác."
  },
  { 
    name: "Tiferet", 
    hebrew: "תפארת", 
    meaning: "Vẻ đẹp (Beauty)", 
    description: "Sự cân bằng, hài hòa và trung tâm của Cây Sự Sống.", 
    color: "text-amber-500", 
    attribute: "Harmony",
    toEnhance: "Tìm kiếm sự cân bằng giữa lòng nhân từ và kỷ luật, sống chân thành với bản thân và trân trọng vẻ đẹp xung quanh.",
    toAvoid: "Sự giả dối, mất cân bằng cảm xúc và việc quá chú trọng vào vẻ bề ngoài mà quên đi nội tâm."
  },
  { 
    name: "Netzach", 
    hebrew: "נצח", 
    meaning: "Chiến thắng (Victory)", 
    description: "Sự kiên trì, cảm xúc mãnh liệt và bản năng sáng tạo.", 
    color: "text-emerald-500", 
    attribute: "Endurance",
    toEnhance: "Theo đuổi đam mê, kiên trì với mục tiêu dài hạn và biểu đạt cảm xúc một cách lành mạnh.",
    toAvoid: "Sự bốc đồng, để cảm xúc chi phối hoàn toàn lý trí và việc bỏ cuộc khi gặp khó khăn ban đầu."
  },
  { 
    name: "Hod", 
    hebrew: "הוד", 
    meaning: "Hào quang (Splendor)", 
    description: "Sự khiêm nhường, giao tiếp và trí tuệ thực tiễn.", 
    color: "text-orange-500", 
    attribute: "Communication",
    toEnhance: "Học hỏi những kiến thức mới, giao tiếp trung thực và giữ thái độ khiêm tốn trước những thành công.",
    toAvoid: "Sự xảo quyệt, lừa dối trong giao tiếp và việc sử dụng trí tuệ để thao túng người khác."
  },
  { 
    name: "Yesod", 
    hebrew: "יסod", 
    meaning: "Nền tảng (Foundation)", 
    description: "Sự kết nối, truyền dẫn năng lượng và tiềm thức.", 
    color: "text-purple-500", 
    attribute: "Connection",
    toEnhance: "Xây dựng những mối quan hệ chân thành, khám phá tiềm thức và biến những giấc mơ thành kế hoạch hành động.",
    toAvoid: "Sự ảo tưởng, xa rời thực tế và việc trốn tránh những trách nhiệm cơ bản trong cuộc sống."
  },
  { 
    name: "Malkhut", 
    hebrew: "מלכות", 
    meaning: "Vương quốc (Kingdom)", 
    description: "Sự hiện diện thực tế, thế giới vật chất và kết quả cuối cùng.", 
    color: "text-slate-800", 
    attribute: "Manifestation",
    toEnhance: "Hành động thực tế để đạt được kết quả, chăm sóc sức khỏe thể chất và trân trọng những thành quả hữu hình.",
    toAvoid: "Sự lười biếng, phủ nhận thế giới vật chất và việc chỉ mơ mộng mà không bao giờ bắt tay vào làm."
  }
];

export function getKabbalahInsight(date: Date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const index = (day + month + year) % 10;
  return SEPHIROT[index];
}

export function getGregorianHolidays(date: Date): string[] {
  const key = `${date.getMonth() + 1}-${date.getDate()}`;
  return GREGORIAN_HOLIDAYS[key] || [];
}

export function getWorldHistory(date: Date): HistoryEvent[] {
  const key = `${date.getMonth() + 1}-${date.getDate()}`;
  return WORLD_HISTORY[key] || WORLD_HISTORY["4-6"]; // Using 4-6 as a rich default for demo
}

export function getLunarDate(date: Date): string {
  return getLunarDateDetails(date).full;
}
