/**
 * Các hàm tiện ích để định dạng dữ liệu.
 */

/**
 * Định dạng thời gian cho tin nhắn.
 * Trả về HH:mm hoặc Tên Thứ/Ngày tùy vào độ cũ của thời gian.
 */
export const formatMessageTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const isToday = d.toDateString() === now.toDateString();
  
  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const isThisWeek = now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  if (isThisWeek) {
    const days = ['Chủ Nhật', 'T.Hai', 'T.Ba', 'T.Tư', 'T.Năm', 'T.Sáu', 'T.Bảy'];
    return days[d.getDay()];
  }
  
  return d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
};

/**
 * Định dạng tiền tệ Việt Nam (VNĐ).
 * Ví dụ: 1000000 -> 1.000.000 đ
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + ' đ';
};

/**
 * Định dạng phần trăm tăng giảm.
 * Ví dụ: 0.05 -> +5%
 */
export const formatPercent = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${(percent * 100).toFixed(1)}%`;
};
