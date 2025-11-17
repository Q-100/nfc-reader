# 빌드 가이드

이 문서는 NFC Tag Reader 앱을 macOS와 Windows용으로 빌드하는 방법을 설명합니다.

## 사전 준비

### 1. electron-builder 설치

```bash
yarn add -D electron-builder
```

또는

```bash
yarn install
```

### 2. 네이티브 모듈 리빌드

```bash
yarn rebuild
```

## 빌드 명령어

### macOS용 빌드

현재 macOS에서 실행:

```bash
yarn build:mac
```

출력: `dist/NFC Tag Reader-1.0.0.dmg`

- Intel Mac (x64)
- Apple Silicon (arm64)
- Universal 바이너리

### Windows용 빌드

Windows에서 실행하거나 크로스 플랫폼 빌드 (제한적):

```bash
yarn build:win
```

출력: `dist/NFC Tag Reader Setup 1.0.0.exe`

### 모든 플랫폼 빌드

```bash
yarn build:all
```

**참고**: macOS에서 Windows용 빌드는 제한적입니다.
최상의 결과를 위해서는 각 플랫폼에서 빌드하는 것을 권장합니다.

## 빌드 옵션

### 개발 빌드 (빠른 테스트)

```bash
yarn build --dir
```

설치 파일 없이 실행 가능한 앱만 생성합니다.

### 특정 아키텍처만 빌드

```bash
# macOS arm64만 (Apple Silicon)
yarn build:mac -- --arm64

# macOS x64만 (Intel)
yarn build:mac -- --x64
```

## 빌드 결과물

빌드가 완료되면 `dist/` 폴더에 다음 파일들이 생성됩니다:

### macOS

- `NFC Tag Reader-1.0.0.dmg` - 설치용 DMG 파일
- `NFC Tag Reader-1.0.0-arm64.dmg` - Apple Silicon용
- `NFC Tag Reader-1.0.0-x64.dmg` - Intel Mac용

### Windows

- `NFC Tag Reader Setup 1.0.0.exe` - 설치 프로그램
- `NFC Tag Reader 1.0.0.exe` - 실행 파일

## 배포

### macOS 배포 시 주의사항

1. **코드 서명 (선택사항)**

   - Apple Developer 계정 필요
   - `package.json`의 `build.mac`에 서명 설정 추가

2. **Notarization (선택사항)**
   - macOS Catalina 이상에서 필요
   - Apple Developer 계정으로 공증 필요

### Windows 배포 시 주의사항

1. **드라이버 요구사항**

   - 사용자는 PC/SC 드라이버를 설치해야 함
   - ACR122 리더기 드라이버 별도 설치 필요

2. **설치 파일**
   - NSIS 설치 프로그램 제공
   - 사용자가 설치 위치 선택 가능
   - 바탕화면 및 시작 메뉴 바로가기 생성

## 아이콘 추가 (선택사항)

앱 아이콘을 추가하려면:

1. `assets/icon.icns` (macOS용, 1024x1024)
2. `assets/icon.ico` (Windows용, 256x256)

아이콘 없이도 빌드는 가능하지만, 기본 일렉트론 아이콘이 사용됩니다.

## 문제 해결

### 네이티브 모듈 에러

```bash
yarn rebuild
yarn build
```

### 빌드 캐시 문제

```bash
rm -rf dist
rm -rf node_modules/.cache
yarn build
```

### macOS에서 Windows 빌드 시

macOS에서 Windows용 빌드는 Wine이 필요할 수 있습니다:

```bash
brew install wine-stable
```

하지만 가장 좋은 방법은 Windows에서 직접 빌드하는 것입니다.

## CI/CD

GitHub Actions를 사용한 자동 빌드 설정이 필요하면 별도 문의하세요.

## 추가 정보

- [electron-builder 문서](https://www.electron.build/)
- [코드 서명 가이드](https://www.electron.build/code-signing)
