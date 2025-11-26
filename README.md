# Book Bestsellers

**Book Bestsellers** is an app that provides weekly bestseller lists from multiple countries, including South Korea (KR), the United States (US), and Japan (JP). Users can easily access detailed information about each book, such as summaries and author profiles. Future features include bookmarking and translation options.

---

## Key Features

- **Country-specific Bestseller Lists**  
  View the weekly bestseller lists for South Korea, the United States, and Japan.

- **Book Information**  
  Access detailed book information such as summaries, author biographies, and more.

- **User-friendly Interface**  
  An intuitive design to easily browse and explore the latest bestsellers from different countries.

---

## 📁 프로젝트 구조

bestseller/
├── mobile/ # React Native 모바일 앱
│ ├── android/ # Android 네이티브 코드
│ ├── ios/ # iOS 네이티브 코드
│ ├── App.js # 앱 진입점
│ ├── MainScreen.js # 메인 화면 (국가별 탭, 북마크, 설정)
│ ├── SplashPage.js # 스플래시 화면
│ ├── Bookmark.js # 북마크 화면
│ ├── SettingsPage.js # 설정 화면
│ └── country/ # 국가별 상세 화면
│ ├── krdetail.js
│ ├── usdetail.js
│ └── jpdetail.js
│
├── server/ # Express API 서버
│ ├── index.js # 서버 진입점
│ ├── routes/ # API 라우트
│ │ ├── books.js # 책 목록 API
│ │ └── bookDetail.js # 책 상세 정보 API
│ └── services/ # 서비스 레이어
│ └── cache.js # JSON 캐시 읽기
│
└── backend/ # 배치 크롤러
├── scrappers/ # Puppeteer 크롤러
│ ├── aladinScrapper.js # 한국 (알라딘)
│ ├── kyoboScrapper.js # 한국 (교보문고)
│ ├── amazonScrapper.js # 미국/프랑스 (Amazon)
│ └── taiwanScrapper.js # 대만
└── json_results/ # 크롤링 결과 JSON 파일
├── aladin.json
├── kyobo.json
├── amazon.json
├── taiwan.json
└── gibert.json # 일본


---

## ✨ 주요 기능

### 📚 국가별 베스트셀러
- **한국 (KOR)**: 알라딘 베스트셀러
- **일본 (JPN)**: 기노쿠니야 베스트셀러
- **미국 (USA)**: Amazon 베스트셀러
- **대만 (TWN)**: Books.com.tw 베스트셀러
- **프랑스 (FRA)**: Amazon.fr 베스트셀러

### 📖 책 상세 정보
- 책 소개, 줄거리, 저자 정보
- 목차 (Table of Contents)
- 출판사 리뷰
- 원본 사이트 링크

### 🔖 북마크
- 관심 있는 책을 북마크로 저장
- AsyncStorage를 사용한 로컬 저장
- 북마크 화면에서 관리

### ⚙️ 설정
- 다크 모드 (준비 중)

---

## 🚀 시작하기

### 사전 요구사항
- Node.js >= 20
- React Native 개발 환경
- Android Studio (Android 개발용)
- Xcode (iOS 개발용, macOS만)

### 1. 서버 실행

cd server
npm install
npm start서버는 `http://localhost:4000`에서 실행됩니다.

**API 엔드포인트:**
- `GET /kr-books` - 한국 베스트셀러
- `GET /jp-books` - 일본 베스트셀러
- `GET /us-books` - 미국 베스트셀러
- `GET /tw-books` - 대만 베스트셀러
- `GET /fr-books` - 프랑스 베스트셀러
- `GET /kr-book-detail?url=...` - 책 상세 정보

### 2. 모바일 앱 실행

cd mobile
npm install
npm run android  # Android
# 또는
npm run ios      # iOS### 3. 배치 크롤러 실행 (선택사항)

주기적으로 최신 베스트셀러 데이터를 수집하려면:

cd backend/scrappers
node aladinScrapper.js    # 한국 (알라딘)
node kyoboScrapper.js     # 한국 (교보문고)
node amazonScrapper.js    # 미국/프랑스
node taiwanScrapper.js    # 대만크롤링 결과는 `backend/json_results/`에 JSON 파일로 저장되며, 서버는 이 파일을 우선적으로 사용합니다.

---

## 🛠 기술 스택

### Mobile
- **React Native** 0.82.1
- **React Navigation** - 화면 네비게이션
- **React Native Vector Icons** - 아이콘
- **AsyncStorage** - 로컬 데이터 저장

### Server
- **Express** 5.1.0 - REST API 서버
- **Puppeteer** - 실시간 크롤링 (폴백)
- **Cheerio** - HTML 파싱

### Backend
- **Puppeteer** - 배치 크롤링
- **Puppeteer Extra + Stealth Plugin** - 봇 탐지 회피

---

## 📊 데이터 흐름

1. **배치 크롤링**: `backend/scrappers/`의 스크립트가 주기적으로 실행되어 `backend/json_results/`에 JSON 저장
2. **API 요청**: 모바일 앱이 `server/`의 Express API 호출
3. **캐시 우선**: 서버는 `backend/json_results/`의 JSON 파일을 우선 사용
4. **실시간 폴백**: 캐시가 없으면 Puppeteer로 실시간 크롤링

---

## 📝 참고사항

- 서버는 `backend/json_results/`의 JSON 파일을 우선적으로 사용합니다
- 캐시가 없을 경우에만 실시간 크롤링을 수행합니다
- 모바일 앱은 Android 에뮬레이터에서 `10.0.2.2:4000`으로 서버에 접속합니다
- 북마크 데이터는 AsyncStorage에 로컬로 저장됩니다

---

## 🔮 향후 계획

- [ ] 다크 모드 완전 구현
- [ ] Google Cloud 배포
- [ ] 자동 크롤링 스케줄러
- [ ] 다국어 지원