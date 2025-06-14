# BUILD PC TRUONG PHAT COMPUTER

This is a PC building tool that helps users configure custom PC builds based on their budget, CPU preference, and gaming needs.

## GitHub Pages Setup

This project is configured to run on GitHub Pages with Jekyll support.

### How to Deploy

1. Create a new repository on GitHub.
2. Upload all the files from this project to the repository.
3. Go to the repository settings.
4. Navigate to "Pages" in the settings sidebar.
5. Set the source to the main branch and choose either the root folder or the `/docs` folder (if you move files there).
6. Click "Save".
7. Your site will be published at `https://<username>.github.io/<repository-name>/`.

### Local Development

To run this project locally with Jekyll:

1. Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/) if you don't have it.
2. Install Jekyll and Bundler:
   ```
   gem install jekyll bundler
   ```
3. Navigate to the project folder and run:
   ```
   bundle install
   bundle exec jekyll serve
   ```
4. Access the site at `http://localhost:4000`.

## Features

- Dynamic PC component selection
- Budget-based configuration
- CPU type selection (Intel/AMD)
- Game-specific optimization
- Component compatibility checks
- Detailed configuration table
- Offline support with Service Worker
- Mobile-responsive design

## Files and Structure

- `index.html` - Main application
- `buildsan.js` - Core functionality
- `components-data.js` - Component database
- `service-worker.js` - Offline functionality
- `clear-cache.js` - Cache management
- `_config.yml` - Jekyll configuration

## License

Copyright © 2025 TRUONG PHAT COMPUTER. All rights reserved.

## Tính năng

- Chọn ngân sách phù hợp
- Lựa chọn CPU (Intel hoặc AMD)
- Chọn game muốn chơi
- Tự động gợi ý cấu hình phù hợp
- Hiển thị bảng chi tiết cấu hình với giá thành
- Tùy chỉnh các linh kiện theo nhu cầu
- Tính toán tổng chi phí

## Hướng dẫn sử dụng

1. Chọn ngân sách phù hợp
2. Chọn loại CPU muốn sử dụng (Intel hoặc AMD)
3. Chọn game mà bạn muốn chơi
4. Nhấn "Tự Động Chọn Cấu Hình" để hệ thống gợi ý cấu hình phù hợp
5. Xem chi tiết cấu hình trong bảng
6. Tùy chỉnh các linh kiện nếu muốn
7. Nhấn "HIỆN BẢNG CẤU HÌNH CHI TIẾT" để xem cấu hình chi tiết

## Cài đặt và chạy

### Phương pháp 1: Mở trực tiếp

Mở tệp tin `index.html` trong trình duyệt để sử dụng ứng dụng.

### Phương pháp 2: Sử dụng máy chủ cục bộ

1. Cài đặt [Node.js](https://nodejs.org/)
2. Chạy tệp tin `start-server.bat` (Windows) hoặc `start-server.ps1` (PowerShell)
3. Mở trình duyệt và truy cập địa chỉ: http://localhost:3000

## Gửi thay đổi lên GitHub

Nếu bạn muốn gửi các thay đổi lên GitHub:

1. Cài đặt [Git](https://git-scm.com/downloads)
2. Chạy tệp tin `upload-to-github.bat` (Windows) hoặc `upload-to-github.ps1` (PowerShell)
3. Làm theo hướng dẫn trên màn hình

## Liên hệ

- Hotline: 0836768597
- Facebook: [TRUONG PHAT COMPUTER](https://www.facebook.com/tpcom.hb)

## Bản quyền

© 2025 TRUONG PHAT COMPUTER. All rights reserved.

## Cấu trúc dự án

1. `index.html`: Tệp tin HTML chính
2. `buildsan.css` và `styles.css`: Tệp tin CSS chính cho giao diện
3. `buildsan.js`: Mã JavaScript chính
4. `components-data.js`: Dữ liệu về các linh kiện
5. `config-table.html`: Phiên bản độc lập của bảng cấu hình
6. Các tệp tin hỗ trợ khác cho tính năng và giao diện

## Khắc phục sự cố

### Bảng cấu hình không hiển thị

Nếu bảng cấu hình không hiển thị khi bạn nhấn các nút tương ứng, hãy thử các cách sau:

1. Nhấn nút "HIỆN BẢNG CẤU HÌNH CHI TIẾT" màu đỏ ở giữa trang
2. Nhấn nút "HIỂN THÀNG CẤU HÌNH" ở góc phải dưới màn hình
3. Làm mới trang và thử lại
4. Mở file `config-table.html` để xem phiên bản độc lập của bảng cấu hình
