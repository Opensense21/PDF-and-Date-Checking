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

export const SOLAR_TERMS = [
  "Xuân Phân", "Thanh Minh", "Cốc Vũ", "Lập Hạ", "Tiểu Mãn", "Mang Chủng",
  "Hạ Chí", "Tiểu Thử", "Đại Thử", "Lập Thu", "Xử Thử", "Bạch Lộ",
  "Thu Phân", "Hàn Lộ", "Sương Giáng", "Lập Đông", "Tiểu Tuyết", "Đại Tuyết",
  "Đông Chí", "Tiểu Hàn", "Đại Hàn", "Lập Xuân", "Vũ Thủy", "Kinh Trập"
];

export function getSolarTerm(date: Date): string {
  // Simplified calculation based on day of year
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = Math.floor((dayOfYear + 10) / 15.2) % 24;
  return SOLAR_TERMS[index];
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
  const baseDate = new Date(2024, 1, 10); // Tet 2024
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / 86400000);
  const lunarDay = (diffDays % 30) + 1;
  const lunarMonth = (Math.floor(diffDays / 30) % 12) + 1;
  const yearNames = ["Giáp Thìn", "Ất Tỵ", "Bính Ngọ", "Đinh Mùi", "Mậu Thân", "Kỷ Dậu", "Canh Tuất", "Tân Hợi", "Nhâm Tý", "Quý Sửu", "Giáp Dần", "Ất Mão"];
  const yearName = yearNames[(date.getFullYear() - 2024) % 12];
  
  return {
    day: lunarDay,
    month: lunarMonth,
    yearName: yearName,
    full: `Ngày ${lunarDay} tháng ${lunarMonth} năm ${yearName}`
  };
}

export function getAuspiciousInfo(date: Date) {
  // Mock logic: deterministic based on date
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const score = (day + month + year) % 10;
  
  if (score > 6) {
    return {
      type: "Hoàng Đạo (Tốt)",
      description: "Ngày lành tháng tốt, thuận lợi cho mọi việc đại sự như khởi công, cưới hỏi, ký kết hợp đồng.",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    };
  } else if (score > 3) {
    return {
      type: "Bình Thường",
      description: "Ngày trung bình, có thể thực hiện các công việc thường nhật. Tránh các việc quá quan trọng.",
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    };
  } else {
    return {
      type: "Hắc Đạo (Xấu)",
      description: "Ngày không tốt, nên cẩn trọng trong mọi việc. Hạn chế đi xa hoặc bắt đầu việc mới.",
      color: "text-red-600",
      bgColor: "bg-red-50"
    };
  }
}

export function getLunarDate(date: Date): string {
  return getLunarDateDetails(date).full;
}
