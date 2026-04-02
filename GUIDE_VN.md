# Hướng dẫn Phát triển Dự án Mobile (Premium)

Dự án đã được nâng cấp lên tiêu chuẩn cao cấp với **Font Outfit**, hệ màu **Modern Slate/Indigo**, và cấu trúc thư mục chuẩn hóa tuyệt đối.

## 📁 Cấu trúc Thư mục Chuẩn
- `app/`: Routing và Layout (Sử dụng Expo Router).
- `features/`: Logic theo tính năng (Chat, Timeline, v.v.).
  - `components/`: UI đặc thù của tính năng.
  - `hooks/`: **Bắt buộc** đưa toàn bộ logic/API vào đây.
- `components/common/`: Shared Components (`AppText`, `AppAvatar`, `AppButton`).
- `types/`: **Bắt buộc** định nghĩa toàn bộ Interface/Type tại đây.
- `constants/`: Hằng số hệ thống và `Theme.ts`.
- `utils/`: Các hàm Helper dùng chung (ví dụ: `format.ts`).

## 🎨 Design System (Theme)
- **Font**: Sử dụng font **Outfit** hiện đại. Áp dụng thông qua `AppText`.
- **Colors**: Bảng màu Slate hiện đại kết hợp Indigo Primary. Không được sử dụng mã màu hex trực tiếp trong component.

## 🛠 Nguyên tắc Phát triển
1. **Không code logic trong UI**: Toàn bộ dữ liệu, filter, xử lý sự kiện phải nằm trong Hook.
2. **Type Safety**: Mọi dữ liệu phải có interface trong folder `types/`. Không sử dụng `any`.
3. **Common Helpers**: Nếu một hàm được dùng ở 2 nơi trở lên, phải đưa vào `utils/`.
4. **Absolute Imports**: Luôn sử dụng `@/` để import.

## 🚀 Cách chạy dự án
1. `npm install`
2. `npx expo start`
3. Quét mã QR bằng ứng dụng **Expo Go**.

---
*Dự án được thiết kế để dễ dàng bảo trì và mở rộng tính năng mà không làm hỏng cấu trúc tổng thể.*
