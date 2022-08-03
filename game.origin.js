// define const
// const gameTime = checkFps * 60; // 게임 시간 (120 프레임 이상 기준 7200 = 1분 / 60 프레임 이상 기준 3600 = 1분 / 30 프레임일 경우 1800 = 1분) > 시간 초 확인 결과 동일하게 3600을 맞춰야 할듯
const gameTime = 3600;
const gameFps = checkFps; // 게임 기본 프레임 수 (1초당)

const playerSize = 50; // 플레이어 크기
const itemSize = 30; // 아이템 크기
const specialItemSize = 15; // 스페셜 아이템 크기
const tntItemSize = 45; // 죽는 아이템 크기
const itemTime = 60; // 아이템 드롭 시간 (/60) = 1s
const specialItemTime = 120; // 스페셜 아이템 드롭 시간 (/60) = 1s
const tntItemTime = 480; // 죽는 아이템 드롭 시간 (/60) = 1s
const itemMaxCount = 99; // 아이템 최대 수
const specialMaxCount = 99; // 스페셜 아이템 최대 수
const tntMaxCount = 99; // 죽는 아이템 최대 수
const itemScore = 1; // 일반 아이템 스코어
const specialItemScore = 2; // 스페셜 아이템 스코어

// const playerSpeedOgirin = 1;
// const playerAcceleratorOgirin = 2;
// const playerSpeed = (playerSpeedOgirin - 1) + ((gameFps / 30) * (gameFps / 30)); // 플레이어 스피드 (/fps) 30fps일 때 1, 60fps일 때 4... 앞에 1을 가지고 실제 속도 조절
const playerSpeed = 5; // 무슨 이유로 위에 변수가 잘 작동하다가 작동이 이상해짐;;; playerSpeedOgirin 변수가 필요없어짐
// const playerAcceleratorSpeed = (playerAcceleratorOgirin - 1) + ((gameFps / 30) * (gameFps / 30)); // 플레이어 추가 속도 (/fps)
const playerAcceleratorSpeed = 5; // playerSpeed 변수와 같은 이유로 왜 다시 돌아온거지..?  playerAcceleratorOgirin 변수가 필요없어짐
const playerFuelChargeTime = 6; // (/60) = 1s, 얼마마다 충전을 할지
const playerFuelCharge = 0.6; // (/60) = 1s, playerFuelChargeTime 마다 충전되는 양

// define const end

// define variable
let gameFlag = false; // 게임 실행 여부
let gameAnimation = null; // 게임 애니메이션을 담을 변
let timer = 0; // 게임 타이머
let fuelTimer = 0;
let itemCount = 0; // 현재 아이템 수
let specialItemCount = 0; // 현재 스페셜 아이템 수
let tntItemCount = 0; // 현재 죽는 아이템 최대 수
let score = 0; // 스코어
let items = []; // 아이템 배열
let playerWay = 0; // 플레이어 방향 → ↓ ← ↑
let playerSpeedAddValue = 0; // 플레이어 추가 속도
let playerWayFlag = false; // 캐릭터가 방향을 바꾸고 버튼을 안누를 때까지 유지
let playerAcceleratorFlag = false; // 캐릭터 가속도 버튼 누르고 있는동안 계속 유지
let playerCharacterTimer = 10;
// define variable end

// define setting
const playerImg = new Image();
playerImg.src = './images/playerRightA.png';
const player = {
    x: 0,
    y: 0,
    width: playerSize,
    height: playerSize,
    draw() {
        // ctx.fillStyle = 'black';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(playerImg, this.x, this.y);
    }
}

class Item {
    constructor() {
        var location = getItemLocation(itemSize);
        this.x = location.x;
        this.y = location.y;
        this.width = itemSize;
        this.height = itemSize;
        this.type = 'item';
    }
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class SpecialItem {
    constructor() {
        var location = getItemLocation(specialItemSize);
        this.x = location.x;
        this.y = location.y;
        this.width = specialItemSize;
        this.height = specialItemSize;
        this.type = 'specialItem';
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class TntItem {
    constructor() {
        var location = getItemLocation(tntItemSize);
        this.x = location.x;
        this.y = location.y;
        this.width = tntItemSize;
        this.height = tntItemSize;
        this.type = 'tntItem';
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
// define setting end

// function
const getGameInit = (fps) => {
    gameFlag = true;
    gameAnimation = null;
    timer = gameTime;
    fuelTimer = 0;
    itemCount = 0;
    specialItemCount = 0;
    tntItemCount = 0;
    score = 0;
    items = [];

    // player init
    player.x = 0;
    player.y = 0;
    playerWay = 0;
    playerSpeedAddValue = 0;
    playerWayFlag = false;

    scoreBox.text(0);

    return function getGameAnimation(timestamp) {
        if(gameFlag) {
            // game animation define

            if(timer<=0) {
                timerBox.text(getFloatFixed((timer / 60), 1));
                getGameStop();
            } else {
                timerBox.text(getFloatFixed((timer / 60), 1));

                // canvas reset
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if(playerAcceleratorFlag && fuelTimer>=1) { // player accelerator flag is false
                    // player speed accelerator
                    fuelTimer--;
                    playerSpeedAddValue = playerAcceleratorSpeed;
                    playerCharacterTimer = 20;
                } else {
                    // fuel charge
                    playerSpeedAddValue = 0;
                    if(timer%playerFuelChargeTime===0) {
                        // console.log('fuel charge : '+getFloatFixed((timer / 60), 1));
                        fuelTimer += playerFuelCharge;
                    }
                    playerCharacterTimer = 10;
                }
                fuelBox.text(getFloatFixed((fuelTimer / 60), 1));

                if(playerWay==0) {
                    // →
                    if(canvas.width<=player.x+playerSpeed+playerSpeedAddValue+playerSize) {
                        getGameStop();
                        player.x = canvas.width - playerSize;
                    } else {
                        player.x += playerSpeed+playerSpeedAddValue;
                    }

                    playerImg.src = './images/playerRight';
                } else if(playerWay==1) {
                    // ↓
                    if(canvas.height<=player.y+playerSpeed+playerSpeedAddValue+playerSize) {
                        getGameStop();
                        player.y = canvas.height - playerSize;
                    } else {
                        player.y += playerSpeed+playerSpeedAddValue;
                    }
                    playerImg.src = './images/playerFront';
                } else if(playerWay==2) {
                    // ←
                    if(0>=player.x-playerSpeed+playerSpeedAddValue) {
                        getGameStop();
                        player.x = 0;
                    } else {
                        player.x -= playerSpeed+playerSpeedAddValue;
                    }
                    playerImg.src = './images/playerLeft';
                } else if(playerWay==3) {
                    // ↑
                    if(0>=player.y-playerSpeed+playerSpeedAddValue) {
                        getGameStop();
                        player.y = 0;
                    } else {
                        player.y -= playerSpeed+playerSpeedAddValue;
                    }
                    playerImg.src = './images/playerBack';
                }
                if(timer%playerCharacterTimer<=playerCharacterTimer/2) {
                    playerImg.src = playerImg.src+'A.png';
                } else {
                    playerImg.src = playerImg.src+'B.png';
                }
                player.draw();

                if(timer%itemTime===0) {
                    // console.log('item : '+getFloatFixed((timer / 60), 1));
                    if(itemCount<itemMaxCount) {
                        var item = new Item();
                        items.push(item);
                        itemCount++;
                    }
                }
                if(timer%specialItemTime===0) {
                    // console.log('special item : '+getFloatFixed((timer / 60), 1));
                    if(specialItemCount<specialMaxCount) {
                        var item = new SpecialItem();
                        items.push(item);
                        specialItemCount++;
                    }
                }
                if(timer%tntItemTime===0) {
                    // console.log('tnt item : '+getFloatFixed((timer / 60), 1));
                    if(tntItemCount<tntMaxCount) {
                        var item = new TntItem();
                        items.push(item);
                        tntItemCount++;
                    }
                }

                items.forEach((item, i) => {
                    if(itemCheck(player, item)) {
                        if(item.type==='item') {
                            score += itemScore;
                            itemCount--;
                        } else if(item.type==='specialItem') {
                            score += specialItemScore;
                            specialItemCount--;
                        } else if(item.type==='tntItem') {
                            getGameStop();
                        }
                        delete items[i];
                        scoreBox.text(score);
                    }
                    item.draw();
                });
            timer--;
            }
            // timerBox.trigger('touchmove');

            // game animation define end
            requestAnimationFrame(getGameAnimation);
        }
    }
}

const getGameStart = (getGameAnimation) => {
    requestAnimationFrame(getGameAnimation);
};

const getGameStop = () => {
    startBtn.text('Start');
    // console.log('End : '+new Date());
    gameFlag = false;
    cancelAnimationFrame(gameAnimation);
}

// item random location
const getItemLocation = (item) => {
    var x = Math.floor(Math.random() * (1001 - item));
    var y = Math.floor(Math.random() * (1001 - item));

    var playerLeft = player.x;
    var playerRight = player.x + player.width;
    var playerTop = player.y;
    var playerBottom = player.y + player.height;

    var itemLeft = 0;
    var itemRight = 0;
    var itemTop = 0;
    var itemBottom = 0;

    var locationFlag = false;
    var itemTemp = {
        x: x,
        y: y,
        width: item,
        height: item
    }

    while(!locationFlag) {
        x = Math.floor(Math.random() * (1001 - item));
        y = Math.floor(Math.random() * (1001 - item));
        itemTemp.x = x;
        itemTemp.y = y;

        locationFlag = true;
        items.forEach((item, i) => {
            if(itemCheck(itemTemp, item)) {
                locationFlag = false;
                return false;
            }
            if(itemCheck(player, itemTemp)) {
                locationFlag = false;
                return false;
            }
        });
    }
    return itemTemp;
}
// item random location end

// item with player check
const itemCheck = (player, item) => {
    var playerLft = player.x;
    var playerRight = player.x + player.width;
    var playerTop = player.y;
    var playerBottom = player.y + player.height

    var itemLeft = item.x;
    var itemRight = item.x + item.width;
    var itemTop = item.y;
    var itemBottom = item.y + item.height;

    var checkFlag = false;

    if(
        playerRight>itemLeft &&
        playerLft<itemRight &&
        playerBottom>itemTop &&
        playerTop<itemBottom
    ) {
        checkFlag = true;
    }

    return checkFlag;
}
// item with player check end

// game start/stop btn
startBtn.on('click', function() {
    if(!gameFlag) {
        // console.log('Start : '+new Date());
        startBtn.text('Stop');
        getGameStart(getGameInit(gameFps));
    } else {
        getGameStop();
    }
});
// game start/stop btn end

// key event
document.addEventListener('keyup', function(e) {
    if(e.code=='Space') {
        playerWayFlag = false;
    }
    if(e.code==='ShiftLeft' || e.code==='ShiftRight') { // accelerator
        // playerSpeed = playerSpeed_origin;
        playerAcceleratorFlag = false;
    }
});

document.addEventListener('keydown', function(e) {
    if(e.code==='Space' && !playerWayFlag) {
        playerWayFlag = true;
        playerWay = (playerWay + 1) % 4;
    }

    if(e.code==='ShiftLeft' || e.code==='ShiftRight') { // accelerator
        // playerSpeed = playerSpeed_origin + player_accelerator;
        playerAcceleratorFlag = true;
    }
});
// key event end

// touch event
$(document).ready(function() {
    mobileShiftBtn.on("touchstart", function (e) {
        // console.log('shift start');
        playerAcceleratorFlag = true;
    });
    // mobileShiftBtn.on("touchmove", function (e) {
    //     // console.log('shift move');
    //     playerAcceleratorFlag = true;
    // });
    mobileShiftBtn.on("touchend", function (e) {
        // console.log('shift end');
        playerAcceleratorFlag = false;
    });

    // mobileSpaceBtn.on("click", function (e) {
    //     // console.log('space start');
    //     if(!playerWayFlag) {
    //         playerWayFlag = true;
    //         playerWay = (playerWay + 1) % 4;
    //     }
    // });
    mobileSpaceBtn.on("touchstart", function (e) {
        // console.log('space start');
        // if(!playerWayFlag) {
        //     playerWayFlag = true;
            playerWay = (playerWay + 1) % 4;
        // }
    });

    // timerBox.on('touchstart', function() {
    //     console.log('test');
    // })
    // timerBox.on('touchmove', function() {
    //     console.log('test2');
    // })
    // timerBox.on('touchend', function() {
    //     console.log('test3');
    // })

    // mobileSpaceBtn.on("touchend", function (e) {
    //     // console.log('space end');
    //     playerWayFlag = false;
    // });
});
// touch event end
// function
