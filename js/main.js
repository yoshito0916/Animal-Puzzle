'use strict';

(() => {
  class PuzzleRenderer {
    constructor(puzzle, canvas) {
      this.puzzle = puzzle;
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.TILE_SIZE = 70;
      this.img = document.createElement('img');
      this.img.src = 'img/animal3.png';
      this.img.addEventListener('load', () => {
        this.render();
      });
      this.canvas.addEventListener('click', e => {
        if (this.puzzle.getCompletedStatus()) {
          return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left) / this.TILE_SIZE);
        const row = Math.floor((e.clientY - rect.top) / this.TILE_SIZE);
        this.puzzle.swapTiles(col, row);
        this.render();

        if (this.puzzle.isComplete()) {
          this.puzzle.setCompletedStatus(true);
          this.renderGameClear();
        }
      });
    }

    renderGameClear() {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = '28px Arial';
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText('GAME CLEAR!!', 40, 150);
    }

    render() {
      for (let row = 0; row < this.puzzle.getBoardSize(); row++) {
        for (let col = 0; col < this.puzzle.getBoardSize(); col++) {
          this.renderTile(this.puzzle.getTile(row, col), col, row);
        }
      }
    }

    renderTile(n, col, row) {
      if (n === this.puzzle.getBlankIndex()) {
        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(
          col * this.TILE_SIZE, 
          row * this.TILE_SIZE, 
          this.TILE_SIZE, 
          this.TILE_SIZE
        );
      } else {
        this.ctx.drawImage(
          this.img,
          (n % this.puzzle.getBoardSize()) * this.TILE_SIZE, 
          Math.floor(n / this.puzzle.getBoardSize()) * this.TILE_SIZE, 
          this.TILE_SIZE, 
          this.TILE_SIZE,
          col * this.TILE_SIZE, 
          row * this.TILE_SIZE, 
          this.TILE_SIZE, 
          this.TILE_SIZE
          );
        }
      }
    }
    
    class Puzzle {
      constructor(level) {
        this.level = level;
        this.tiles = [
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [8, 9, 10, 11],
          [12, 13, 14, 15],
        ];
        this.UDLR = [
          [0, -1], // up
          [0, 1], // down
          [-1, 0], // left
          [1, 0], // right
        ];
        this.isCompleted = false;
        this.BOARD_SIZE = this.tiles.length;
        this.BLANK_INDEX = this.BOARD_SIZE ** 2 - 1;
        do {
          this.shuffle(this.level);
        } while (this.isComplete());
      }
  
      getBoardSize() {
        return this.BOARD_SIZE;
      }

      getBlankIndex() {
        return this.BLANK_INDEX;
      }
  
      getCompletedStatus() {
        return this.isCompleted;
      }
  
      setCompletedStatus(value) {
        this.isCompleted = value;
      }
  
      getTile(row, col) {
        return this.tiles[row][col];
      }
  
      shuffle(n) {
        let blankCol = this.BOARD_SIZE - 1;
        let blankRow = this.BOARD_SIZE - 1;
  
        for (let i = 0; i < n; i++) {
          let destCol;
          let destRow;
          do {
            const dir = Math.floor(Math.random() * this.UDLR.length);
            destCol = blankCol + this.UDLR[dir][0];
            destRow = blankRow + this.UDLR[dir][1];
          } while (this.isOutside(destCol, destRow));
  
          [
            this.tiles[blankRow][blankCol],
            this.tiles[destRow][destCol],
          ] = [
            this.tiles[destRow][destCol],
            this.tiles[blankRow][blankCol],
          ];
  
          [blankCol, blankRow] = [destCol, destRow];
        }
      }

      swapTiles(col, row) {
        if (this.tiles[row][col] === this.BLANK_INDEX) {
          return;
        }
  
        for (let i = 0; i < this.UDLR.length; i++) {
          const destCol = col + this.UDLR[i][0];
          const destRow = row + this.UDLR[i][1];
  
          if (this.isOutside(destCol, destRow)) {
            continue;
          }
  
          if (this.tiles[destRow][destCol] === this.BLANK_INDEX) {
            [
              this.tiles[row][col],
              this.tiles[destRow][destCol],
            ] = [
              this.tiles[destRow][destCol],
              this.tiles[row][col],
            ];
            break;
          }
        }
      }

      isOutside(destCol, destRow) {
        return (
          destCol < 0 || destCol > this.BOARD_SIZE - 1 ||
          destRow < 0 || destRow > this.BOARD_SIZE - 1
        );
      }
  
      isComplete() {
        let i = 0;
        for (let row = 0; row < this.BOARD_SIZE; row++) {
          for (let col = 0; col < this.BOARD_SIZE; col++) {
            if (this.tiles[row][col] !== i++) {
              return false;
            }
          }
        }
        return true;
      }
    }
  
    const canvas = document.querySelector('canvas');
    if (typeof canvas.getContext === 'undefined') {
      return;
    }
  
    new PuzzleRenderer(new Puzzle(15), canvas);
  })();
   
  
// 'use script';

// (() => {
//   class Puzzle {
//     constructor(canvas, level) {
//       this.canvas = canvas;
//       this.level = level;
//       this.ctx = this.canvas.getContext('2d');
//       this.tiles = [
//         [0, 1, 2, 3],
//         [4, 5, 6, 7],
//         [8, 9, 10, 11],
//         [12, 13, 14, 15],
//       ];
//       this.UDLR = [
//         [0, -1], //up 
//         [0, 1], //down
//         [-1, 0], //left
//         [1, 0], //right
//       ];
//       this.isCompleted = false;
//       this.img = document.createElement('img');
//       this.img.src = 'img/15puzzle.png';
//       this.img.addEventListener('load', () => {
//         this.render();
//       });
//       this.canvas.addEventListener('click', e => {
//         if (this.isCompleted === true) {
//           return;
//         }

//         const rect = canvas.getBoundingClientRect();
//         const col = Math.floor((e.clientX - rect.left) / 70);
//         const row = Math.floor((e.clientY - rect.top) / 70);

//         this.swapTiles(col, row);
//         this.render();

//         if (this.isComplete() === true) {
//           this.isCompleted = true;
//           this.renderGameClear();
//         }
//       });  
//       do {
//         this.shuffle(this.level);
//       } while (this.isComplete() === true);
//     }

   
//     shuffle(n) {
//       let blankCol = 3;
//       let blankRow = 3;

//       for (let i = 0; i < n; i++) {
//         let destCol;
//         let destRow;
//         do {
//           const dir = Math.floor(Math.random() * 4);
       
//           destCol = blankCol + this.UDLR[dir][0];
//           destRow = blankRow + this.UDLR[dir][1];
         
//         } while (this.isOutside(destCol, destRow) === true);

//         [
//           this.tiles[blankRow][blankCol],
//           this.tiles[destRow][destCol],
//         ] = [
//           this.tiles[destRow][destCol],
//           this.tiles[blankRow][blankCol],
//         ];

//         [blankCol, blankRow] = [destCol, destRow];
//       }
//     }

//     swapTiles(col, row) {
//       if (this.tiles[row][col] === 15) {
//         return;
//       }
//       for (let i = 0; i < 4; i++) { 
//         const destCol = col + this.UDLR[i][0];
//         const destRow = row + this.UDLR[i][1];


//         if (this.isOutside(destCol, destRow) === true) {
//           continue;
//         }

//         if (this.tiles[destRow][destCol] === 15) {
//           [
//             this.tiles[row][col],
//             this.tiles[destRow][destCol],
//           ] = [
//             this.tiles[destRow][destCol],
//             this.tiles[row][col],
//           ];
//           break;
//         }
//       } 
//     }

//     isOutside(destCol, destRow) {
//       return (
//         destCol < 0 || destCol > 3 ||
//         destRow < 0 || destRow > 3
//       );
//     }

//     isComplete() {
//       let i = 0;
//       for (let row = 0; row < 4; row++) {
//         for (let col = 0; col < 4; col++) {
//           if (this.tiles[row][col] !== i++) {
//             return false;
//           }
//         }
//       }
//       return true;
//     }

//     renderGameClear() {
//       this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
//       this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//       this.ctx.font = '28px Arial';
//       this.ctx.fillStyle = '#fff';
//       this.ctx.fillText('GAME CLEAR!!', 40, 150);
//     }

   
//     render() {
//       for (let row = 0; row < 4; row++) {
//         for (let col = 0; col < 4; col++) {
//           this.renderTile(this.tiles[row][col], col, row);
//         }
//       }
//     }

//     renderTile(n, col, row) {
//       this.ctx.drawImage(
//       this.img, 
//       (n % 4) * 70, Math.floor(n / 4) * 70, 70, 70,  
//       col * 70, row * 70, 70, 70   
//       );
//     }
//   }

//   const canvas = document.querySelector('canvas');
//   if (typeof canvas.getContext === 'undefined') {
//     return;
//   }

//   new Puzzle(canvas, 2);
// })();


// 'use script';

// (() => {
//   class Puzzle {
//     constructor(canvas, level) {
//       this.canvas = canvas;
//       this.level = level;
//       this.ctx = this.canvas.getContext('2d');
//       this.tiles = [
//         [0, 1, 2, 3],
//         [4, 5, 6, 7],
//         [8, 9, 10, 11],
//         [12, 13, 14, 15],
//       ];
//       this.UDLR = [
//         [0, -1], //up 
//         [0, 1], //down
//         [-1, 0], //left
//         [1, 0], //right
//       ];
//       this.isCompleted = false;
//       this.img = document.createElement('img');
//       this.img.src = 'img/15puzzle.png';
//       this.img.addEventListener('load', () => {
//         this.render();
//       });
//       this.canvas.addEventListener('click', e => {
//         if (this.isCompleted === true) {
//           return;
//         }

//         const rect = canvas.getBoundingClientRect();//このままだと画面の左上が原点となる。描画されたcanvasの左上がクリックされたらそこが原点となるように調整する。getBoundingRect()というメソッドを使ってあげるとcanvasの位置やサイズに関するオブジェクトを返してくれる。その上でその距離を引いてやると良い。
//         // console.log(e.clientX - rect.left, e.clientY - rect.top);  確認
//         //座標が何列目の何行目に当たるかを計算する
//         //x座標が70増えるごとに列が1つずつ増えるので何列目にあるかは70で割ってあげて小数点以下を切り捨てる。下も同じ。
//         const col = Math.floor((e.clientX - rect.left) / 70);
//         const row = Math.floor((e.clientY - rect.top) / 70);
//         // console.log(col, row);  確認
//         this.swapTiles(col, row);
//         this.render();

//         if (this.isComplete() === true) {
//           this.isCompleted = true;
//           this.renderGameClear();
//         }
//       });  
//       do {
//         this.shuffle(this.level);
//       } while (this.isComplete() === true);
//     }

//     //最初のタイルの並びをシャフルする
//     shuffle(n) {
//       let blankCol = 3;
//       let blankRow = 3;

//       for (let i = 0; i < n; i++) {
//         let destCol;
//         let destRow;
//         do {
//           const dir = Math.floor(Math.random() * 4);
       
//           destCol = blankCol + this.UDLR[dir][0];
//           destRow = blankRow + this.UDLR[dir][1];
//           // switch (dir) {
//           //   case 0: //upを調べる
//           //     destCol = blankCol + UDLR[0][0];
//           //     destRow = blankRow + UDLR[0][1];
//           //     break;
//           //   case 1: //downを調べる
//           //   destCol = blankCol + UDLR[1][0];
//           //   destRow = blankRow + UDLR[1][1];
//           //     break
//           //   case 2: //leftを調べる
//           //   destCol = blankCol + UDLR[2][0];
//           //   destRow = blankRow + UDLR[2][1];
//           //     break  
//           //   case 3: //rightを調べる
//           //   destCol = blankCol + UDLR[3][0];
//           //   destRow = blankRow + UDLR[3][1];
//           //     break;
//           // }
//         } while (this.isOutside(destCol, destRow) === true);

//         [
//           this.tiles[blankRow][blankCol],
//           this.tiles[destRow][destCol],
//         ] = [
//           this.tiles[destRow][destCol],
//           this.tiles[blankRow][blankCol],
//         ];

//         [blankCol, blankRow] = [destCol, destRow];
//       }
//     }

//     swapTiles(col, row) {
//       if (this.tiles[row][col] === 15) {
//         return;//クリックしたタイルが15（空白）なら何もしなくていいのでreturnとする
//       }

//       for (let i = 0; i < 4; i++) { //次にクリックしたタイルの上下左右が空白かどうかを調べるためfor分で4回ループを回してやる
//         const destCol = col + this.UDLR[i][0];//調べたいタイルの列と行をdestCol,destRowとしておいてswitchで分岐する
//         const destRow = row + this.UDLR[i][1];
//        // iが0から3で変化するので0だった場合、1だった場合と書く

//         if (this.isOutside(destCol, destRow) === true) {
//           continue;
//         }

//         if (this.tiles[destRow][destCol] === 15) {
//           [
//             this.tiles[row][col],
//             this.tiles[destRow][destCol],
//           ] = [
//             this.tiles[destRow][destCol],
//             this.tiles[row][col],
//           ];
//           break;
//         }
//       } 
//     }

//     isOutside(destCol, destRow) {
//       return (
//         destCol < 0 || destCol > 3 ||
//         destRow < 0 || destRow > 3
//       );
//     }

//     isComplete() {
//       let i = 0;
//       for (let row = 0; row < 4; row++) {
//         for (let col = 0; col < 4; col++) {
//           if (this.tiles[row][col] !== i++) {
//             return false;
//           }
//         }
//       }
//       return true;
//     }

//     renderGameClear() {
//       this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
//       this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//       this.ctx.font = '28px Arial';
//       this.ctx.fillStyle = '#fff';
//       this.ctx.fillText('GAME CLEAR!!', 40, 150);
//     }

//       //render()というメソッドを作り全ての値を描画する。
//       //行数分ループを回して列数分次にループを回す
//     render() {
//       for (let row = 0; row < 4; row++) {
//         for (let col = 0; col < 4; col++) {
//           //今まで使ってきたrenderTile()メソッドを使ってthis.tiles[row][col]の値のタイルを切り出してcol列目、 row行目に描画する
//           this.renderTile(this.tiles[row][col], col, row);
//         }
//       }
//     }

//     renderTile(n, col, row) {
    
//       //画像の一部を切り出すにはdrawImage()を使う。this.imgのsx,sy座標からタイルサイズ70*70を切り出してCanvasのdx,dy座標の同じ大きさの領域に描画するとしてあげる 
//       this.ctx.drawImage(
//         this.img, 
//         // sx, sy, 70, 70   //sx = (n % 4) *70, sy = Math.floor(n / 4) * 70
//         // dx, dy, 70, 70   //dx = col * 70, dy = row * 70
//         (n % 4) * 70, Math.floor(n / 4) * 70, 70, 70,  
//         col * 70, row * 70, 70, 70   
//       );
//     }
//   }

//   const canvas = document.querySelector('canvas');
//   if (typeof canvas.getContext === 'undefined') {
//     return;
//   }

//   new Puzzle(canvas, 2);
// })();

//上級者向け
'use strict';

(() => {
  class PuzzleRenderer {
    constructor(puzzle, canvas) {
      this.puzzle = puzzle;
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.TILE_SIZE = 70;
      this.img = document.createElement('img');
      this.img.src = 'img/animal1.png';
      this.img.addEventListener('load', () => {
        this.render();
      });
      this.canvas.addEventListener('click', e => {
        if (this.puzzle.getCompletedStatus()) {
          return;
        }
        
        const rect = this.canvas.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left) / this.TILE_SIZE);
        const row = Math.floor((e.clientY - rect.top) / this.TILE_SIZE);
        this.puzzle.swapTiles(col, row);
        this.render();

        if (this.puzzle.isComplete()) {
          this.puzzle.setCompletedStatus(true);
          this.renderGameClear();
        }
      });
    }

    renderGameClear() {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = '28px Arial';
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText('GAME CLEAR!!', 40, 150);
    }

    render() {
      for (let row = 0; row < this.puzzle.getBoardSize(); row++) {
        for (let col = 0; col < this.puzzle.getBoardSize(); col++) {
          this.renderTile(this.puzzle.getTile(row, col), col, row);
        }
      }
    }

    renderTile(n, col, row) {
      if (n === this.puzzle.getBlankIndex()) {
        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(
          col * this.TILE_SIZE, 
          row * this.TILE_SIZE, 
          this.TILE_SIZE, 
          this.TILE_SIZE
        );
      } else {
        this.ctx.drawImage(
          this.img,
          (n % this.puzzle.getBoardSize()) * this.TILE_SIZE, 
          Math.floor(n / this.puzzle.getBoardSize()) * this.TILE_SIZE, 
          this.TILE_SIZE, 
          this.TILE_SIZE,
          col * this.TILE_SIZE, 
          row * this.TILE_SIZE, 
          this.TILE_SIZE, 
          this.TILE_SIZE
          );
        }
      }
    }
    
    class Puzzle {
      constructor(level) {
        this.level = level;
        this.tiles = [
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [8, 9, 10, 11],
          [12, 13, 14, 15],
        ];
        this.UDLR = [
          [0, -1], // up
          [0, 1], // down
          [-1, 0], // left
          [1, 0], // right
        ];
        this.isCompleted = false;
        this.BOARD_SIZE = this.tiles.length;
        this.BLANK_INDEX = this.BOARD_SIZE ** 2 - 1;
        do {
          this.shuffle(this.level);
        } while (this.isComplete());
      }
  
      getBoardSize() {
        return this.BOARD_SIZE;
      }

      getBlankIndex() {
        return this.BLANK_INDEX;
      }
  
      getCompletedStatus() {
        return this.isCompleted;
      }
  
      setCompletedStatus(value) {
        this.isCompleted = value;
      }
  
      getTile(row, col) {
        return this.tiles[row][col];
      }
  
      shuffle(n) {
        let blankCol = this.BOARD_SIZE - 1;
        let blankRow = this.BOARD_SIZE - 1;
  
        for (let i = 0; i < n; i++) {
          let destCol;
          let destRow;
          do {
            const dir = Math.floor(Math.random() * this.UDLR.length);
            destCol = blankCol + this.UDLR[dir][0];
            destRow = blankRow + this.UDLR[dir][1];
          } while (this.isOutside(destCol, destRow));
  
          [
            this.tiles[blankRow][blankCol],
            this.tiles[destRow][destCol],
          ] = [
            this.tiles[destRow][destCol],
            this.tiles[blankRow][blankCol],
          ];
  
          [blankCol, blankRow] = [destCol, destRow];
        }
      }

      getBlankIndex() {
        return this.BLANK_INDEX;
      }
  
      getCompletedStatus() {
        return this.isCompleted;
      }
  
      setCompletedStatus(value) {
        this.isCompleted = value;
      }
  
      getTile(row, col) {
        return this.tiles[row][col];
      }
  
      shuffle(n) {
        let blankCol = this.BOARD_SIZE - 1;
        let blankRow = this.BOARD_SIZE - 1;
  
        for (let i = 0; i < n; i++) {
          let destCol;
          let destRow;
          do {
            const dir = Math.floor(Math.random() * this.UDLR.length);
            destCol = blankCol + this.UDLR[dir][0];
            destRow = blankRow + this.UDLR[dir][1];
          } while (this.isOutside(destCol, destRow));
  
          [
            this.tiles[blankRow][blankCol],
            this.tiles[destRow][destCol],
          ] = [
            this.tiles[destRow][destCol],
            this.tiles[blankRow][blankCol],
          ];
  
          [blankCol, blankRow] = [destCol, destRow];
        }
      }

      isComplete() {
        let i = 0;
        for (let row = 0; row < this.BOARD_SIZE; row++) {
          for (let col = 0; col < this.BOARD_SIZE; col++) {
            if (this.tiles[row][col] !== i++) {
              return false;
            }
          }
        }
        return true;
      }
    }
  
    const canvas = document.querySelector('canvas');
    if (typeof canvas.getContext === 'undefined') {
      return;
    }
  
    new PuzzleRenderer(new Puzzle(2), canvas);
  })();