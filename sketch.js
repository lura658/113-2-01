let sprites = [];
let currentSprite = 0;
let frameWidth = 96;
let frameHeight = 80;
let totalFrames = 4;
let currentFrame = 0;
let x, y;
let introBoxVisible = false;
let introText = "你好，我是吳映璇，新北人，畢業於崇光中學";
let ripples = [];
let stars = [];
let nodes = [];
let nodeCount = 100;
let dragging = false;
let offsetX = 0;
let offsetY = 0;
let iframeClosing = false; // 是否正在關閉 iframe
let iframeScale = 1; // iframe 的縮放比例

// 角色設定物件
let characters = {
    character1: {
        sprite: 'sprite1.png',
        frameWidth: 96,
        frameHeight: 80,
        totalFrames: 4,
        scale: 1
    },
    character2: {
        sprite: 'sprite2.png',
        frameWidth: 103,
        frameHeight: 140,
        totalFrames: 4,
        scale: 0.75
    },
    character3: {
        sprite: 'sprite3.png',
        frameWidth: 103,
        frameHeight: 110,
        totalFrames: 4,
        scale: 0.7
    },
    character4: {
        sprite: 'sprite4.png',
        frameWidth: 75,
        frameHeight: 90,
        totalFrames: 4,
        scale: 0.8
    },
    character5: {
        sprite: 'sprite5.png',
        frameWidth: 62,
        frameHeight: 70,
        totalFrames: 4,
        scale: 0.9
    }
};

function preload() {
    sprites[0] = loadImage(characters.character1.sprite);
    sprites[1] = loadImage(characters.character2.sprite);
    sprites[2] = loadImage(characters.character3.sprite);
    sprites[3] = loadImage(characters.character4.sprite);
    sprites[4] = loadImage(characters.character5.sprite);
}

function setup() {
    // 背景畫布
    let bgCanvas = createCanvas(windowWidth, windowHeight);
    bgCanvas.parent("backgroundCanvas"); // 將背景畫布附加到背景區域
    bgCanvas.style('z-index', '1'); // 背景畫布在最底層
    

    x = 20;
    y = 20;
    frameRate(60);
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: random(width),
            y: random(height),
            vx: random(-0.5, 0.5),
            vy: random(-0.5, 0.5),
            alpha: random(100, 255)
        });
    }
    
}

function draw() {
    clear();

    // 繪製互動背景
    drawInteractiveBackground();

    // 顯示角色動畫，讓精靈圖跟隨滑鼠移動
    let currentCharacter = characters[`character${currentSprite + 1}`];
    let scale = currentCharacter.scale;
    x = lerp(x, mouseX - currentCharacter.frameWidth * scale / 2, 0.1); // 緩動到滑鼠位置
    y = lerp(y, mouseY - currentCharacter.frameHeight * scale / 2, 0.1);
    image(
        sprites[currentSprite],
        x,
        y,
        currentCharacter.frameWidth * scale,
        currentCharacter.frameHeight * scale,
        currentFrame * currentCharacter.frameWidth / 2,
        0,
        currentCharacter.frameWidth / 2,
        currentCharacter.frameHeight / 2
    );
    currentFrame = (currentFrame + 1) % currentCharacter.totalFrames;

    // 如果彈出框可見，繪製彈出框
    if (introBoxVisible) {
        drawIntroBox();
    }

    // 如果正在關閉 iframe，執行收回動畫
    if (iframeClosing) {
        let iframe = document.getElementById("contentFrame");
        iframeScale -= 0.02; // 調整縮小速度
        iframe.style.transform = `rotateY(${90 * (1 - iframeScale)}deg) scale(${iframeScale})`; // 動態旋轉和縮小
        iframe.style.opacity = iframeScale; // 同時減少透明度
        if (iframeScale <= 0) {
            iframe.style.display = "none"; // 完全隱藏
            iframeClosing = false; // 停止動畫
            iframeScale = 1; // 重置縮放比例
        }
    }
}

function toggleIntroBox() {
    introBoxVisible = !introBoxVisible; // 切換彈出框的顯示狀態
    let iframe = document.getElementById("contentFrame");

    // 若 introBox 顯示中，則隱藏 iframe，否則恢復上一次的內容（或你可以改成空白）
    if (introBoxVisible) {
        iframe.style.display = "none";
    } else {
        iframe.style.display = "block";
    }
}

function closeIframe() {
    let iframe = document.getElementById("contentFrame");
    let closeButton = document.getElementById("closeIframe");
    let menuButton = document.querySelector(".menu-button"); // 選單圖標

    // 計算選單圖標的位置
    let menuRect = menuButton.getBoundingClientRect();
    let iframeRect = iframe.getBoundingClientRect();
    let centerX = menuRect.left + menuRect.width / 2 - (iframeRect.left + iframeRect.width / 2);
    let centerY = menuRect.top + menuRect.height / 2 - (iframeRect.top + iframeRect.height / 2);

    // 設定旋轉和縮小動畫，指向選單圖標
    iframe.style.transform = `translate(${centerX}px, ${centerY}px) scale(0) rotate(-90deg)`;
    iframe.style.opacity = "0"; // 淡出
    setTimeout(() => {
        iframe.style.display = "none"; // 動畫結束後隱藏 iframe
        iframe.src = ""; // 清空 iframe 的內容
        closeButton.style.display = "none"; // 隱藏關閉按鈕
        iframe.style.transform = "scale(1) rotate(0deg) translate(0, 0)"; // 重置動畫狀態
    }, 600); // 與 transition 時間一致
}

function drawIntroBox() {
    let boxWidth = 400;
    let boxHeight = 200;
    let boxX = (width - boxWidth) / 2;
    let boxY = (height - boxHeight) / 2;

    // 繪製彈出框背景（漸變效果）
    for (let i = 0; i < boxHeight; i++) {
        let inter = map(i, 0, boxHeight, 0, 1);
        let c = lerpColor(color(255, 200, 200), color(200, 150, 255), inter);
        stroke(c);
        line(boxX, boxY + i, boxX + boxWidth, boxY + i);
    }

    // 繪製彈出框邊框與陰影
    noFill();
    stroke(50, 50, 150, 150);
    strokeWeight(4);
    rect(boxX - 5, boxY - 5, boxWidth + 10, boxHeight + 10, 15); // 外框陰影
    stroke(0);
    strokeWeight(2);
    rect(boxX, boxY, boxWidth, boxHeight, 10); // 主框

    // 繪製文字內容
    fill(0);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text(introText, boxX + boxWidth / 2, boxY + boxHeight / 2);

    // 繪製關閉按鈕
    let closeButtonSize = 20;
    let closeButtonX = boxX + boxWidth - closeButtonSize - 10;
    let closeButtonY = boxY + 10;

    fill(200, 0, 0);
    ellipse(closeButtonX, closeButtonY, closeButtonSize);

    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("X", closeButtonX, closeButtonY);

    // 檢查滑鼠是否點擊關閉按鈕
    if (mouseIsPressed && dist(mouseX, mouseY, closeButtonX, closeButtonY) < closeButtonSize / 2) {
        introBoxVisible = false;
    }

    // 滑鼠懸停時的互動效果
    if (dist(mouseX, mouseY, closeButtonX, closeButtonY) < closeButtonSize / 2) {
        fill(255, 0, 0, 150);
        ellipse(closeButtonX, closeButtonY, closeButtonSize + 5);
    }
}

function drawInteractiveBackground() {
    background(10, 20, 30); // 深藍科技底色

    drawParticles();       // 閃光點特效
    drawMouseRing();       // 保留滑鼠圓圈互動

    noFill();
    strokeWeight(1);

    // 更新並繪製節點
    for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];

        // 移動
        n.x += n.vx;
        n.y += n.vy;

        // 邊界反彈
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // 繪製節點
        fill(100, 200, 255, n.alpha);
        noStroke();
        ellipse(n.x, n.y, 3);

        // 與滑鼠距離內則畫線
        for (let j = i + 1; j < nodes.length; j++) {
            let n2 = nodes[j];
            let d = dist(n.x, n.y, n2.x, n2.y);
            if (d < 100) {
                stroke(150, 200, 255, map(d, 0, 100, 200, 0));
                line(n.x, n.y, n2.x, n2.y);
            }
        }

        // 與滑鼠距離內也畫線
        let dMouse = dist(n.x, n.y, mouseX, mouseY);
        if (dMouse < 120) {
            stroke(255, 255, 255, map(dMouse, 0, 120, 255, 0));
            line(n.x, n.y, mouseX, mouseY);
        }
    }

    // 滑鼠光圈
    noFill();
    stroke(255, 255, 255, 40);
    ellipse(mouseX, mouseY, 80 + sin(frameCount * 0.2) * 10);
}

function drawWaves() {
    noFill();
    let waveLayers = 12;
    let waveAmplitude = 20;
    let waveSpeed = frameCount * 0.02;
    let waveSpacing = 12 ;

    for (let l = 0; l < waveLayers; l++) {
        let alpha = 80 - l * 5;
        stroke(120 + l * 10, 240, 255, alpha);
        
        // 🔽 下邊波浪
        beginShape();
        for (let x = 0; x <= width; x += 6) {
            let y = height - sin(x * 0.015 + waveSpeed + l) * (waveAmplitude - l * 1.2) - l * waveSpacing;
            vertex(x, y);
        }
        endShape();

        // 🔼 上邊波浪
        beginShape();
        for (let x = 0; x <= width; x += 6) {
            let y = sin(x * 0.015 + waveSpeed + l) * (waveAmplitude - l * 1.2) + l * waveSpacing;
            vertex(x, y);
        }
        endShape();
    }
}

function drawParticles() {
    for (let i = 0; i < 120; i++) {
        let x = noise(i, frameCount * 0.001) * width;
        let y = noise(i + 999, frameCount * 0.001) * height;
        let alpha = 70 + 40 * sin(frameCount * 0.01 + i);
        stroke(180, 240, 255, alpha);
        point(x, y);
    }
}

function drawMouseRing() {
    noFill();
    stroke(255, 255, 255, 40);
    ellipse(mouseX, mouseY, 80 + sin(frameCount * 0.2) * 10);
}

function mousePressed() {
    // 切換到下一個精靈圖
    currentSprite = (currentSprite + 1) % sprites.length;

    // 檢查是否點擊到精靈圖
    let currentCharacter = characters[`character${currentSprite + 1}`];
    let scale = currentCharacter.scale;
    let spriteWidth = currentCharacter.frameWidth * scale;
    let spriteHeight = currentCharacter.frameHeight * scale;

    if (
        mouseX > x &&
        mouseX < x + spriteWidth &&
        mouseY > y &&
        mouseY < y + spriteHeight
    ) {
        dragging = true;
        offsetX = mouseX - x;
        offsetY = mouseY - y;
    }

    // 檢查是否點擊關閉按鈕
    if (introBoxVisible) {
        let boxWidth = 400;
        let boxHeight = 200;
        let boxX = (width - boxWidth) / 2;
        let boxY = (height - boxHeight) / 2;
        let closeButtonSize = 20;
        let closeButtonX = boxX + boxWidth - closeButtonSize - 10;
        let closeButtonY = boxY + 10;

        if (dist(mouseX, mouseY, closeButtonX, closeButtonY) < closeButtonSize / 2) {
            introBoxVisible = false;
            return; // 提早結束
        }
    }

    // 新增節點，但限制總數量
    for (let i = 0; i < 15; i++) {
        if (nodes.length < 500) { // 限制節點總數不超過 500
            nodes.push({
                x: mouseX,
                y: mouseY,
                vx: random(-2, 2),
                vy: random(-2, 2),
                alpha: 255
            });
        }
    }
}

function mouseDragged() {
    if (dragging) {
        x = mouseX - offsetX;
        y = mouseY - offsetY;
    }
}

function mouseReleased() {
    dragging = false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function changeSprite(index) {
    currentSprite = index;
}
