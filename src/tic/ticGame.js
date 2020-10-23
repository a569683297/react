import React from "react";
import Board from "./board";
import Step from "./step";

export default class TicGame extends React.Component{


    constructor() {
        super();
        this.state={
            boardShowInfo:Array(9).fill(null),
            isX:true,
            winner:null,
            step:[],
        }
        this.squareClick = this.squareClick.bind(this)
    }

    render() {
        return (
            <div>
                <Board dataSource={this.state.boardShowInfo} squareClick={this.squareClick} winnerInfo={this.state.winner}/>
                <div>下一个玩家 : {this.state.isX ? "X" : "O"}</div>
                <div>获胜方 : {this.state.winner ? this.state.winner.win : "锅盖"}</div>
                <Step dataSource={this.state.step}/>
                <div onClick={()=>this.reStart()}>重新开始</div>
            </div>
        )
    }

    reStart(){
        this.setState({
            boardShowInfo:Array(9).fill(null),
            isX:true,
            winner:null,
            step:[],
        })
    }

    squareClick(e){
        const newBoardShowInfo = this.state.boardShowInfo
        newBoardShowInfo.splice(e.row*3 + e.col , 1 ,this.state.isX === true ? "X" : "O")

        if (!this.state.winner){
            // 步骤
            this.state.step.push(
                {
                    use:this.state.isX ? "X":"O",
                    row:e.row,
                    col:e.col,
                }
            )

            this.setState({
                boardShowInfo:newBoardShowInfo,
                isX:!this.state.isX,
                winner:this.calculateWinner(newBoardShowInfo),
                step:this.state.step,
            })
        }
    }

    calculateWinner(squares){

        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for(let i = 0;i<lines.length;i++){
            const [a, b, c] = lines[i];
            if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
                const winner = {
                    indexArr:[a,b,c],
                    win: squares[a]
                }
                return winner
            }

        }

        //检查是否平局
        if (!squares.includes(null)){
            const winner = {
                indexArr:[],
                win:"平局"
            }
            return winner
        }

        return null
    }
}
