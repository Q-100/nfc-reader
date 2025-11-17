# NFC Desktop Reader - ACR122

Electron과 nfc-pcsc 라이브러리를 사용하여 ACR122 리더기로 NFC 태그의 URL을 읽고 서버와 통신하는 데스크톱 애플리케이션입니다.

## 기능

- ACR122 NFC 리더기 자동 감지
- NFC 태그 읽기 (NTAG, Mifare, ISO 14443-4 등)
- NDEF 형식의 URL 파싱
- URL에서 tagId 추출 및 서버 전송
- 태그 이력 관리 (첫 번째 태그 vs 중복 태그)
- 음성 피드백 (성공/실패)
- 읽은 URL을 앱 내에서 표시
- 실시간 리더기 및 태그 상태 표시

## 프로젝트 구조

```
nfc-desktop-google-demoplay/
├── assets/
│   └── sounds/
│       ├── success.mp3  # 첫 태그 시 재생
│       └── fail.mp3     # 중복 태그 시 재생
├── main.js              # 메인 프로세스 (NFC 리더, 서버 통신)
├── preload.js           # IPC 브릿지
├── renderer.js          # 렌더러 프로세스 (UI 로직, 음성 재생)
├── index.html           # UI
└── package.json
```

## 요구사항

- Node.js (v16 이상)
- ACR122U NFC 리더기
- macOS / Windows / Linux

### macOS 추가 요구사항

macOS에서는 PC/SC 라이브러리가 기본으로 포함되어 있지만, 최신 버전이 필요할 수 있습니다.

## 설치 방법

1. 의존성 패키지 설치:

```bash
yarn install
```

2. 네이티브 모듈 빌드:

```bash
yarn rebuild
```

## 실행 방법

```bash
yarn start
```

## 사용 방법

1. ACR122 리더기를 컴퓨터에 연결합니다
2. 애플리케이션을 실행합니다
3. NFC 태그(424 DNA 태그 등)를 리더기에 가까이 댑니다
4. 앱에서 자동으로:
   - URL을 읽고 파싱
   - tagId를 추출하여 서버에 전송
   - 서버 응답에 따라 음성 재생
   - URL을 화면에 표시

## 서버 통신 (테스트 모드)

현재는 테스트 모드로 동작하며, 실제 서버 없이 로컬에서 태그 이력을 관리합니다:

- **첫 번째 태그**: `success.mp3` 재생
- **두 번째 이후 태그**: `fail.mp3` 재생

### 실제 서버 연동

`main.js`의 `sendTagToServer` 함수를 수정하여 실제 서버 URL로 교체하세요:

```javascript
async function sendTagToServer(tagId) {
  const response = await fetch("https://your-server.com/api/tag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagId }),
  });
  return await response.json();
}
```

## 지원하는 태그 형식

- ISO 14443-4 (424 DNA, DESFire 등)
- ISO 14443-3 (NTAG213/215/216)
- Mifare Classic
- Mifare Ultralight

## 문제 해결

### 리더기가 인식되지 않을 때

macOS:

```bash
# PC/SC 데몬 상태 확인
sudo launchctl list | grep pcscd

# PC/SC 데몬 재시작
sudo launchctl stop com.apple.security.pcscd
sudo launchctl start com.apple.security.pcscd
```

### 빌드 오류가 발생할 때

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules yarn.lock
yarn install
yarn rebuild
```

### 음성이 재생되지 않을 때

- `assets/sounds/` 폴더에 `success.mp3`, `fail.mp3` 파일이 있는지 확인
- 브라우저 콘솔에서 음성 재생 권한 확인

## 라이선스

ISC

## 참고

- [nfc-pcsc GitHub](https://github.com/pokusew/nfc-pcsc#readme)
- [Electron 공식 문서](https://www.electronjs.org/)
# nfc-reader
