const computer = document.querySelector(".computer > img")
const player = document.querySelector(".player > img")
const btns = Array.from(document.querySelector(".control").children);
const winContDom = document.querySelector(".winCount");
const control = btns[0].parentElement;
const reload = document.getElementsByClassName("reload")[0];

let lock = false;//加锁，防止连续点击。
isGameOver = false;//判断是否结束。

let options = [
    {
        src: "./img/bu.jpg",
        type: "cloth",
    },
    {
        src: "./img/jiandao.jpg",
        type: "scissor"
    },
    {
        src: "./img/shitou.jpg",
        type: "stone"
    }
]

btns.forEach((item, i) => {
    item.dataset.type = options[i].type;
    item.innerText = options[i].type;
})

// 赢de次数
let win = 0;
let timer = 0;


function init () {
    addEvent();
}
init();

/**
 * 传入玩家出的结果
*/
function gameStart (playerType) {
    // 控制每一次的时长
    let time = 0;
    timer = setInterval(() => {

        // 让电脑一直切换图片、
        computer.src = options[random(0, options.length)].src;

        time += 50;

        if (time >= 1000) {
            clearInterval(timer);
            gameResult(playerType);
        }
    }, 50)

}


// 游戏的结果，判断是否结束，得分等
function gameResult (playerType) {
    // 随机的计算机结果
    const computerType = options[random(0, options.length)];


    //  判断结果。
    let result = judge(playerType, computerType.type);
    computer.src = computerType.src;

    // 平局
    if (result === 0) {
        lock = false;
    };
    // 玩家赢
    if (result === 1) {
        changeNum();
        lock = false;
        return;
    }
    // 输了
    if (result === -1) {
        dialog(`游戏结束，您的得分为：${win}分`, () => {
            location.reload();
        })
        lock = false;
        isGameOver = true;
        return;
    }
}

// 添加事件
function addEvent () {
    control.addEventListener("click", (e) => {
        // 在比较中或者游戏已经结束了。
        if (lock || isGameOver) {
            return;
        }

        lock = true;

        if (e.target.nodeName === 'BUTTON') {
            const type = e.target.dataset.type
            const src = options.find(item => item.type === type).src;
            player.src = src;
            changeActive(e.target);
            gameStart(type);
        }

    })
    reload.addEventListener('click', () => {
        console.log("SF")
        location.reload();
    })
}

// 随机数字
function random (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// 判断输赢
function judge (value1, value2) {
    // 平局
    if (value1 === value2) return 0

    switch (value1) {
        // 玩家为布
        case "cloth": {
            if (value2 === 'stone') {
                return 1;
            } else {
                return -1;
            }
            break;
        }
        // 玩家为剪刀
        case "scissor": {
            if (value2 === 'stone') {
                return -1
            } else {
                return 1;
            }
            break;
        }
        // 为石头
        case "stone": {
            if (value2 === 'cloth') {
                return -1
            } else {
                return 1;
            }
            break;
        }

    }
}

// 改变赢的数量
function changeNum () {
    win++;
    winContDom.innerText = `您的得分：${win}`
}

// 改变当前选中按钮
function changeActive (curDom) {
    btns.forEach(item => item.classList.remove("active"))
    curDom.classList.add("active");
}


function dialog (info, handleReloadfn) {
    const pageDialog = document.querySelector(".dialog");
    console.log(pageDialog)
    if (pageDialog) {
        pageDialog.style.display = 'block';
        const pageSpan = document.querySelector("div.dialog[data-unique='dialog'] content span")
        pageSpan.innerText = info;
    } else {
        const dialogWrap = document.createElement("div");
        const content = document.createElement("div")
        const reloadBtn = document.createElement("button");
        const cancleBtn = document.createElement("button");
        const span = document.createElement("span");
        const btns = document.createElement("div");
        cancleBtn.innerText = '取消'
        reloadBtn.innerText = "重新开始";

        span.innerText = info;

        btns.appendChild(reloadBtn);
        btns.appendChild(cancleBtn);
        dialogWrap.appendChild(content);
        content.appendChild(span);
        content.appendChild(btns);
        reloadBtn.addEventListener("click", handleReloadfn)
        cancleBtn.addEventListener("click", () => {
            dialogWrap.style.display = 'none'
        })

        dialogWrap.dataset.unique = 'dialog';
        dialogWrap.className = 'dialog';
        document.body.appendChild(dialogWrap);
    }

}