// DOM 요소
const readerStatus = document.getElementById("readerStatus");
const readerStatusValue = document.getElementById("readerStatusValue");
const tagDisplay = document.getElementById("tagDisplay");
const tagIdValue = document.getElementById("tagIdValue");
const tagMessage = document.getElementById("tagMessage");
const instruction = document.getElementById("instruction");
const errorDiv = document.getElementById("error");
const historyList = document.getElementById("historyList");
const boothSelect = document.getElementById("boothSelect");
const selectedBoothValue = document.getElementById("selectedBoothValue");

// 태그 이력 저장
const tagHistoryMap = new Map();

// 현재 선택된 부스
let currentBoothId = "";
let currentBoothName = "";

// 부스 선택 이벤트
boothSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  if (value) {
    currentBoothId = value;
    currentBoothName = e.target.options[e.target.selectedIndex].text;
    selectedBoothValue.textContent = currentBoothName;
    selectedBoothValue.style.color = "#28a745";

    // 메인 프로세스에 부스 선택 전달
    window.nfcAPI.setBooth(currentBoothId, currentBoothName);

    console.log(`부스 선택됨: ${currentBoothId} - ${currentBoothName}`);
  } else {
    currentBoothId = "";
    currentBoothName = "";
    selectedBoothValue.textContent = "없음";
    selectedBoothValue.style.color = "#667eea";

    // 메인 프로세스에 빈 부스 전달
    window.nfcAPI.setBooth("", "");
  }
});

// 리더기 상태 업데이트
window.nfcAPI.onReaderStatus((data) => {
  if (data.status === "connected") {
    readerStatus.classList.remove("disconnected");
    readerStatusValue.textContent = `연결됨: ${data.name}`;
  } else {
    readerStatus.classList.add("disconnected");
    readerStatusValue.textContent = "연결 끊김";
  }
});

// 카드 감지
window.nfcAPI.onCardDetected((data) => {
  console.log("카드 감지:", data);

  // 안내 메시지 숨김
  instruction.style.display = "none";

  // 에러 메시지 숨김
  errorDiv.classList.remove("active");
});

// 카드 제거
window.nfcAPI.onCardRemoved(() => {
  console.log("카드 제거됨");

  // UI 초기화
  setTimeout(() => {
    tagDisplay.classList.remove("active");
    instruction.style.display = "block";
  }, 500);
});

// URL 감지 (tagId 없는 경우)
window.nfcAPI.onUrlDetected((data) => {
  console.log("URL 감지:", data.url);
  showError("tagId를 찾을 수 없습니다");
});

// 데이터 읽기 (URL이 아닌 경우)
window.nfcAPI.onDataRead((data) => {
  console.log("데이터 읽기:", data);
  showError(`데이터 읽음 (HEX): ${data.hex.substring(0, 100)}...`);
});

// 에러 처리
window.nfcAPI.onError((data) => {
  console.error("에러:", data.message);
  showError(data.message);
});

// 태그 처리 완료 (서버 응답)
window.nfcAPI.onTagProcessed((data) => {
  console.log("태그 처리 완료:", data);

  // Tag ID 표시
  tagDisplay.classList.add("active");
  tagIdValue.textContent = data.tagId;

  // 메시지 표시
  tagMessage.textContent = data.serverResponse.message;

  // success 필드로 판단 (API 응답 기준)
  const isSuccess = data.serverResponse.success;
  tagMessage.className = "tag-message " + (isSuccess ? "success" : "fail");

  // 태그 이력에 추가
  addToHistory(data, isSuccess);

  // 3초 후 메시지 제거
  setTimeout(() => {
    tagMessage.textContent = "";
    tagMessage.className = "tag-message";
  }, 3000);
});

// 음성 재생
window.nfcAPI.onPlaySound((data) => {
  console.log("음성 재생:", data.soundPath);

  const audio = new Audio(data.soundPath);
  audio.play().catch((err) => {
    console.error("음성 재생 실패:", err);
  });
});

// 태그 이력에 추가
function addToHistory(data, isSuccess) {
  const tagId = data.tagId;

  // 이력 업데이트
  if (tagHistoryMap.has(tagId)) {
    const history = tagHistoryMap.get(tagId);
    history.count++;
    history.lastTaggedAt = new Date();
    history.lastSuccess = isSuccess;
  } else {
    tagHistoryMap.set(tagId, {
      count: 1,
      firstTaggedAt: new Date(),
      lastTaggedAt: new Date(),
      lastSuccess: isSuccess,
    });
  }

  // 이력 목록 갱신
  updateHistoryList();
}

// 이력 목록 갱신
function updateHistoryList() {
  historyList.innerHTML = "";

  // 최신 태그순으로 정렬
  const sortedEntries = Array.from(tagHistoryMap.entries()).sort(
    (a, b) => b[1].lastTaggedAt - a[1].lastTaggedAt
  );

  sortedEntries.forEach(([tagId, history]) => {
    const item = document.createElement("div");
    item.className =
      "history-item " + (history.lastSuccess ? "success" : "fail");

    const tagIdDiv = document.createElement("div");
    tagIdDiv.className = "history-tag-id";
    tagIdDiv.textContent = tagId;

    const timeDiv = document.createElement("div");
    timeDiv.className = "history-time";
    timeDiv.textContent = formatTime(history.lastTaggedAt);

    const countDiv = document.createElement("div");
    countDiv.className = "history-count";
    countDiv.textContent = `태그 횟수: ${history.count}회`;

    item.appendChild(tagIdDiv);
    item.appendChild(timeDiv);
    item.appendChild(countDiv);

    historyList.appendChild(item);
  });
}

// 시간 포맷
function formatTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // 초 단위

  if (diff < 60) {
    return `${diff}초 전`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}분 전`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}시간 전`;
  } else {
    return date.toLocaleString("ko-KR");
  }
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.add("active");

  // 5초 후 자동으로 숨김
  setTimeout(() => {
    errorDiv.classList.remove("active");
  }, 5000);
}
