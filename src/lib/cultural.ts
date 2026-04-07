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

// I Ching Hexagrams Data - Refined based on Thu Giang Nguyễn Duy Cần's philosophy
export const HEXAGRAM_NAMES = [
  "Thuần Càn", "Thuần Khôn", "Thủy Lôi Truân", "Sơn Thủy Mông", "Thủy Thiên Nhu", "Thiên Thủy Tụng", "Địa Thủy Sư", "Thủy Địa Tỷ",
  "Phong Thiên Tiểu Súc", "Thiên Trạch Lý", "Địa Thiên Thái", "Thiên Địa Bĩ", "Thiên Hỏa Đồng Nhân", "Hỏa Thiên Đại Hữu", "Địa Sơn Khiêm", "Lôi Địa Dự",
  "Trạch Lôi Tùy", "Sơn Phong Cổ", "Địa Trạch Lâm", "Phong Địa Quan", "Hỏa Lôi Phệ Hạp", "Sơn Hỏa Bí", "Sơn Địa Bác", "Địa Lôi Phục",
  "Thiên Lôi Vô Vọng", "Sơn Thiên Đại Súc", "Sơn Lôi Di", "Trạch Phong Đại Quá", "Thuần Khảm", "Thuần Ly", "Trạch Sơn Hàm", "Lôi Phong Hằng",
  "Thiên Sơn Độn", "Lôi Thiên Đại Tráng", "Hỏa Địa Tấn", "Địa Hỏa Minh Di", "Phong Hỏa Gia Nhân", "Hỏa Trạch Khuê", "Thủy Sơn Kiển", "Lôi Thủy Giải",
  "Sơn Trạch Tổn", "Phong Lôi Ích", "Trạch Thiên Quải", "Thiên Phong Cấu", "Trạch Địa Tụy", "Địa Phong Thăng", "Trạch Thủy Khốn", "Thủy Phong Tỉnh",
  "Trạch Hỏa Cách", "Hỏa Phong Đỉnh", "Thuần Chấn", "Thuần Cấn", "Phong Sơn Tiệm", "Lôi Trạch Quy Muội", "Lôi Hỏa Phong", "Hỏa Sơn Lữ",
  "Thuần Tốn", "Thuần Đoài", "Phong Thủy Hoán", "Thủy Trạch Tiết", "Phong Trạch Trung Phu", "Lôi Sơn Tiểu Quá", "Thủy Hỏa Ký Tế", "Hỏa Thủy Vị Tế"
];

export const HEXAGRAMS = [
  { id: 1, name: "Thuần Càn", symbol: "䷀", meaning: "Đạo của sự Sáng tạo và Tự cường. 'Thiên hành kiện, quân tử dĩ tự cường bất tức'.", imagery: "Sáu con rồng biểu thị các giai đoạn của sự phát triển. Cần biết lúc nào nên ẩn mình (Tiềm long), lúc nào nên hành động (Phi long)." },
  { id: 2, name: "Thuần Khôn", symbol: "䷁", meaning: "Đạo của sự Nhu thuận và Bao dung. 'Địa thế khôn, quân tử dĩ hậu đức tải vật'.", imagery: "Sức mạnh của đất mẹ, âm thầm nuôi dưỡng vạn vật mà không tranh công. Sự thành công đến từ việc biết phục tùng cái đúng." },
  { id: 3, name: "Thủy Lôi Truân", symbol: "䷂", meaning: "Sự gian nan lúc mới khởi đầu. Mầm sống đang tích lũy nội lực để vươn lên.", imagery: "Sấm sét and mưa gió đang giao tranh. Trong sự hỗn loạn, mầm mống của trật tự mới đang hình thành. Cần kiên trì và tìm người giúp đỡ." },
  { id: 4, name: "Sơn Thủy Mông", symbol: "䷃", meaning: "Sự mờ mịt, non nớt. Đạo của việc giáo dục và khai phóng tâm trí.", imagery: "Suối chảy dưới chân núi, sương mù bao phủ. Tượng trưng cho trí tuệ còn sơ khai, cần sự dẫn dắt đúng đắn và lòng ham học hỏi." },
  { id: 5, name: "Thủy Thiên Nhu", symbol: "䷄", meaning: "Đạo của sự Chờ đợi và Nuôi dưỡng niềm tin. Thời cơ chưa chín muồi.", imagery: "Mây tụ trên trời nhưng chưa mưa. Hãy ăn uống, vui vẻ và chuẩn bị nội lực. Đừng nôn nóng mà hỏng việc lớn." },
  { id: 6, name: "Thiên Thủy Tụng", symbol: "䷅", meaning: "Sự tranh chấp và bất đồng. Đạo của việc tìm kiếm sự trung dung, hòa giải.", imagery: "Trời và Nước đi ngược chiều nhau. Khi lòng người không đồng, tranh cãi nảy sinh. Kẻ trí biết dừng lại đúng lúc để tránh tai họa." },
  { id: 7, name: "Địa Thủy Sư", symbol: "䷆", meaning: "Đạo của sự Dẫn dắt và Kỷ luật. Sức mạnh của đám đông khi có minh chủ.", imagery: "Nước ẩn trong lòng đất. Tượng trưng cho sức mạnh quần chúng. Cần sự chính nghĩa và kỷ luật thép để đạt được mục đích." },
  { id: 8, name: "Thủy Địa Tỷ", symbol: "䷇", meaning: "Sự thân thiện và đoàn kết. Đạo của việc tìm kiếm sự đồng điệu.", imagery: "Nước chảy trên mặt đất, thấm nhuần và gắn kết. Người lãnh đạo cần đức độ để thu phục lòng người một cách tự nhiên." },
  { id: 9, name: "Phong Thiên Tiểu Súc", symbol: "䷈", meaning: "Sự tích lũy nhỏ. Sức mạnh của sự mềm mỏng và kiên nhẫn.", imagery: "Gió thổi trên trời cao. Mây chưa đủ dày để mưa. Cần tu chỉnh đức hạnh nhỏ để chuẩn bị cho những bước tiến lớn sau này." },
  { id: 10, name: "Thiên Trạch Lý", symbol: "䷉", meaning: "Đạo của sự Hành xử và Lễ độ. Cẩn trọng như dẫm lên đuôi hổ.", imagery: "Trời ở trên, Hồ ở dưới. Sự phân định tôn ti trật tự rõ ràng. Hành động đúng mực sẽ giúp vượt qua nguy hiểm một cách bình an." },
  { id: 11, name: "Địa Thiên Thái", symbol: "䷊", meaning: "Sự hanh thông và giao hòa. Thời kỳ thịnh vượng, âm dương tương tác.", imagery: "Trời hạ mình xuống dưới, Đất vươn lên trên. Khí thế giao nhau tạo nên sự sống. Hãy trân trọng và giữ gìn sự hòa hợp này." },
  { id: 12, name: "Thiên Địa Bĩ", symbol: "䷋", meaning: "Sự bế tắc và ly tán. Thời kỳ suy vi, tiểu nhân đắc thế.", imagery: "Trời và Đất xa rời nhau. Lòng người không thông, công việc đình trệ. Người quân tử nên ẩn mình để bảo toàn khí tiết." },
  { id: 13, name: "Thiên Hỏa Đồng Nhân", symbol: "䷌", meaning: "Đạo của sự Đại đồng. Đoàn kết dựa trên lý tưởng cao cả.", imagery: "Lửa sáng dưới bầu trời. Sự minh bạch và công tâm thu hút mọi người. Thành công đến từ việc mở rộng lòng mình với cộng đồng." },
  { id: 14, name: "Hỏa Thiên Đại Hữu", symbol: "䷍", meaning: "Sự sở hữu lớn lao. Đạo của việc giữ gìn sự giàu sang bằng đức độ.", imagery: "Mặt trời chiếu sáng giữa trời. Vạn vật đều hiển lộ. Cần sự khiêm tốn and sáng suốt để không bị sự thịnh vượng làm mờ mắt." },
  { id: 15, name: "Địa Sơn Khiêm", symbol: "䷎", meaning: "Đạo của sự Khiêm hạ. Càng cao quý càng nên nhún nhường.", imagery: "Núi ẩn dưới đất. Người có tài mà không khoe khoang, có công mà không tự mãn. Đây là quẻ tốt nhất trong 64 quẻ." },
  { id: 16, name: "Lôi Địa Dự", symbol: "䷏", meaning: "Sự vui vẻ và chuẩn bị. Đạo của việc thuận theo lòng người.", imagery: "Sấm vang trên mặt đất. Khơi dậy niềm vui và sự hăng hái. Cần có kế hoạch cụ thể để biến sự hào hứng thành kết quả thực tế." },
  { id: 17, name: "Trạch Lôi Tùy", symbol: "䷐", meaning: "Sự tùy thuận. Đi theo cái đúng, thuận theo thời thế.", imagery: "Sấm ở trong đầm. Người quân tử khi nghỉ ngơi thì vào trong nhà, khi hành động thì theo lẽ phải. Thành công đến từ sự linh hoạt." },
  { id: 18, name: "Sơn Phong Cổ", symbol: "䷑", meaning: "Sự đổ nát, hủ bại. Đạo của việc sửa chữa và đổi mới.", imagery: "Gió dừng dưới chân núi, không khí tù đọng sinh ra sâu bọ. Cần sự quyết tâm và phương pháp đúng đắn để chấn hưng lại sự nghiệp." },
  { id: 19, name: "Địa Trạch Lâm", symbol: "䷒", meaning: "Sự tiến đến, lớn mạnh. Thời kỳ phát triển đầy triển vọng.", imagery: "Đất ở trên đầm, bao dung và che chở. Người lãnh đạo cần gần gũi và dạy dỗ nhân dân. Tuy nhiên, cần đề phòng sự suy thoái sau đỉnh cao." },
  { id: 20, name: "Phong Địa Quan", symbol: "䷓", meaning: "Sự quan sát, xem xét. Đạo của việc tự soi rọi và làm gương.", imagery: "Gió thổi trên mặt đất. Vạn vật đều được chứng kiến. Người quân tử cần giữ tâm trong sáng để người khác nhìn vào mà cảm hóa." },
  { id: 21, name: "Hỏa Lôi Phệ Hạp", symbol: "䷔", meaning: "Sự cắn đứt, thực thi pháp luật. Đạo của việc loại bỏ chướng ngại.", imagery: "Sấm sét và chớp giật. Sự uy nghiêm của pháp luật giúp làm sáng tỏ mọi việc. Cần sự công minh và quyết đoán để duy trì trật tự." },
  { id: 22, name: "Sơn Hỏa Bí", symbol: "䷕", meaning: "Sự trang sức, vẻ đẹp bên ngoài. Đạo của việc coi trọng thực chất hơn hình thức.", imagery: "Lửa sáng dưới chân núi. Vẻ đẹp rực rỡ nhưng chỉ là tạm thời. Cần dùng sự trang sức để làm sáng tỏ đạo lý, thay vì che đậy sự trống rỗng." },
  { id: 23, name: "Sơn Địa Bác", symbol: "䷖", meaning: "Sự tiêu mòn, sụp đổ. Thời kỳ tiểu nhân lấn lướt quân tử.", imagery: "Núi bám vào đất, nhưng đang bị xói mòn. Không nên hành động lúc này. Hãy tĩnh lặng để bảo toàn nội lực và chờ đợi thời cơ." },
  { id: 24, name: "Địa Lôi Phục", symbol: "䷗", meaning: "Sự trở lại, hồi sinh. Ánh sáng hy vọng bắt đầu xuất hiện.", imagery: "Sấm vang trong lòng đất. Sự sống đang cựa mình trở lại. Cần sự kiên nhẫn và thận trọng trong những bước đi đầu tiên của chu kỳ mới." },
  { id: 25, name: "Thiên Lôi Vô Vọng", symbol: "䷘", meaning: "Sự chân thực, không vọng động. Thuận theo thiên lý.", imagery: "Sấm nổ dưới trời. Vạn vật đều tuân theo quy luật tự nhiên. Hành động không toan tính vụ lợi sẽ mang lại kết quả tốt đẹp bền vững." },
  { id: 26, name: "Sơn Thiên Đại Súc", symbol: "䷙", meaning: "Sự tích lũy lớn lao. Đạo của việc bồi đắp tri thức và đức hạnh.", imagery: "Trời ở trong núi. Sức chứa vô hạn. Người quân tử cần học hỏi không ngừng để làm giàu vốn sống và chuẩn bị cho những trọng trách lớn." },
  { id: 27, name: "Sơn Lôi Di", symbol: "䷚", meaning: "Sự nuôi dưỡng. Đạo của việc chăm sóc bản thân và người khác.", imagery: "Dưới núi có sấm. Tượng trưng cho cái miệng đang nhai. Cần chú trọng vào việc ăn uống lành mạnh và lời nói đúng mực." },
  { id: 28, name: "Trạch Phong Đại Quá", symbol: "䷛", meaning: "Sự quá mức, gánh nặng. Đạo của việc dũng cảm vượt qua thử thách.", imagery: "Đầm nước ngập cả cây. Tình thế nguy kịch nhưng cũng là cơ hội để bứt phá. Cần sự quyết đoán và không sợ hãi trước những thay đổi lớn." },
  { id: 29, name: "Thuần Khảm", symbol: "䷜", meaning: "Sự hiểm nguy, trùng điệp. Đạo của việc giữ tâm kiên định trong gian khó.", imagery: "Nước chảy không ngừng, vượt qua mọi hẻm vực. Cần lòng dũng cảm và sự chân thành để vượt qua những giai đoạn khó khăn nhất của cuộc đời." },
  { id: 30, name: "Thuần Ly", symbol: "䷝", meaning: "Sự sáng suốt, bám dựa. Đạo của việc tìm nơi nương tựa đúng đắn.", imagery: "Lửa cháy bùng lên. Ánh sáng soi rọi mọi ngóc ngách. Cần sự trung chính và bám sát vào những giá trị đạo đức để không bị thiêu rụi." },
  { id: 31, name: "Trạch Sơn Hàm", symbol: "䷞", meaning: "Sự cảm ứng, giao hòa. Đạo của tình yêu và sự thấu hiểu.", imagery: "Đầm trên núi cao. Sự tương tác tự nhiên giữa âm và dương. Thành công đến từ sự chân thành và không vụ lợi trong các mối quan hệ." },
  { id: 32, name: "Lôi Phong Hằng", symbol: "䷟", meaning: "Sự bền vững, lâu dài. Đạo của việc giữ vững lập trường.", imagery: "Sấm và Gió cùng hoạt động. Sự vận động không ngừng nhưng có quy luật. Cần sự kiên trì và bền bỉ để đạt được thành quả cuối cùng." },
  { id: 33, name: "Thiên Sơn Độn", symbol: "䷠", meaning: "Sự ẩn lui, rút lui. Đạo của việc biết dừng lại đúng lúc.", imagery: "Trời xa dần núi. Khi thời thế không thuận, người quân tử nên lui về để bảo toàn khí tiết và chờ đợi cơ hội khác." },
  { id: 34, name: "Lôi Thiên Đại Tráng", symbol: "䷡", meaning: "Sự lớn mạnh, uy thế. Đạo của việc sử dụng sức mạnh đúng mực.", imagery: "Sấm vang trên trời. Sức mạnh lừng lẫy. Cần sự chính trực và lễ độ để không biến sức mạnh thành sự bạo ngược." },
  { id: 35, name: "Hỏa Địa Tấn", symbol: "䷢", meaning: "Sự tiến lên, hiển lộ. Đạo của việc phát huy tài năng.", imagery: "Mặt trời mọc trên mặt đất. Ánh sáng lan tỏa khắp nơi. Đây là thời điểm thuận lợi để thăng tiến và khẳng định vị thế của bản thân." },
  { id: 36, name: "Địa Hỏa Minh Di", symbol: "䷣", meaning: "Sự tổn thương, che lấp. Đạo của việc giữ gìn ánh sáng trong bóng tối.", imagery: "Mặt trời lặn xuống lòng đất. Ánh sáng bị che khuất. Cần sự kiên nhẫn và khéo léo để bảo vệ lý tưởng trong hoàn cảnh khó khăn." },
  { id: 37, name: "Phong Hỏa Gia Nhân", symbol: "䷤", meaning: "Đạo của gia đình. Sự ổn định bắt đầu từ bên trong.", imagery: "Gió sinh ra từ lửa. Sự ấm áp và trật tự trong gia đình là nền tảng cho mọi thành công ngoài xã hội. Cần sự nghiêm túc và yêu thương." },
  { id: 38, name: "Hỏa Trạch Khuê", symbol: "䷥", meaning: "Sự mâu thuẫn, khác biệt. Đạo của việc tìm kiếm sự đồng nhất trong đa dạng.", imagery: "Lửa bốc lên, Nước đầm chảy xuống. Hai hướng ngược nhau. Cần sự bao dung và sáng suốt để hòa giải những bất đồng nhỏ." },
  { id: 39, name: "Thủy Sơn Kiển", symbol: "䷦", meaning: "Sự gian nan, ngăn trở. Đạo của việc biết dừng lại để suy ngẫm.", imagery: "Nước trên núi cao, đường đi hiểm trở. Không nên cố tiến lên. Hãy quay lại tìm kiếm sự giúp đỡ và hoàn thiện bản thân." },
  { id: 40, name: "Lôi Thủy Giải", symbol: "䷧", meaning: "Sự giải tỏa, tha thứ. Đạo của việc trút bỏ gánh nặng.", imagery: "Sấm và Mưa làm tan biến sự oi bức. Những khó khăn bắt đầu được tháo gỡ. Hãy nhanh chóng hành động và bao dung với lỗi lầm cũ." },
  { id: 41, name: "Sơn Trạch Tổn", symbol: "䷨", meaning: "Sự bớt đi, tổn thất. Đạo của việc hy sinh cái nhỏ để được cái lớn.", imagery: "Dưới núi có đầm. Nước đầm làm ẩm chân núi. Cần sự chân thành và biết tiết chế ham muốn cá nhân để đạt được sự tăng trưởng tâm linh." },
  { id: 42, name: "Phong Lôi Ích", symbol: "䷩", meaning: "Sự tăng thêm, lợi ích. Đạo của việc giúp người để giúp mình.", imagery: "Gió và Sấm cùng tăng cường sức mạnh. Thời điểm thuận lợi để thực hiện những kế hoạch lớn và giúp đỡ cộng đồng." },
  { id: 43, name: "Trạch Thiên Quải", symbol: "䷪", meaning: "Sự quyết liệt, vỡ lở. Đạo của việc loại bỏ cái xấu một cách dứt khoát.", imagery: "Nước đầm dâng lên tận trời. Tình thế không thể cứu vãn. Cần sự dũng cảm và công tâm để thực hiện những thay đổi cần thiết." },
  { id: 44, name: "Thiên Phong Cấu", symbol: "䷫", meaning: "Sự gặp gỡ bất ngờ. Đạo của việc đề phòng những ảnh hưởng tiêu cực.", imagery: "Gió thổi dưới trời. Sự tiếp xúc ngẫu nhiên. Cần cảnh giác với những cám dỗ hoặc những yếu tố không lành mạnh mới xuất hiện." },
  { id: 45, name: "Trạch Địa Tụy", symbol: "䷬", meaning: "Sự tụ họp, đoàn kết. Đạo của việc tập hợp sức mạnh.", imagery: "Đầm trên mặt đất. Nước tụ lại thành hồ lớn. Cần sự lãnh đạo sáng suốt và những mục tiêu chung để duy trì sự gắn kết lâu dài." },
  { id: 46, name: "Địa Phong Thăng", symbol: "䷭", meaning: "Sự bay lên, thăng tiến. Đạo của việc phát triển bền vững.", imagery: "Cây mọc lên từ lòng đất. Sự tăng trưởng chậm rãi nhưng chắc chắn. Cần sự kiên trì và không ngừng nỗ lực để đạt được đỉnh cao." },
  { id: 47, name: "Trạch Thủy Khốn", symbol: "䷮", meaning: "Sự khốn cùng, bế tắc. Đạo của việc giữ vững niềm tin trong nghịch cảnh.", imagery: "Đầm không có nước, cây cối khô héo. Tình thế cực kỳ khó khăn. Người quân tử cần dùng lời nói ít đi và hành động thực tế để vượt qua." },
  { id: 48, name: "Thủy Phong Tỉnh", symbol: "䷯", meaning: "Đạo của cái giếng. Sự cung cấp không ngừng và giá trị cốt lõi.", imagery: "Nước dưới cây. Giếng nước nuôi sống dân làng nhưng không bao giờ thay đổi vị trí. Cần giữ gìn phẩm chất đạo đức trong sạch." },
  { id: 49, name: "Trạch Hỏa Cách", symbol: "䷰", meaning: "Sự cải cách, thay đổi. Đạo của việc đổi mới theo đúng thời thế.", imagery: "Lửa trong đầm. Sự biến đổi mạnh mẽ. Cần sự chuẩn bị kỹ lưỡng và lòng tin của mọi người để cuộc cách mạng thành công." },
  { id: 50, name: "Hỏa Phong Đỉnh", symbol: "䷱", meaning: "Đạo của cái đỉnh. Sự thiết lập trật tự mới và nuôi dưỡng tài năng.", imagery: "Lửa dưới gỗ. Nấu thức ăn trong đỉnh. Tượng trưng cho sự ổn định, quyền lực và việc trọng dụng người hiền tài." },
  { id: 51, name: "Thuần Chấn", symbol: "䷲", meaning: "Sự chấn động, sấm sét. Đạo của việc tỉnh thức và hành động.", imagery: "Sấm nổ liên tiếp. Gây ra sự sợ hãi nhưng cũng làm vạn vật bừng tỉnh. Cần giữ tâm thái bình tĩnh để biến sự biến động thành cơ hội." },
  { id: 52, name: "Thuần Cấn", symbol: "䷳", meaning: "Sự dừng lại, tĩnh lặng. Đạo của việc làm chủ bản thân.", imagery: "Núi chồng lên núi. Sự bất động tuyệt đối. Cần biết lúc nào nên dừng lại và giữ cho tâm trí không bị xao động bởi ngoại cảnh." },
  { id: 53, name: "Phong Sơn Tiệm", symbol: "䷴", meaning: "Sự tiến triển tuần tự. Đạo của việc làm việc có kế hoạch.", imagery: "Cây mọc trên núi. Sự phát triển tự nhiên và vững chắc. Cần sự kiên nhẫn và tuân thủ các bước đi cần thiết để đạt được thành công bền vững." },
  { id: 54, name: "Lôi Trạch Quy Muội", symbol: "䷵", meaning: "Sự kết thúc không trọn vẹn. Đạo của việc cẩn trọng trong các mối quan hệ.", imagery: "Sấm trên đầm. Sự kết hợp vội vã và không đúng nguyên tắc. Cần xem xét lại các cam kết để tránh những rắc rối về sau." },
  { id: 55, name: "Lôi Hỏa Phong", symbol: "䷶", meaning: "Sự thịnh vượng, dồi dào. Đạo của việc chia sẻ sự giàu sang.", imagery: "Sấm và Chớp cùng xuất hiện. Ánh sáng rực rỡ. Cần sự công minh và rộng lượng để duy trì sự thịnh vượng lâu dài." },
  { id: 56, name: "Hỏa Sơn Lữ", symbol: "䷷", meaning: "Sự phiêu bạt, lữ khách. Đạo của việc thích nghi với hoàn cảnh mới.", imagery: "Lửa trên núi. Đám cháy lan nhanh và không có nơi dừng chân cố định. Cần sự khiêm tốn và cẩn trọng khi ở nơi đất khách quê người." },
  { id: 57, name: "Thuần Tốn", symbol: "䷸", meaning: "Sự nhu thuận, gió thổi. Đạo của việc thâm nhập và ảnh hưởng nhẹ nhàng.", imagery: "Gió thổi liên tiếp. Có thể len lỏi vào mọi ngóc ngách. Cần sự kiên trì và mục tiêu rõ ràng để tạo ra những thay đổi sâu sắc." },
  { id: 58, name: "Thuần Đoài", symbol: "䷹", meaning: "Sự vui vẻ, đầm ấm. Đạo của việc giao tiếp chân thành.", imagery: "Đầm nước liền nhau. Sự tươi mát và niềm vui lan tỏa. Cần giữ gìn sự chính trực trong lời nói để niềm vui được bền lâu." },
  { id: 59, name: "Phong Thủy Hoán", symbol: "䷺", meaning: "Sự tan biến, giải tỏa. Đạo của việc vượt qua sự chia rẽ.", imagery: "Gió thổi trên mặt nước làm tan sương mù. Cần sự đoàn kết và những lý tưởng chung để gắn kết mọi người lại với nhau." },
  { id: 60, name: "Thủy Trạch Tiết", symbol: "䷻", meaning: "Sự tiết chế, chừng mực. Đạo của việc đặt ra các giới hạn.", imagery: "Nước trong đầm. Nếu không có bờ sẽ tràn lan. Cần sự kỷ luật và biết điểm dừng để cuộc sống luôn ổn định và hài hòa." },
  { id: 61, name: "Phong Trạch Trung Phu", symbol: "䷼", meaning: "Sự chân thành, tin cậy. Đạo của việc cảm hóa bằng đức độ.", imagery: "Gió trên đầm nước. Sự thấu hiểu sâu sắc. Lòng chân thành có thể lay chuyển được cả những vật vô tri và tạo nên sự gắn kết tuyệt vời." },
  { id: 62, name: "Lôi Sơn Tiểu Quá", symbol: "䷽", meaning: "Sự quá mức nhỏ. Đạo của việc cẩn trọng trong những việc chi tiết.", imagery: "Sấm trên núi cao. Tiếng vang lớn nhưng không đi xa. Cần sự khiêm tốn và chú ý đến những điều nhỏ nhặt để tránh sai lầm lớn." },
  { id: 63, name: "Thủy Hỏa Ký Tế", symbol: "䷾", meaning: "Mọi việc đã hoàn tất. Đạo của việc giữ gìn thành quả.", imagery: "Nước ở trên lửa, sự cân bằng hoàn hảo. Nhưng 'vật cực tất phản', sau đỉnh cao là vực thẳm. Cần đề phòng sự chủ quan." },
  { id: 64, name: "Hỏa Thủy Vị Tế", symbol: "䷿", meaning: "Mọi việc chưa xong. Đạo của sự hy vọng và nỗ lực không ngừng.", imagery: "Lửa ở trên nước, chưa giao hòa. Tượng trưng cho sự biến đổi vĩnh cửu. Cuộc đời là một hành trình tiếp nối, không bao giờ kết thúc." }
];

// Binary representation to King Wen sequence index (1-based)
// Binary string is line 1 to line 6 (bottom to top)
const BINARY_TO_KING_WEN: Record<string, number> = {
  "111111": 1, "000000": 2, "100010": 3, "010001": 4, "111010": 5, "010111": 6, "010000": 7, "000010": 8,
  "111011": 9, "110111": 10, "111000": 11, "000111": 12, "101111": 13, "111101": 14, "001000": 15, "000100": 16,
  "100110": 17, "011001": 18, "110000": 19, "000011": 20, "100101": 21, "101001": 22, "000001": 23, "100000": 24,
  "100111": 25, "111001": 26, "100001": 27, "011110": 28, "010010": 29, "101101": 30, "001110": 31, "011100": 32,
  "001111": 33, "111100": 34, "000101": 35, "101000": 36, "101011": 37, "110101": 38, "001010": 39, "010100": 40,
  "110001": 41, "100011": 42, "111110": 43, "011111": 44, "011000": 45, "000110": 46, "010110": 47, "011010": 48,
  "101110": 49, "011101": 50, "100100": 51, "001001": 52, "001011": 53, "110100": 54, "101100": 55, "001101": 56,
  "011011": 57, "110110": 58, "010011": 59, "110010": 60, "110011": 61, "001100": 62, "101010": 63, "010101": 64
};

export function getHexagramByLines(lines: number[]) {
  // lines are 6, 7, 8, 9
  // 6, 8 -> Yin (0)
  // 7, 9 -> Yang (1)
  const binary = lines.map(l => (l % 2 === 0 ? '0' : '1')).join('');
  const id = BINARY_TO_KING_WEN[binary] || 1;
  const name = HEXAGRAM_NAMES[id - 1];
  
  // Find full info if exists
  const fullInfo = HEXAGRAMS.find(h => h.id === id);
  
  return {
    id,
    name,
    symbol: fullInfo?.symbol || "䷀",
    meaning: fullInfo?.meaning || "Triết lý về sự biến thông và hài hòa của vũ trụ.",
    imagery: fullInfo?.imagery || "Hình tượng tượng trưng cho sự vận động không ngừng của đạo trời."
  };
}

export interface FortunePillar {
  name: string;
  status: 'Mạnh' | 'Khá' | 'Trung bình' | 'Yếu';
  description: string;
}

export interface BatTuResult {
  personality: string;
  career: string;
  love: string;
  luck: string;
  advice: string;
  hexagramName: string;
  hexagramSymbol: string;
  fortunePillars: FortunePillar[];
  overallFortune: string;
}

export function getBatTuHaLac(birthDate: Date, birthHour: number): BatTuResult {
  // Simplified Bat Tu Ha Lac logic for the demo
  // In reality, this involves complex Can Chi conversions
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  // Deterministic seed based on birth info
  const seed = (year * 10000) + (month * 100) + day + birthHour;
  const index = seed % 64;
  const hexName = HEXAGRAM_NAMES[index];
  const hexInfo = HEXAGRAMS.find(h => h.name === hexName);
  
  // Calculate Fortune Pillars (Tam Cát)
  const thienCatVal = (seed % 10);
  const diaCatVal = ((seed >> 2) % 10);
  const nhanCatVal = ((seed >> 4) % 10);

  const getStatus = (val: number): 'Mạnh' | 'Khá' | 'Trung bình' | 'Yếu' => {
    if (val >= 8) return 'Mạnh';
    if (val >= 5) return 'Khá';
    if (val >= 3) return 'Trung bình';
    return 'Yếu';
  };

  const fortunePillars: FortunePillar[] = [
    {
      name: "Thiên Cát (Thiên Thời)",
      status: getStatus(thienCatVal),
      description: "Đại diện cho thời cơ, vận may từ trời và sự hỗ trợ từ quý nhân bên ngoài."
    },
    {
      name: "Địa Cát (Địa Lợi)",
      status: getStatus(diaCatVal),
      description: "Đại diện cho môi trường sống, nền tảng tài chính và sự ổn định của gia đình."
    },
    {
      name: "Nhân Cát (Nhân Hòa)",
      status: getStatus(nhanCatVal),
      description: "Đại diện cho sức mạnh nội tại, các mối quan hệ xã hội và sự hòa hợp trong giao tiếp."
    }
  ];

  const strongPillars = fortunePillars.filter(p => p.status === 'Mạnh' || p.status === 'Khá').length;
  let overallFortune = "";
  
  if (strongPillars === 3) {
    overallFortune = "Đại Cát Đại Lợi: Bạn sở hữu cả 3 trụ cột may mắn. Mọi việc hanh thông, dễ đạt thành tựu rực rỡ.";
  } else if (strongPillars === 2) {
    overallFortune = "Song Cát Tề Lai: Bạn có 2 trụ cột mạnh mẽ. Cuộc sống ổn định, có nhiều cơ hội phát triển tốt.";
  } else if (strongPillars === 1) {
    overallFortune = "Độc Cát Khởi Vận: Bạn có 1 trụ cột nổi trội. Hãy tập trung phát huy thế mạnh này để vượt qua khó khăn.";
  } else {
    overallFortune = "Tự Lực Cánh Sinh: Các trụ cột ở mức trung bình. Thành công đến từ sự nỗ lực bền bỉ của chính bản thân bạn.";
  }

  // Generate insights based on the hexagram and birth info
  const personalities = [
    "Bạn là người có ý chí kiên cường, luôn khao khát vươn lên và không ngại thử thách.",
    "Bạn sở hữu tâm hồn nhạy cảm, tinh tế và có khả năng thấu cảm sâu sắc với người khác.",
    "Bạn là người thực tế, kiên định và luôn có kế hoạch rõ ràng cho tương lai.",
    "Bạn mang trong mình nguồn năng lượng sáng tạo dồi dào và tư duy đổi mới.",
    "Bạn là người điềm tĩnh, sâu sắc và thường đưa ra những quyết định sáng suốt."
  ];
  
  const careers = [
    "Sự nghiệp của bạn sẽ thăng tiến mạnh mẽ nếu bạn biết nắm bắt thời cơ và kiên trì với mục tiêu.",
    "Bạn phù hợp với những công việc đòi hỏi sự tỉ mỉ, sáng tạo hoặc liên quan đến nghệ thuật.",
    "Khả năng lãnh đạo và quản lý sẽ giúp bạn đạt được những vị trí cao trong tổ chức.",
    "Bạn có duyên với kinh doanh và các lĩnh vực liên quan đến giao tiếp, kết nối.",
    "Sự nghiệp của bạn sẽ ổn định và phát triển bền vững dựa trên nền tảng tri thức vững chắc."
  ];
  
  const loves = [
    "Tình duyên của bạn thường đến muộn nhưng sẽ mang lại sự bình yên và hạnh phúc viên mãn.",
    "Bạn là người lãng mạn và luôn trân trọng những giá trị gia đình truyền thống.",
    "Trong tình yêu, bạn cần sự thấu hiểu và chia sẻ hơn là những lời hứa suông.",
    "Bạn có sức hút tự nhiên và thường gặp được những mối nhân duyên bất ngờ.",
    "Tình cảm của bạn phát triển dựa trên sự tin tưởng và tôn trọng lẫn nhau."
  ];
  
  const lucks = [
    "Năng lượng may mắn của bạn đang ở mức cao, đặc biệt là trong các vấn đề tài chính.",
    "Bạn thường gặp được quý nhân phù trợ vào những thời điểm quan trọng.",
    "May mắn của bạn đến từ sự nỗ lực tự thân và khả năng quan sát nhạy bén.",
    "Bạn có vận may trong việc học hành, thi cử và mở mang kiến thức.",
    "Năng lượng tích cực từ các mối quan hệ xã hội sẽ mang lại nhiều cơ hội cho bạn."
  ];
  
  const advices = [
    "Hãy học cách lắng nghe trực giác và giữ tâm thái bình thản trước mọi biến động.",
    "Kiên trì là chìa khóa thành công. Đừng bỏ cuộc khi gặp khó khăn bước đầu.",
    "Mở lòng hơn với những cơ hội mới và đừng ngần ngại thay đổi để phát triển.",
    "Chú trọng vào việc rèn luyện bản thân và giữ gìn sức khỏe tinh thần.",
    "Hãy luôn giữ chữ tín và lòng chân thành trong mọi mối quan hệ."
  ];

  return {
    personality: personalities[seed % personalities.length],
    career: careers[(seed + 1) % careers.length],
    love: loves[(seed + 2) % loves.length],
    luck: lucks[(seed + 3) % lucks.length],
    advice: advices[(seed + 4) % advices.length],
    hexagramName: hexName,
    hexagramSymbol: hexInfo?.symbol || "䷀",
    fortunePillars,
    overallFortune
  };
}

export function castHexagram() {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    // 3-coin method simulation
    // Head = 3, Tail = 2
    const c1 = Math.random() > 0.5 ? 3 : 2;
    const c2 = Math.random() > 0.5 ? 3 : 2;
    const c3 = Math.random() > 0.5 ? 3 : 2;
    lines.push(c1 + c2 + c3);
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
  const boundaries: { y: number, m: number, d: number, lm: number, leap?: boolean }[] = [
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
    { y: 2026, m: 7, d: 13, lm: 7 },
    { y: 2026, m: 8, d: 11, lm: 8 },
    { y: 2026, m: 9, d: 10, lm: 9 },
    { y: 2026, m: 10, d: 9, lm: 10 },
    { y: 2026, m: 11, d: 8, lm: 11 },
    // 2027
    { y: 2027, m: 0, d: 7, lm: 12 },
    { y: 2027, m: 1, d: 5, lm: 1 },
    { y: 2027, m: 2, d: 7, lm: 2 },
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
  const yearName = yearNames[((date.getFullYear() - 2024) % 12 + 12) % 12];
  
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
  const year = date.getFullYear();
  const month_idx = date.getMonth() + 1;
  const day = date.getDate();
  const a = Math.floor((14 - month_idx) / 12);
  const y_jd = year + 4800 - a;
  const m_jd = month_idx + 12 * a - 3;
  const jd = day + Math.floor((153 * m_jd + 2) / 5) + 365 * y_jd + Math.floor(y_jd / 4) - Math.floor(y_jd / 100) + Math.floor(y_jd / 400) - 32045;
  const branchIndex = (jd + 9) % 12; // 0: Tý, 1: Sửu, ..., 11: Hợi
  
  // 12 Stars (Thập Nhị Diệu)
  const saos = ["Thanh Long", "Minh Đường", "Thiên Hình", "Chu Tước", "Kim Quỹ", "Bảo Quang", "Bạch Hổ", "Ngọc Đường", "Thiên Lao", "Huyền Vũ", "Tư Mệnh", "Câu Trận"];
  
  // The starting branch for the 12-star cycle depends on the lunar month
  // Traditional rule for Thanh Long Hoàng Đạo starting points:
  // Month 1, 7: Thân (8)
  // Month 2, 8: Tuất (10)
  // Month 3, 9: Tý (0)
  // Month 4, 10: Dần (2)
  // Month 5, 11: Thìn (4)
  // Month 6, 12: Ngọ (6)
  const monthStartBranch = [0, 8, 10, 0, 2, 4, 6, 8, 10, 0, 2, 4, 6][month];
  const starIndex = (branchIndex - monthStartBranch + 12) % 12;
  const starName = saos[starIndex];

  // Hoàng Đạo stars: 0, 1, 4, 5, 7, 10
  const hoangDaoIndices = [0, 1, 4, 5, 7, 10];
  // Hắc Đạo stars: 2, 3, 6, 8, 9, 11
  const hacDaoIndices = [2, 3, 6, 8, 9, 11];

  const isHoangDao = hoangDaoIndices.includes(starIndex);
  const isHacDao = hacDaoIndices.includes(starIndex);
  
  // 12 Trực (Thập Nhị Trực)
  // Trực Kiến starts at the branch of the month
  // Month 1: Dần (2), Month 2: Mão (3), ..., Month 11: Tý (0), Month 12: Sửu (1)
  const trucs = ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thâu", "Khai", "Bế"];
  const monthBranch = (month + 1) % 12; // Month 1 -> 2 (Dần), Month 11 -> 0 (Tý), Month 12 -> 1 (Sửu)
  const trucIndex = (branchIndex - monthBranch + 12) % 12;
  const trucName = trucs[trucIndex];

  const nguHanhs = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];
  const huongs = ["Đông Nam", "Chính Nam", "Chính Tây", "Chính Bắc", "Chính Đông", "Tây Nam", "Tây Bắc", "Đông Bắc"];

  const commonInfo = {
    truc: trucName,
    sao: starName,
    nguHanh: nguHanhs[(jd) % 5],
    huongXuatHanh: huongs[(jd) % 8],
  };

  // Standard auspicious hours based on day branch
  const hoursTable: Record<number, string[]> = {
    0: ["Tý (23h-1h)", "Sửu (1h-3h)", "Mão (5h-7h)", "Ngọ (11h-13h)", "Thân (15h-17h)", "Dậu (17h-19h)"], // Tý
    1: ["Dần (3h-5h)", "Mão (5h-7h)", "Tỵ (9h-11h)", "Thân (15h-17h)", "Tuất (19h-21h)", "Hợi (21h-23h)"], // Sửu
    2: ["Tý (23h-1h)", "Sửu (1h-3h)", "Thìn (7h-9h)", "Tỵ (9h-11h)", "Mùi (13h-15h)", "Tuất (19h-21h)"], // Dần
    3: ["Tý (23h-1h)", "Dần (3h-5h)", "Mão (5h-7h)", "Ngọ (11h-13h)", "Mùi (13h-15h)", "Dậu (17h-19h)"], // Mão
    4: ["Dần (3h-5h)", "Thìn (7h-9h)", "Tỵ (9h-11h)", "Thân (15h-17h)", "Dậu (17h-19h)", "Hợi (21h-23h)"], // Thìn
    5: ["Sửu (1h-3h)", "Thìn (7h-9h)", "Ngọ (11h-13h)", "Mùi (13h-15h)", "Tuất (19h-21h)", "Hợi (21h-23h)"], // Tỵ
    6: ["Tý (23h-1h)", "Sửu (1h-3h)", "Mão (5h-7h)", "Ngọ (11h-13h)", "Thân (15h-17h)", "Dậu (17h-19h)"], // Ngọ
    7: ["Dần (3h-5h)", "Mão (5h-7h)", "Tỵ (9h-11h)", "Thân (15h-17h)", "Tuất (19h-21h)", "Hợi (21h-23h)"], // Mùi
    8: ["Tý (23h-1h)", "Sửu (1h-3h)", "Thìn (7h-9h)", "Tỵ (9h-11h)", "Mùi (13h-15h)", "Tuất (19h-21h)"], // Thân
    9: ["Tý (23h-1h)", "Dần (3h-5h)", "Mão (5h-7h)", "Ngọ (11h-13h)", "Mùi (13h-15h)", "Dậu (17h-19h)"], // Dậu
    10: ["Dần (3h-5h)", "Thìn (7h-9h)", "Tỵ (9h-11h)", "Thân (15h-17h)", "Dậu (17h-19h)", "Hợi (21h-23h)"], // Tuất
    11: ["Sửu (1h-3h)", "Thìn (7h-9h)", "Ngọ (11h-13h)", "Mùi (13h-15h)", "Tuất (19h-21h)", "Hợi (21h-23h)"]  // Hợi
  };

  const bestHours = hoursTable[branchIndex] || hoursTable[0];

  if (isHoangDao) {
    return {
      ...commonInfo,
      type: "Hoàng Đạo (Tốt)",
      description: `Ngày lành tháng tốt (${starName}), thuận lợi cho mọi việc đại sự như khởi công, cưới hỏi, ký kết hợp đồng.`,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      bestHours: bestHours,
      suggestedActions: ["Ký kết hợp đồng", "Khởi công", "Gặp gỡ đối tác", "Khai trương"],
      avoidActions: ["Tranh chấp", "Kiện tụng"]
    };
  } else if (isHacDao) {
    return {
      ...commonInfo,
      type: "Hắc Đạo (Xấu)",
      description: `Ngày không tốt (${starName}), nên cẩn trọng trong mọi việc. Hạn chế đi xa hoặc bắt đầu việc mới.`,
      color: "text-red-600",
      bgColor: "bg-red-50",
      bestHours: bestHours,
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
      bestHours: bestHours,
      suggestedActions: ["Làm việc văn phòng", "Học tập", "Dọn dẹp"],
      avoidActions: ["Đầu tư lớn", "Cưới hỏi"]
    };
  }
}

export function searchAuspiciousDays(month: number, year: number, type?: 'Hoàng Đạo' | 'Hắc Đạo') {
  const results = [];
  // Ensure we handle the month correctly (1-12)
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const info = getAuspiciousInfo(date);
    const lunar = getLunarDateDetails(date);
    
    if (!type || info.type.includes(type)) {
      results.push({
        solarDate: `${d}/${month}/${year}`,
        lunarDate: `${lunar.day}/${lunar.month}${lunar.isLeap ? ' (Nhuận)' : ''}`,
        type: info.type,
        sao: info.sao,
        truc: info.truc
      });
    }
  }
  return results;
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
