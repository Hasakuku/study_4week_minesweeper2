const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const rowsNum = document.querySelector('#rows')
const colsNum = document.querySelector('#cols')
const minesNum = document.querySelector('#mines')


//^^ 게임 세팅
function gameStart() {
  const rowNum = Number(rowsNum.value)
  const colNum = Number(colsNum.value)
  const mineNum = Number(minesNum.value)
  let mines = placeMines(mineNum, rowNum, colNum);  // row X col 셀과 mine개의 지뢰 세팅
  gameSet(mines);

  function gameSet(mineArr) {
    let tag = "<table border='1'>";
    for (let i = 0; i < mineArr.length; i++) {
      tag += "<tr>";
      for (let j = 0; j < mineArr[i].length; j++) {
        // 지뢰에 x,y 좌표 생성
        // mine 과 empty 클래스 삽입
        tag += `<td class="cell ${mineArr[i][j] === 1 ? 'mine' : 'empty'}">${i}.${j}</td>`;
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

//^^ 지뢰 랜덤 생성 함수
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

//^^ 셀 좌클릭 이벤트
function cellLeftEvent(numRows, numCols) {
  // let emptyCells = document.querySelectorAll('.empty'); // 지뢰가 없는 셀 접근
  let cells = document.querySelectorAll('#area td'); // 모든 셀 접근

  function cellStateInfo(row, col, callback) {
    for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, numRows - 1); i++) {
      for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, numCols - 1); j++) {
        let adjRow = document.querySelector(`tr:nth-child(${i + 1})`) // 인접 셀의 row 접근
        let adjCells = adjRow.querySelector(`td:nth-child(${j + 1})`) // 특정 row의 col 접근 -> 인접셀
        callback(adjCells);
      }
    }
  }

  cells.forEach(cell => { // 셀 순회
    cell.addEventListener('click', function () {
      if (this.classList.contains('cellNum') || this.classList.contains('flag') || this.classList.contains('mine')) return; // 숫자칸 클릭 방지

      let [row, col] = this.textContent.split('.').map(Number); // cell의 좌표 숫자로 변환
      let mineCount = 0; // 주변 지뢰 수 초기값

      cellStateInfo(row, col, (adjCell) => {
        if (adjCell.classList.contains('mine')) { // mine 클래스 존재시 카운트 증가
          mineCount++; // 클릭 셀 숫자 증가
        }
      });
      this.innerHTML = mineCount >= 1 ? mineCount : '';
      // 셀 이벤트
      if (this.textContent !== '') { // 주변에 지뢰가 있다면?
        this.classList.remove('cell', 'empty')
        this.classList.add('cellNum') // 숫자 추가
      } else {
        this.classList.remove('cell', 'empty') // 주변에 지뢰가 없다면?
        this.classList.add('clear') // 지뢰 없는것 확인

        cellStateInfo(row, col, (adjCell) => { //주변 셀 제거
          if (adjCell.classList.contains('empty')) {
            adjCell.click(); // 재귀적으로 클릭 이벤트 발생시킴
          }
        });
      }
    });
  });
}
//^^ 셀 우클릭 이벤트
function cellRightEvent() {
  let cells = document.querySelectorAll('#area td'); // 모든 셀 접근
  let mineRest = document.querySelector('.mineRest'); // 남은 지뢰 수 표시 요소에 접근
  const mineNum = Number(minesNum.value)
  mineRest.innerHTML = mineNum;
  cells.forEach(cell => { // 셀 순회
    cell.addEventListener('contextmenu', function (e) {
      e.preventDefault(); // 기본 우클릭 메뉴가 나타나지 않도록 함
      if (this.classList.contains('clear') || this.classList.contains('cellNum')) {
        return;  // 셀이 이미 오픈되어 있다면 아무 작업도 수행하지 않음
      }
      if (this.classList.contains('flag')) {
        this.classList.remove('flag'); // 셀에 깃발이 이미 있다면 깃발 제거
        mineRest.textContent = Number(mineRest.textContent) + 1; // 남은 지뢰 수 증가
      } else if (mineRest.textContent !== '0'){ // 남은 지뢰 숫자 음수 방지
        this.classList.add('flag');  // 셀에 깃발이 없다면 깃발 추가
        mineRest.textContent = Number(mineRest.textContent) - 1; // 남은 지뢰 수 감소
      }
    });
  });
}
//^^ 게임 종료
function gameFinish() {
  const cells = document.querySelectorAll('#area td'); // 모든 셀 접근
  const mineCells = document.querySelectorAll('.mine'); // 지뢰 셀 접근
  let result; // 승리(1), 패배(0)
  // 게임종료 이벤트
  function finishGame(message) {
    // 게임종료시 남은 지뢰 화면에 표시
    mineCells.forEach(cell => {
      cell.classList.remove('cell', 'mine'); // mine 클래스 제거
      if(result === 0) {cell.classList.add('mineExplo');} // 지뢰폭발 이미지 추가
      if(result === 1) {cell.classList.add('mineOpen');} // 지뢰 이미지 추가
    })
    // 게임 종료 메세지 출력
    setTimeout(() => {
      alert(message);
      // location.reload(); // 페이지 새로고침
      gameStart()
    }, 500);
  }

  cells.forEach(cell => {
    cell.addEventListener('click', function () {
      if (this.classList.contains('mine') && !this.classList.contains('flag')) { // 지뢰가 있는 셀이라면?
        result = 0;
        finishGame('게임패배! 당신은 바보입니다~'); // 게임종료
      }
      let emptyCells = document.querySelectorAll('.empty'); // 지뢰가 없는 셀 접근
      if (emptyCells.length === 0) { // 모든 빈 셀을 오픈?
        result = 1;
        finishGame('게임승리! 당신은 천재시군요!'); // 게임종료
      }
    })
  })
}

//^^게임 리셋버튼
function gameReset() {
  // 보드판 리셋
  let mineRest = document.querySelector('.mineRest');
  let area = document.querySelector('#area');
  area.innerHTML = '';
  mineRest.innerHTML = 0;
  //입력칸 리셋
  rowsNum.value = '';
  colsNum.value = '';
  minesNum.value = '';
}

startBtn.addEventListener('click', gameStart)
resetBtn.addEventListener('click', gameReset)
//////////////////////////////////////////


