// 로컬 스토리지에서 방명록 데이터를 불러오기
window.addEventListener('DOMContentLoaded', loadGuestbook);

// 방명록 폼과 리스트 DOM 참조
const guestbookForm = document.getElementById('guestbookForm');
const guestbookList = document.getElementById('guestbookList');

// 방명록 제출 이벤트 리스너
guestbookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const message = document.getElementById('guestMessage').value.trim();

  if (name && message) {
    const newEntry = { id: Date.now(), name, message };
    saveGuestbookEntry(newEntry);
    addGuestbookEntryToList(newEntry);
    guestbookForm.reset();
  }
});

// 방명록 항목을 로컬 스토리지에 저장
function saveGuestbookEntry(entry) {
  let entries = JSON.parse(localStorage.getItem('guestbook')) || [];
  entries.push(entry);
  localStorage.setItem('guestbook', JSON.stringify(entries));
}

// 저장된 방명록 데이터를 불러와 화면에 표시
function loadGuestbook() {
  const entries = JSON.parse(localStorage.getItem('guestbook')) || [];
  entries.forEach((entry) => addGuestbookEntryToList(entry));
}

// 방명록 항목을 리스트에 추가하고 삭제 버튼 생성
function addGuestbookEntryToList(entry) {
  const listItem = document.createElement('li');
  listItem.setAttribute('data-id', entry.id);
  listItem.innerHTML = `
    <span>${entry.name}: ${entry.message} 🎉</span>
    <button class="delete-button">❌ 삭제</button>
  `;
  guestbookList.appendChild(listItem);

  // 삭제 버튼 이벤트 리스너 추가
  listItem.querySelector('.delete-button').addEventListener('click', () => {
    deleteGuestbookEntry(entry.id);
  });
}

// 방명록 항목 삭제 및 로컬 스토리지 업데이트
function deleteGuestbookEntry(id) {
  let entries = JSON.parse(localStorage.getItem('guestbook')) || [];
  entries = entries.filter((entry) => entry.id !== id);
  localStorage.setItem('guestbook', JSON.stringify(entries));

  // 화면에서 항목 삭제
  const listItem = document.querySelector(`li[data-id="${id}"]`);
  if (listItem) {
    guestbookList.removeChild(listItem);
  }
}
// 달력 요소 DOM 참조
const calendarDays = document.getElementById('calendarDays');
const monthYear = document.getElementById('monthYear');

// 결혼식 날짜를 2024년 10월 21일로 설정
let weddingDate = new Date('2024-10-21');

// 현재 달력 상태를 추적하기 위한 변수
let currentMonth = weddingDate.getMonth(); // 10월
let currentYear = weddingDate.getFullYear(); // 2024년

// 초기 달력 불러오기
window.addEventListener('DOMContentLoaded', () => {
  loadCalendar(currentMonth, currentYear);
  updateSelectedDateDisplay(); // 결혼식 날짜 표시 초기화
});

// 달력 생성 함수
function loadCalendar(month, year) {
  calendarDays.innerHTML = ''; // 기존 날짜 초기화
  const firstDay = new Date(year, month).getDay(); // 첫째 날의 요일
  const totalDays = new Date(year, month + 1, 0).getDate(); // 해당 월의 총 일수

  monthYear.textContent = `${year}년 ${month + 1}월`;

  // 첫 주의 빈 칸 채우기
  for (let i = 0; i < firstDay; i++) {
    calendarDays.innerHTML += '<div class="empty-day"></div>';
  }

  // 날짜를 채우기
  for (let day = 1; day <= totalDays; day++) {
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('calendar-day');
    dateDiv.textContent = day;

    // 결혼식 날짜 강조
    if (
      day === weddingDate.getDate() &&
      month === weddingDate.getMonth() &&
      year === weddingDate.getFullYear()
    ) {
      dateDiv.classList.add('wedding-day');
    }

    // 날짜 클릭 시 결혼식 날짜 변경 이벤트
    dateDiv.addEventListener('click', () => {
      weddingDate = new Date(year, month, day); // 새로운 결혼식 날짜 설정
      updateSelectedDateDisplay(); // 날짜 표시 업데이트
      loadCalendar(month, year); // 달력 다시 그리기
    });

    calendarDays.appendChild(dateDiv);
  }
}

// 선택된 결혼식 날짜 표시 업데이트 함수
function updateSelectedDateDisplay() {
  const selectedDateElement = document.getElementById('selectedDate');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  selectedDateElement.textContent = weddingDate.toLocaleDateString('ko-KR', options);
}

// 월 변경 함수
function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  loadCalendar(currentMonth, currentYear);
}
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousedown', (e) => {
      item.style.cursor = 'grabbing'; // 드래그 중 커서 변경
      let shiftX = e.clientX - item.getBoundingClientRect().left;

      const moveAt = (pageX) => {
          item.style.left = pageX - shiftX + 'px';
      }

      const onMouseMove = (e) => {
          moveAt(e.pageX);
      }

      document.addEventListener('mousemove', onMouseMove);

      item.onmouseup = () => {
          document.removeEventListener('mousemove', onMouseMove);
          item.onmouseup = null;
          item.style.cursor = 'grab'; // 드래그 종료 시 커서 변경
      };
  });

  item.ondragstart = () => false; // 드래그 시작 방지
});
let startX, scrollLeft;

const gallery = document.querySelector('.gallery-container');

gallery.addEventListener('mousedown', (e) => {
    startX = e.pageX - gallery.offsetLeft; // 시작 위치
    scrollLeft = gallery.scrollLeft; // 현재 스크롤 위치
    gallery.style.cursor = 'grabbing'; // 드래그 커서 변경
    gallery.addEventListener('mousemove', mouseMove);
});

gallery.addEventListener('mouseup', () => {
    gallery.style.cursor = 'grab'; // 기본 커서로 복원
    gallery.removeEventListener('mousemove', mouseMove); // 드래그 이벤트 제거
});

gallery.addEventListener('mouseleave', () => {
    gallery.style.cursor = 'grab'; // 기본 커서로 복원
    gallery.removeEventListener('mousemove', mouseMove); // 드래그 이벤트 제거
});

function mouseMove(e) {
    const x = e.pageX - gallery.offsetLeft; // 현재 위치
    const walk = (x - startX) * 1; // 드래그 거리
    gallery.scrollLeft = scrollLeft - walk; // 스크롤 이동
}
