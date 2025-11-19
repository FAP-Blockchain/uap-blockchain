# 🎓 UAP Blockchain - Nền tảng Học thuật Đại học trên Blockchain

Dự án này là một hệ thống quản lý học thuật và xác thực bằng cấp được xây dựng trên nền tảng blockchain **Ethereum Quorum**. Mục tiêu là giải quyết các vấn đề của hệ thống quản lý truyền thống như thiếu minh bạch, dễ bị giả mạo và quy trình xác minh thủ công, tốn kém.

## ✨ Tính năng chính

Hệ thống được xây dựng dưới dạng các hợp đồng thông minh (Smart Contracts) có thể quản lý các khía cạnh khác nhau của hoạt động học thuật:

*   **[UniversityManagement.sol](contracts/UniversityManagement.sol):** Hợp đồng trung tâm điều phối toàn bộ hệ thống, quản lý người dùng và phân quyền (RBAC).
*   **[CredentialManagement.sol](contracts/CredentialManagement.sol):** Quản lý việc cấp phát, xác minh và thu hồi bằng cấp, chứng chỉ một cách bất biến.
*   **[GradeManagement.sol](contracts/GradeManagement.sol):** Ghi lại điểm số của sinh viên với quy trình phê duyệt rõ ràng.
*   **[AttendanceManagement.sol](contracts/AttendanceManagement.sol):** Theo dõi và lưu trữ dữ liệu điểm danh của sinh viên cho từng buổi học.
*   **[ClassManagement.sol](contracts/ClassManagement.sol):** Quản lý việc tạo lớp học và ghi danh sinh viên.

## 🛠️ Công nghệ sử dụng

*   **Blockchain:** Ethereum Quorum (Permissioned Network)
*   **Smart Contracts:** Solidity
*   **Môi trường phát triển:** Hardhat
*   **Thư viện:** Ethers.js, TypeChain
*   **Kiểm thử:** Mocha & Chai

## 🚀 Bắt đầu nhanh

1.  **Cài đặt các gói phụ thuộc:**
    ````bash
    npm install
    ````

2.  **Biên dịch Smart Contracts:**
    ````bash
    npm run compile
    ````

3.  **Chạy kiểm thử:**
    ````bash
    npm test
    ````

4.  **Triển khai lên mạng Quorum (local):**
    (Yêu cầu thiết lập mạng Quorum, xem trong [quorum-config/README.md](quorum-config/README.md))
    ````bash
    npm run deploy:quorum
    ````

Để biết thêm chi tiết về kiến trúc và quy trình triển khai, vui lòng xem các tài liệu trong thư mục `docs`:
*   [ARCHITECTURE.md](docs/ARCHITECTURE.md)
*   [DEPLOYMENT.md](docs/DEPLOYMENT.md)