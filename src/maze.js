function ana2(SIZE, maze, row, col) {

    let lst = ["up", "down", "left", "right"]

    while (true) {
        //進む方向を上下左右からランダムに選ぶ
        let d = lst[Math.floor(Math.random() * lst.length)]

        // 1つ先
        let r1 = row
        let c1 = col

        // 2つ先
        let r2 = row
        let c2 = col

        switch (d) {
            case "up":
                r1 = r1 - 1
                r2 = r2 - 2
                break
            case "down":
                r1 = r1 + 1
                r2 = r2 + 2
                break
            case "left":
                c1 = c1 - 1
                c2 = c2 - 2
                break
            case "right":
                c1 = c1 + 1
                c2 = c2 + 2
                break
        }

        // 2つ先地点が 1（壁）なら ok
        if (r2 < SIZE && c2 < SIZE && r2 >= 0 && c2 >= 0) {
            if (maze[r2][c2] == 1) {
                maze[r1][c1] = 0
                maze[r2][c2] = 0
                return { flag: true, row: r2, col: c2 }
            }
        }

        // dを削除
        lst = lst.filter(v => v != d)
        if (lst.length === 0) {
            break
        }
    }

    return { flag: false, row: -1, col: -1 }
}

// 穴掘り法
function ana(SIZE) {
    // 迷路の２次元配列
    let maze = [...Array(SIZE)].map(k => [...Array(SIZE)].map(k => 1))

    // 地点用
    let stack = []

    // 奇数の配列を作る
    let odd = []
    for (let i = 0; i < SIZE; i++) {
        if (i % 2 != 0) {
            odd.push(i)
        }
    }

    // 配列からランダムに値をとりだす
    // ランダムな奇数の数字 row と col 二つ作成
    let row = odd[Math.floor(Math.random() * odd.length)]
    let col = odd[Math.floor(Math.random() * odd.length)]

    // その地点を 0（通路）にします
    maze[row][col] = 0

    // 現在の地点として保持
    stack.push([row, col])

    while (true) {
        if (stack.length === 0) {
            break
        }

        // 2つ先地点が 1（壁）なら ok
        let obj = ana2(SIZE, maze, row, col)

        if (obj.flag == false) {
            let p = stack.pop()
            row = p[0]
            col = p[1]
            continue
        }

        row = obj.row
        col = obj.col

        stack.push([row, col])
    }

    return maze

}

function bou1(maze, row, col) {
    let lst = ["up", "down", "left", "right"]

    while (true) {
        //倒す方角
        let d = lst[Math.floor(Math.random() * lst.length)]

        // 1つ先
        let r1 = row
        let c1 = col

        switch (d) {
            case "up":
                r1 = r1 - 1
                break
            case "down":
                r1 = r1 + 1
                break
            case "left":
                c1 = c1 - 1
                break
            case "right":
                c1 = c1 + 1
                break
        }

        // 1つ先地点が 0 なら ok
        if (maze[r1][c1] == 0) {
            maze[r1][c1] = 1
            maze[row][col] = 1
            return
        }

        // dを削除
        lst = lst.filter(v => v != d)
        if (lst.length === 0) {
            break
        }
    }
}

function bou2(maze, row, col) {
    let lst = ["down", "left", "right"]

    while (true) {
        //倒す方角
        let d = lst[Math.floor(Math.random() * lst.length)]

        // 1つ先
        let r1 = row
        let c1 = col

        switch (d) {
            case "down":
                r1 = r1 + 1
                break
            case "left":
                c1 = c1 - 1
                break
            case "right":
                c1 = c1 + 1
                break
        }

        // 1つ先地点が 0 なら ok
        if (maze[r1][c1] == 0) {
            maze[r1][c1] = 1
            maze[row][col] = 1
            return
        }

        // dを削除
        lst = lst.filter(v => v != d)
        if (lst.length === 0) {
            break
        }
    }
}

// 棒倒し法
function bou(SIZE) {
    // 迷路の２次元配列
    let maze = [...Array(SIZE)].map(k => [...Array(SIZE)].map(k => 0))

    // 基本形
    let c = 2
    for (let i1 = 0; i1 < SIZE; i1++) {
        for (let i2 = 0; i2 < SIZE; i2++) {
            if (i1 == 0) {
                maze[i1][i2] = 1
            }

            if (i1 == SIZE - 1) {
                maze[i1][i2] = 1
            }

            if (i2 == 0) {
                maze[i1][i2] = 1
            }

            if (i2 == SIZE - 1) {
                maze[i1][i2] = 1
            }

            if (i1 != 0 && i1 != SIZE - 1 && i2 != 0 && i2 != SIZE - 1) {
                if (i1 % 2 == 0 && i2 % 2 == 0) {
                    maze[i1][i2] = c
                    c++
                }
            }
        }
    }

    // 2以上の場所を見る
    for (let i1 = 0; i1 < SIZE; i1++) {
        for (let i2 = 0; i2 < SIZE; i2++) {
            if (i1 == 2 && maze[i1][i2] >= 2) {
                bou1(maze, i1, i2)
            } else if (i1 > 2 && maze[i1][i2] >= 2) {
                bou2(maze, i1, i2)
            }
        }
    }

    return maze
}

// 行き止まり地点を探す
function findDeadEnd(maze, i, j) {
    let count = 0

    // 上
    if (maze[i - 1][j] == 1) {
        count += 1
    }
    // 下
    if (maze[i + 1][j] == 1) {
        count += 1
    }
    // 左
    if (maze[i][j - 1] == 1) {

        count += 1
    }
    // 右
    if (maze[i][j + 1] == 1) {

        count += 1
    }

    if (count === 3) {
        return true
    } else {
        return false
    }
}

// 直交座標A(x,y)とB(x2,y2)の間の距離を求める
function getDistance(start, goal) {
    const x = start[0]
    const y = start[1]
    const x2 = goal[0]
    const y2 = goal[1]

    const distance = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y))

    return distance
}

// 確認表示用
function display(maze) {
    for (let v of maze) {
        let str = v.join("")
        str = str.replace(/1/g, "■")
        str = str.replace(/0/g, "□")
        str = str.replace(/2/g, "◎")
        str = str.replace(/3/g, "○")
        console.log(str)
    }
}

export default function makeMaze(SIZE) {
    // 迷路を決定
    const algo = [[ana, "穴掘り法"], [bou, "棒倒し法"]]

    //ランダムに選ぶ
    const maze_fn = algo[Math.floor(Math.random() * algo.length)]

    const maze = maze_fn[0](SIZE)

    // console.log(maze_fn[1])

    // 迷路にスタート地点とゴール地点を作る

    // スタート地点は南側の中央に固定
    const row = SIZE - 1
    const col = Math.ceil(SIZE / 2.0) - 1
    const start = [row, col]
    // 2つ穴を開けるのでもう一つ地点を覚える
    const start2 = [row - 1, col]

    // すべての行き止まり地点を調べる
    const dead_end = []
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (maze[i][j] === 0) {
                if (findDeadEnd(maze, i, j)) {
                    dead_end.push([i, j])
                }
            }
        }
    }

    // スタート地点から最長の行き止まり地点を探しそこをゴールにする
    let big = 0
    let goal = []
    for (const v of dead_end) {
        const distance = getDistance(start, v)
        if (distance > big) {
            big = distance
            goal = v
        }
    }

    // console.log("start", start)
    // console.log("goal", goal)

    // 迷路を更新する
    // スタートは2
    maze[start[0]][start[1]] = 2
    // スタート2は0にしておく
    maze[start2[0]][start2[1]] = 0
    // ゴールは3
    maze[goal[0]][goal[1]] = 3

    // display(maze)

    return maze
}

// 迷路は正方形　大きさは奇数
// main(31)
