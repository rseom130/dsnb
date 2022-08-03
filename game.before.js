/*
 * 기본적으로 설정먼저 해줘야하는 변수들
 */

// define const
const canvas = document.getElementById('canvas'); // 캔버스 정의
const ctx = canvas.getContext('2d'); // 캔버스 정의
const canvasSize = 1000; // 캔버스 사이즈
const availableFps = [30, 60, 120]; // fps 지원 종류
const scoreBox = $('#informationBox .score'); // 스코어 dom
const timerBox = $('#informationBox .timer'); // 타이머 dom
const fuelBox = $('#informationBox .fuel'); // 가속도 dom
const startBtn = $('#informationBox .play_btn'); // 시작/종료 버튼
// const mobileShiftBtn = $('#btn_shift'); // 시작/종료 버튼
// const mobileSpaceBtn = $('#btn_space'); // 시작/종료 버튼
const defaultFps = 120;
// define const end

// define variable
let renderCount = 0; // 1초동안 실행되는 렌더 수를 가지고 프레임 조절
let checkFps = 0; // 프레임 확인
let checkAnimateFlag = null;
// define variable end

canvas.width = canvasSize;
canvas.height = canvasSize;

$(document).ready(function() { // 처음 전체적인 사이즈 조절
    putCanvasReset();
});

$(window).resize(function() { // 윈도우의 크기가 변경될 때 전체적인 사이즈 조절
    putCanvasReset();
});

// define function
const putCanvasReset = () => { // 사이즈 조절
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var windowCanvas = 0;
    if (windowWidth > windowHeight) {
        windowCanvas = windowHeight;
    } else {
        windowCanvas = windowWidth;
    }
    if((windowHeight-120)<windowCanvas) {
        windowCanvas = windowHeight;
    }

    canSize = windowCanvas;
    canSize -= windowCanvas / 5;
    $('#canvas').width(canSize);
    $('#canvas').height(canSize);
    $('.btn_box').width(canSize);
}

const checkAnimate = (cb) => { // 프레임 체크를 위한 애니메이션 정의
    requestAnimationFrame(cb);
}

const setAnimateVariable = (moveX, duration, fps) => {
    let fpsInterval = 1000 / fps;
    let start;
    let then;

    return function setAnimate(timestamp) {
        if (start === undefined && then === undefined) {
            start = window.performance.now();
            then = window.performance.now();
        }
        const totalElapsed = window.performance.now() - start;
        if (totalElapsed > duration) {
            availableFps.forEach(function(fps) {
                if(checkFps==0) {
                    if((fps*0.9)<=renderCount && renderCount<=(fps*1.1)) {
                        console.log(renderCount);
                        checkFps = fps;
                        startBtn.show();
                        addJavascript('./game.js?v=1');
                        return true;
                    }
                }
            });
            cancelAnimationFrame(checkAnimateFlag);
            return;
        }
        const elapsed = timestamp - then;

        if (elapsed >= fpsInterval) {
            // draw
            then = timestamp - (elapsed % fpsInterval);
            renderCount++;
        }
        checkAnimateFlag = requestAnimationFrame(setAnimate);
    }
}

checkAnimate(setAnimateVariable(1, 1000, defaultFps));
// define function end

// float print
const getFloatFixed = (value, fixed) => {
    return parseFloat(Math.round(value * 100) / 100).toFixed(fixed);
};
// float print end

// not animation function
if(!window.requestAnimationFrame) {
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            var self = this, start, finish;
            return window.setTimeout(function() {
                start = +new Date();
                callback(start);
                finish = +new Date();
                self.timeout = 1000/60 - (finish - start);
            }, self.timeout);
        });
}

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout;
} )();
// not animation function end

// javascript file import
function addJavascript(jsname) {
    var th = document.getElementsByTagName('head')[0];
    var s = document.createElement('script');
    s.setAttribute('type','text/javascript');
    s.setAttribute('src',jsname);
    th.appendChild(s);
}
// javascript file import end
