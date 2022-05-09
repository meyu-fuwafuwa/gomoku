let canvas = document.getElementById("myCanvas");

//キャンバス大きさ指定
const cSize = document.getElementById('gomoku-left').clientWidth;
canvas.setAttribute('width', cSize);
canvas.setAttribute('height', cSize);
window.addEventListener('resize', resizeCanvas);
function resizeCanvas(){
    const cSize = document.getElementById('gomoku-left').clientWidth;
    canvas.setAttribute('width', cSize);
    canvas.setAttribute('height', cSize);
    draw();
}

let ctx = canvas.getContext("2d");
const bg_color = "#fef1e1";
const line_color = "#8c3249";
const maru_color = "#ffa3b2"
const batsu_color = "#1cd8fe";

let turn = 0;

//フィールドサイズ指定とフィールド配列宣言
const field_size = 8;
let fieldArray = new Array(field_size);
for(var i=0; i<field_size; i++){
    fieldArray[i] = new Array(field_size);
    for(var j=0; j<field_size; j++){
        fieldArray[i][j]=2;
    }
}
//  com判定用
let comArray = new Array(field_size);
for(var i=0; i<field_size; i++){
    comArray[i] = new Array(field_size);
    for(var j=0; j<field_size; j++){
        comArray[i][j]=0;
    }
}


draw();


canvas.onclick = function(e){
    if(turn == 0){
        var rect = e.target.getBoundingClientRect();
        mouseX = e.clientX - Math.floor(rect.left);
        mouseY = e.clientY - Math.floor(rect.top);
        var x = Math.floor(mouseX/(canvas.width/field_size));
        var y = Math.floor(mouseY/(canvas.width/field_size));
        //alert("click ("+x + ", "+ y+ ")" );
        if(fieldArray[x][y] == 2){
            fieldArray[x][y]=turn;
            turnChange();
            draw();
            if(!finishGame()) setTimeout(turnCom, 1000);
        }
    }
};

function modalClose(){
    document.getElementById("modal").classList.add("none");
}

function turnChange(){
    turn = (turn+1)%2;
    if(turn == 0) {
        document.getElementById("turn_you").classList.remove("none");
        document.getElementById("turn_com").classList.add("none");
    }else{
        document.getElementById("turn_you").classList.add("none");
        document.getElementById("turn_com").classList.remove("none");
    }
}



function finishGame() {
    let sw = true;
    if(endDecision() == 0){ //勝敗がついた
        alert("あなたの勝ちです。\nおめでとうございます！");
        document.getElementById("win").classList.remove("none");
    }else if(endDecision() == 1){
        alert("あなたの負けです。\n残念！");
        document.getElementById("lose").classList.remove("none");
    }else{
        if( hikiwakeDecision() ){
            alert("引き分けです");
            document.getElementById("hikiwake").classList.remove("none");
        } else {
            sw =  false;
        }
    }
    if(sw){
        document.getElementById("turn_you").classList.add("none");
        document.getElementById("turn_com").classList.add("none");
        turn = 3;
    }
    return sw;
}


function drawField(i,j){
    ctx.beginPath();
    ctx.fillStyle = line_color;
    ctx.rect(canvas.width/field_size*i, canvas.height/field_size*j, canvas.width/field_size, canvas.height/field_size);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = bg_color;
    ctx.rect(canvas.width/field_size*i+2, canvas.height/field_size*j+2, canvas.width/field_size-4, canvas.height/field_size-4);
    ctx.fill();
    ctx.closePath();
}
function drawMaru(i,j){
    ctx.beginPath();
    ctx.fillStyle = maru_color;
    var hankei = canvas.width/field_size/7*3; //半径
    var chusinX = canvas.width/field_size*i + canvas.width/field_size/2; //中心X
    var chusinY = canvas.height/field_size*j + canvas.width/field_size/2; //中心Y
    ctx.arc( chusinX, chusinY, hankei, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = bg_color;
    hankei = canvas.width/field_size/4; //半径
    ctx.arc( chusinX, chusinY, hankei, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
    ctx.fill();
    ctx.closePath();
}
function drawBatsu(i,j){
    var hankei = canvas.width/field_size/2; //半径
    var chusinX = canvas.width/field_size*i + canvas.width/field_size/2; //中心X
    var chusinY = canvas.height/field_size*j + canvas.width/field_size/2; //中心Y
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = batsu_color;
    ctx.translate(chusinX, chusinY);
    ctx.rotate((45 * Math.PI) / 180);//回転 (45°)
    ctx.rect(-hankei/4, -hankei, hankei/2, hankei*2);//四角形を作成
    ctx.rect(-hankei, -hankei/4, hankei*2, hankei/2);//四角形を作成
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

/**************************************************/
/* 終了判定 */
/* oが勝ったら0, ×が勝ったら1, 勝負が続くなら2を返す*/
/**************************************************/
function endDecision(){
    //縦５つ調べる
    for(var i=0; i<field_size; i++){
        for(var j=0; j<field_size-4; j++){
            if(fieldArray[i][j]!=2){
                let sw = true;
                for(var k=0;k<5;k++){
                    if(fieldArray[i][j+k]!=fieldArray[i][j]) sw = false;
                }
                if(sw) return fieldArray[i][j];
            }
        }
    }
    //横５つ調べる
    for(var i=0; i<field_size-4; i++){
        for(var j=0; j<field_size; j++){
            if(fieldArray[i][j]!=2){
                let sw = true;
                for(var k=0;k<5;k++){
                    if(fieldArray[i+k][j]!=fieldArray[i][j]) sw = false;
                }
                if(sw) return fieldArray[i][j];
            }
        }
    }
    //左上～右下５つ調べる
    for(var i=0; i<field_size-4; i++){
        for(var j=0; j<field_size-4; j++){
            if(fieldArray[i][j]!=2){
                let sw = true;
                for(var k=0;k<5;k++){
                    if(fieldArray[i+k][j+k]!=fieldArray[i][j]) sw = false;
                }
                if(sw) return fieldArray[i][j];
            }
        }
    }
    //右上～左下５つ調べる
    for(var i=field_size-4; i<field_size; i++){
        for(var j=0; j<field_size-4; j++){
            if(fieldArray[i][j]!=2){
                let sw = true;
                for(var k=0;k<5;k++){
                    if(fieldArray[i-k][j+k]!=fieldArray[i][j]) sw = false;
                }
                if(sw) return fieldArray[i][j];
            }
        }
    }
    return 2;
}
/**************************************************/
/* 引き分け判定 */
/* 引き分け（全部埋まった）ならtrue, 引き分けでないならfalseを返す*/
/**************************************************/
function hikiwakeDecision(){
    for(var i=0; i<field_size; i++){
        for(var j=0; j<field_size; j++){
            if(fieldArray[i][j] == 2){
                return false;
            }
        }
    }
    return true;
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i=0; i<field_size; i++){
        for(var j=0; j<field_size; j++){
            drawField(i,j);
            if(fieldArray[i][j]==0) drawMaru(i,j);
            else if(fieldArray[i][j]==1) drawBatsu(i,j);
        }
    }
}

/******************************************************/
//コンピューターが打つ手を考える
/******************************************************/
function turnCom(){
    let xx = 0;
    let yy = 0;

    for(var i=0; i<field_size; i++){
        for(var j=0; j<field_size; j++){
            comArray[i][j]=0;
        }
    }

    //縦５つ調べる
    for(var i=0; i<field_size; i++){
        for(var j=0; j<field_size-4; j++){
            let ten = 1;
            for(var k=0;k<5;k++){
                if(fieldArray[i][j+k]==0) ten=ten*10;
            }
            for(var k=0;k<5;k++){
                if(fieldArray[i][j+k]==2) comArray[i][j+k]+=ten;
            }
            ten = 1;
            for(var k=0;k<5;k++){
                if(fieldArray[i][j+k]==1) ten=ten*10;
            }
            for(var k=0;k<5;k++){
                if(fieldArray[i][j+k]==2) comArray[i][j+k]+=ten;
            }
        }
    }

    //横５つ調べる
    for(var i=0; i<field_size-4; i++){
        for(var j=0; j<field_size; j++){
            let ten = 1;
            for(var k=0;k<5;k++){
                if(fieldArray[i+k][j]==0) ten*=10;
            }
            for(var k=0;k<5;k++){
                if(fieldArray[i+k][j]==2) comArray[i+k][j]+=ten;
            }
            ten = 1;
            for(var k=0;k<5;k++){
                if(fieldArray[i+k][j]==1) ten*=10;
            }
            for(var k=0;k<5;k++){
                if(fieldArray[i+k][j]==2) comArray[i+k][j]+=ten;
            }
        }
    }
    //左上～右下５つ調べる
    for(var i=0; i<field_size-4; i++){
        for(var j=0; j<field_size-4; j++){
            let ten = 1;
            for(var k=0;k<5;k++){
                if(fieldArray[i+k][j+k]==0) ten*=10;
            }
            for(var k=0;k<5;k++){
                if(fieldArray[i+k][j+k]==2) comArray[i+k][j+k]+=ten;
            }
            ten = 1;
            for(var k=0;k<5;k++){
                if(fieldArray[i+k][j+k]==1) ten*=10;
            }
            for(var k=0;k<5;k++){
                if(fieldArray[i+k][j+k]==2) comArray[i+k][j+k]+=ten;
            }
        }
    }
    //右上～左下５つ調べる
    for(var i=field_size-4; i<field_size; i++){
        for(var j=0; j<field_size-4; j++){
            let ten = 1;
            for(var k=0;k<5;k++){
                if(fieldArray[i-k][j+k]==0) ten*=10;
            }
            for(var k=0;k<5;k++){
                if(fieldArray[i-k][j+k]==2) comArray[i-k][j+k]+=ten;
            }
            ten = 1;
            for(var k=0;k<5;k++){
                if(fieldArray[i-k][j+k]==1) ten*=10;
            }
            for(var k=0;k<5;k++){
                if(fieldArray[i-k][j+k]==2) comArray[i-k][j+k]+=ten;
            }
        }
    }

    //Console.log出力用
    /*
    for(var j=0; j<field_size; j++){
        var len = j+": ";
        for(var i=0; i<field_size; i++){
            if(fieldArray[i][j] == 0){
                len = len + " O";
            }else if(fieldArray[i][j] == 1){
                len = len + " X";
            }else{
                len = len + " " + comArray[i][j];
            }
        }
        console.log(len);
    }
    */

    for(var j=0; j<field_size; j++){
        for(var i=0; i<field_size; i++){
            if(comArray[xx][yy] < comArray[i][j]){
                xx = i;
                yy = j;
            }
        }
    }
    if(fieldArray[xx][yy] == 2){
        fieldArray[xx][yy]=turn;
        turnChange();
        draw();
        finishGame();
    }else{
        alert("プログラムエラー: コンピュータが選択した場所が空白ではありません");
    }

}
