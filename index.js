const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const rowsNum = document.querySelector('#rows')
const colsNum = document.querySelector('#cols')
const minesNum = document.querySelector('#mines')


// 게임 세팅
function gameStart() {
  const rowNum = Number(rowsNum.value)
  const colNum = Number(colsNum.value)
  const mineNum = Number(minesNum.value)
  // const mineRest = document.querySelector('mineRest')
  let mines = placeMines(mineNum, rowNum, colNum);  // row X col 셀과 mine개의 지뢰 세팅
  gameSet(mines);

  function gameSet(mineArr) {
    let tag = "<table border='1'>";
    for (let i = 0; i < mineArr.length; i++) {
      tag += "<tr>";
      for (let j = 0; j < mineArr[i].length; j++) {
        // 지뢰에 x,y 좌표 생성
        // mine 과 empty 클래스 삽입
        tag += `<td class="${mineArr[i][j] === 1 ? 'mine' : 'empty'}">${i}.${j}</td>`;
      }
      tag += "</tr>";
    }
    tag += "</table>";
    area.innerHTML = tag;
  }
  cellLeftEvent(rowNum, colNum)
  cellRightEvent()
  gameFinish()
}

// 지뢰 랜덤 생성 함수
function placeMines(numMines, numRows, numCols) {
  // 지뢰 초기화
  let mineArr = Array(numRows).fill().map(() => Array(numCols).fill(0));
  // 지뢰 랜덤 생성
  for (let i = 0; i < numMines; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * numRows); // 지뢰 x좌표
      col = Math.floor(Math.random() * numCols); // 지뢰 y좌표
    } while (mineArr[row][col] === 1); // 지뢰 유무
    mineArr[row][col] = 1; // 지뢰생성
  }
  return mineArr;
}

// 셀 좌클릭 이벤트
function cellLeftEvent(numRows, numCols) {
  let emptyCells = document.querySelectorAll('.empty'); // 지뢰가 없는 셀 접근
  emptyCells.forEach(cell => { // 셀 순회
    cell.addEventListener('click', function () {
      let [row, col] = this.textContent.split('.').map(Number); // cell의 좌표 숫자로 변환
      let count = 0; // 주변 지뢰 수 초기값
      for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, numRows - 1); i++) { // 인접 셀의 x범위
        for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, numCols - 1); j++) { // 인접 셀의 y범위
          let xAdj = document.querySelector(`tr:nth-child(${i + 1})`) // 인접 셀 x좌표 접근
          let yAdj = xAdj.querySelector(`td:nth-child(${j + 1})`) // 인접 셀 x좌표의 y좌표 접근
          if (yAdj.classList.contains('mine')) { // mine 클래스 존재시 카운트 증가
            count++;
          }
        }
      }
      this.textContent = count >= 1 ? count : '';
      if (this.textContent !== '') { // 숫자가 있다면?
        this.classList.remove('empty')
        this.classList.add('cellNum') // 숫자 색상 추가
      } else {
        this.classList.remove('empty')
        this.classList.add('clear')
      }

    });
  });
}
// 셀 우클릭 이벤트
function cellRightEvent() {
  let cells = document.querySelectorAll('#area td'); // 모든 셀 접근
  let mineRest = document.querySelector('.mineRest'); // 남은 지뢰 수 표시 요소 접근
  const mineNum = Number(minesNum.value)
  mineRest.innerHTML = mineNum;
  cells.forEach(cell => { // 셀 순회
    cell.addEventListener('contextmenu', function (e) {
      e.preventDefault(); // 기본 우클릭 메뉴가 나타나지 않도록 함
      if (this.classList.contains('mineExplo') || this.classList.contains('cellNum')) {
        // 셀이 이미 오픈되어 있다면 아무 작업도 수행하지 않음
        return;
      }
      if (this.classList.contains('flag')) {
        // 셀에 깃발이 이미 있다면 깃발 제거
        this.classList.remove('flag');
        mineRest.textContent = Number(mineRest.textContent) + 1; // 남은 지뢰 수 증가
      } else {
        // 셀에 깃발이 없다면 깃발 추가
        this.classList.add('flag');
        mineRest.textContent = Number(mineRest.textContent) - 1; // 남은 지뢰 수 감소
      }
    });
  });
}

//게임종료 
function gameFinish() {
  let cells = document.querySelectorAll('#area td'); // 지뢰가 없는 셀 접근
  let mineCells = document.querySelectorAll('.mine'); // 지뢰 셀 접근
  // 지뢰를 클릭하면 게임 종료
  mineCells.forEach(cell => {
    cell.addEventListener('click', function () {
        this.classList.remove('mine'); // mine 클래스 제거
        this.classList.add('mineExplo'); // minExplo 클래스 추가(지뢰터짐 이미지)
      setTimeout(() => {
        alert('게임패배! 지뢰를 클릭하셨습니다.');
        location.reload(); // 페이지 새로고침
      }, 100)

    });
  });
  // 모든 빈 셀을 오픈하면 게임 종료
  cells.forEach(cell => {
    cell.addEventListener('click', function () {
      let emptyCells = document.querySelectorAll('.empty'); // 지뢰가 없는 셀 접근
      if (emptyCells.length === 0) {
        console.log(emptyCells.length)
        setTimeout(() => {
          alert('게임승리! 게임을 클리어하셨습니다.');
          location.reload(); // 페이지 새로고침
        }, 100)
      }
    })
  })
}


//게임 리셋버튼
function gameReset() {
  // 보드판 리셋
  let area = document.querySelector('#area');
  area.innerHTML = '';
  //입력칸 리셋
  rowsNum.value = '';
  colsNum.value = '';
  minesNum.value = '';
}

startBtn.addEventListener('click', gameStart)
resetBtn.addEventListener('click', gameReset)
//////////////////////////////////////////


