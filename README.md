# ![Logo](./assets/logo.png) 
<h1><img src="https://emojis.slackmojis.com/emojis/images/1531849430/4246/blob-sunglasses.gif?1531849430" width="30"/> 40 - 21005711 - Mai Quốc Trưởng - Subproject4</h1>

> **Bài tập lớn React Lập Trình Thiết Bị Di Động**
<h4>Sử dụng những công nghệ sau:</h4>
<p>
  <img alt="React" src="https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=white" />
  <img alt="Expo" src="https://img.shields.io/badge/-Expo-1B1F1B?style=flat-square&logo=expo&logoColor=white" />
  <img alt="Visual Studio Code" src="https://img.shields.io/badge/-Visual%20Studio%20Code-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white" />
  <img alt="git" src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white" />
  <img alt="npm" src="https://img.shields.io/badge/-NPM-CB3837?style=flat-square&logo=npm&logoColor=white" />
  <img alt="Nodejs" src="https://img.shields.io/badge/-Nodejs-43853d?style=flat-square&logo=Node.js&logoColor=white" />
</p>

---

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Yêu Cầu](#yêu-cầu)
- [Cài Đặt](#cài-đặt)
- [API](#api)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Sử Dụng](#sử-dụng)
- [Modals](#modals)
- [Liên Hệ](#liên-hệ)

---

## 🎉 Giới Thiệu

Dự án **E-Commercial Market** là một ứng dụng đặt hàng được phát triển bằng **React Native**. Ứng dụng cho phép người dùng đặt hàng, xóa hàng, và điều chỉnh số lượng đơn hàng trong giỏ hàng và thực hiện thanh toán.

![App Screenshot](./assets/1110_2_.gif)

---

## 📌 Yêu Cầu

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau:

- **Mobile Simulator**: Tải và cài đặt từ [Chrome Web Store](https://chromewebstore.google.com/detail/mobile-simulator-responsi/ckejmhbmlajgoklhgbapkiccekfoccmk).
  
  ![Mobile Simulator](https://lh3.googleusercontent.com/2j5aTV0zdY4-if24IerwQlyMyuzd4sEuWL116G5Aq3vhKT3FGX7FtQV7moRLS-P9qK23WhMVCxiHVH3CL1DJ8V04caQ=s1280-w1280-h800)

- **Node.js**: Tải và cài đặt từ [nodejs.org](https://nodejs.org/).

  ![Node.js](https://nodejs.org/static/images/logo.svg)

- **Git**: Tải và cài đặt từ [git-scm.com](https://git-scm.com/).

  ![Git](https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png)
  
- **npm**:

    ```bash
    npm -v
    ```
  ![npm](https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1024px-Npm-logo.svg.png)
  
- **Expo CLI**: Cài đặt Expo CLI toàn cục bằng lệnh:

    ```bash
    npm install -g expo-cli
    ```

  ![Expo CLI](https://images.viblo.asia/full/7321932b-aeae-41c1-9978-89d4e9526472.png)

---

## 🛠️ Cài Đặt

1. Clone repository này:

    ```bash
    git clone https://github.com/MaiQuocTruong/40_21005711_MaiQuocTruong_REACT_SubProject4.git
    ```

2. Điều hướng đến thư mục của project:

    ```bash
    cd 40_21005711_MaiQuocTruong_REACT_SubProject4
    ```

3. Cài đặt dependencies:

    ```bash
    npm i
    ```

4. Khởi động server phát triển Expo:

    ```bash
    npx expo start
    ```

---

## 🌐 API

Dự án có sử dụng **JSON Server** để quản lý dữ liệu sản phẩm và giỏ hàng.

### Sử dụng JSON Server

1. Cài đặt JSON Server toàn cục:

    ```bash
    npm install -g json-server
    ```

2. Khởi động JSON Server với file `db.json`:

    ```bash
    json-server --watch db.json --port 3000
    ```
---

## 🚀 Chạy Ứng Dụng

1. Sử dụng ứng dụng **Expo** (có sẵn trên iOS/Android) để quét mã QR hiển thị trên terminal hoặc trình duyệt.
2. Hoặc sử dụng trình giả lập/emulator để chạy ứng dụng.

---

## 🗂️ Cấu Trúc Dự Án

Dự án tuân theo cấu trúc tiêu chuẩn của **React Native**. Một số thư mục và file quan trọng:

- **`/assets`**: Chứa tất cả các tài nguyên như hình ảnh sử dụng trong ứng dụng.
- **`/contexts/CartContext.js`**: Quản lý trạng thái giỏ hàng (add, remove, clear) trên ứng dụng.
- **`/components`**: Thư mục chứa các component như là FeedbackModal, Footer, ModalFilter và ReviewsSummary.
- **`/screens`**: Thư mục chứa các screen (giao diện) của ứng dụng.

---

## 🛒 Sử Dụng

1. **Thêm Sản Phẩm vào Giỏ Hàng**: Người dùng có thể thêm sản phẩm vào giỏ hàng.
2. **Điều Chỉnh Số Lượng Sản Phẩm**: Khi đã có sản phẩm trong giỏ, người dùng có thể xóa sản phẩm khỏi giỏ.
3. **Thanh Toán**: Người dùng có thể tiến hành thanh toán, xác nhận phương thức thanh toán và nhận thông báo thành công.

---

## 🔄 Modals

Ứng dụng sử dụng nhiều modal để nâng cao trải nghiệm người dùng:

- **Xác Nhận Xóa Sản Phẩm**: Hiển thị khi người dùng muốn giảm số lượng về 0 hoặc xóa sản phẩm.
- **Xác Nhận Thanh Toán**: Hiển thị khi người dùng tiến hành thanh toán.
- **Thanh Toán Thành Công**: Xác nhận thanh toán thành công và làm rỗng giỏ hàng.
- **Giỏ Hàng Trống**: Thông báo khi người dùng cố gắng thanh toán mà giỏ hàng trống.
- **Feedback Modal**: Thông báo khi người dùng đã thanh toán thành công và hiển thị modal feedback lên cho người dùng muốn feedback.
- **Filter Modal**: Hiển thị modal filter lên cho người dùng ấn vào button filter (chủ yếu là để lọc sản phẩm theo đơn giá).
---

## 📧 Liên Hệ

Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ:

- **Email**: maiqtruong2403@gmail.com or nguyennthanhtung0900@gmail.com
- **GitHub**: [MaiQuocTruong](https://github.com/MaiQuocTruong)

---

**Cảm ơn bạn đã sử dụng dự án này!**

![Thank You](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2dtejc1bm1nNDJrdnU0ZW1zcTFkdzlpb3VrYWNoMXA3b2h4OThsbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/scZPhLqaVOM1qG4lT9/giphy.webp)