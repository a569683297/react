import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const boardWh = [600, 600]
const snakeItemWh = [10, 10]

export default class SnakeGame extends React.Component {
    constructor(props) {
        super();
        this.state = {
            snakeInfo: {
                width: snakeItemWh[0],
                height: snakeItemWh[1],
                bodyInfo: [
                    { x: boardWh[0] / snakeItemWh[0] / 2, y: boardWh[1] / snakeItemWh[1] / 2, color: "#fff" },
                    { x: boardWh[0] / snakeItemWh[0] / 2 + 1, y: boardWh[1] / snakeItemWh[1] / 2, color: "#fff" },
                    { x: boardWh[0] / snakeItemWh[0] / 2 + 1 + 1, y: boardWh[1] / snakeItemWh[1] / 2, color: "#fff" }
                ],
                direction: "left"
            },
            foodInfo: {
                width: snakeItemWh[0],
                height: snakeItemWh[1],
                x: Math.floor(Math.random() * (boardWh[0] / snakeItemWh[0])),
                y: Math.floor(Math.random() * (boardWh[1] / snakeItemWh[1])),
                color: "#fff",
            },
            foodIsEat: false,
            lastDirection: "right",//代表当前状态不能改变的方向；例如向左走不能出发向右的事件
            timer: null,
            gameRunning: false,
            gameOver: false,
            //移动速度设置
            timeInterval: { interval: 150 },

        }
    }
    componentDidMount() {
        const snakeInfo = this.state.snakeInfo;
        window.addEventListener("keydown", (e) => {
            console.log(e);
            if (e.key === "ArrowUp" && snakeInfo.direction !== "down" && this.state.lastDirection !== "top") {
                snakeInfo.direction = "top"
            } else if (e.key === 'ArrowDown' && snakeInfo.direction !== "top" && this.state.lastDirection !== "down") {
                snakeInfo.direction = 'down'
            } else if (e.key === 'ArrowLeft' && snakeInfo.direction !== "right" && this.state.lastDirection !== "left") {
                snakeInfo.direction = 'left'
            } else if (e.key === 'ArrowRight' && snakeInfo.direction !== 'left' && this.state.lastDirection !== "right") {
                snakeInfo.direction = 'right'
            } else if (e.key === " ") {
                this.gamePause()
            }
        })
    }
    gamePause() {
        if (this.state.gameRunning) {
            clearInterval(this.timer);
            this.state.gameRunning = false;

        } else {
            if (this.state.gameOver) {
                this.state.snakeInfo.bodyInfo = [
                    { x: boardWh[0] / snakeItemWh[0] / 2, y: boardWh[1] / snakeItemWh[1] / 2, color: "#fff" },
                    { x: boardWh[0] / snakeItemWh[0] / 2 + 1, y: boardWh[1] / snakeItemWh[1] / 2, color: "#fff" },
                    { x: boardWh[0] / snakeItemWh[0] / 2 + 1 + 1, y: boardWh[1] / snakeItemWh[1] / 2, color: "#fff" }
                ]
                this.state.snakeInfo.direction = "left";
            }
            this.gameStart();
        }
    }
    moveOne() {
        const { bodyInfo, direction } = this.state.snakeInfo;
        const { x, y } = this.state.foodInfo;
        const foodInfo = this.state.foodInfo
        for (let i = bodyInfo.length - 1; i > 0; i--) {
            bodyInfo[i].x = bodyInfo[i - 1].x;
            bodyInfo[i].y = bodyInfo[i - 1].y;
            bodyInfo[i].color = bodyInfo[i - 1].color;
        }
        switch (direction) {
            case "left":
                bodyInfo[0].x -= 1;
                this.state.lastDirection = "right";
                break;
            case "right":
                bodyInfo[0].x += 1;
                this.state.lastDirection = "left";
                break;
            case "top":
                bodyInfo[0].y -= 1;
                this.state.lastDirection = "down";
                break;
            case "down":
                bodyInfo[0].y += 1;
                this.state.lastDirection = "top";
                break;
        }
        const isCross = this.isCrossBorder(bodyInfo);
        const ifEatSelt = this.isEatSelfBody(bodyInfo);
        if (bodyInfo[0].x === x && bodyInfo[0].y === y) {
            this.state.foodIsEat = true;
            bodyInfo.push({ x: bodyInfo[bodyInfo.length - 1].x, y: bodyInfo[bodyInfo.length - 1].y, color: "#fff" })
        }
        if (!isCross && !ifEatSelt) {
            this.state.snakeInfo.bodyInfo = bodyInfo

        }
        this.setState({
            snakeInfo: this.state.snakeInfo,
            lastDirection: this.state.lastDirection
        })


    }
    gameStart() {
        if (!this.state.gameRunning) {
            this.setState({
                gameRunning: true,
                gameOver: false,
            })
            this.timer = setInterval(() => this.moveOne(), this.state.timeInterval.interval)
        }
    }
    isCrossBorder(body) {
        if (body[0].x < 0 || body[0].x > boardWh[0] / snakeItemWh[0] || body[0].y < 0 || body[0].y > boardWh[1] / snakeItemWh[1]) {
            clearInterval(this.timer);
            this.state.gameRunning = false;
            this.state.gameOver = true;
            return true
        }
        return false
    }
    isEatSelfBody(body) {
        const { bodyInfo } = this.state.snakeInfo;
        for (let i = 1; i < bodyInfo.length; i++) {
            if (bodyInfo[0].x === bodyInfo[i].x && bodyInfo[0].y === bodyInfo[i].y) {
                clearInterval(this.timer);
                this.state.gameRunning = false;
                this.state.gameOver = true;
                return true
            }
        }
        return false;
    }
    initFood() {
        const { foodInfo } = this.state;
        let x = foodInfo.x;
        let y = foodInfo.y;
        if (this.state.foodIsEat) {
            x = Math.floor(Math.random() * (boardWh[0] / snakeItemWh[0]))
            y = Math.floor(Math.random() * (boardWh[1] / snakeItemWh[1]))
            this.state.foodInfo.x = x
            this.state.foodInfo.y = y
            this.state.foodIsEat = false
        }
        const style = {
            width: foodInfo.width + "px",
            height: foodInfo.height + "px",
            position: "absolute",
            left: x * foodInfo.width + "px",
            top: y * foodInfo.height + "px",
            background: foodInfo.color
        }
        return (
            <div key={"food"} style={style} />
        )
    }
    initSnake() {
        const { bodyInfo } = this.state.snakeInfo;
        const snake = [];
        for (let i = 0; i < bodyInfo.length; i++) {
            snake.push(this.createSnakeSection(bodyInfo[i].x, bodyInfo[i].y, i, bodyInfo[i].color));
        }
        return snake
    }
    createSnakeSection(x, y, index, color) {
        const { snakeInfo } = this.state;
        const style = {
            width: snakeInfo.width + "px",
            height: snakeInfo.height + "px",
            position: "absolute",
            left: x * snakeInfo.width + "px",
            top: y * snakeInfo.height + "px",
            border: "solid 1px thin",
            background: index === 0 ? color : '#' + Math.floor(Math.random() * 0xffffff).toString(16),
            borderRadius: index === 0 ? this.changeHeader(snakeInfo) : null,
        }
        return (
            <div key={"snake" + index} style={style} />
        )

    }
    changeHeader(snakeInfo) {
        switch (snakeInfo.direction) {
            case "left":
                return "5px 0 0 5px"
            case "right":
                return "0 5px 5px 0 "
            case "top":
                return "5px 5px 0 0"
            case "down":
                return "0 0 5px 5px"
        }

    }
    render() {
        return (
            <div>
                <div id="board" className="board" style={{ width: boardWh[0], height: boardWh[1] }} />
                {this.initSnake()}
                {this.initFood()}
            </div>
        );
    }
}