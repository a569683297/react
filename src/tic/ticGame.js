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
        console.log(this.state.step)
        return (
            <div>
                <Board dataSource={this.state.boardShowInfo} squareClick={this.squareClick}/>
                <div>
                    获胜方 : {this.state.winner ? this.state.winner : "锅盖"}
                </div>
                <Step dataSource={this.state.step}/>
            </div>
        )
    }

    squareClick(e){
        console.log(e)
        const newBoardShowInfo = this.state.boardShowInfo
        newBoardShowInfo.splice(e.row*3 + e.col , 1 ,this.state.isX === true ? "X" : "O")

        // 步骤
        this.state.step.push(
            {
                use:this.state.isX ? "X":"O",
                row:e.row,
                col:e.col,
            }
        )

        if (!this.state.winner){
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
                return squares[a]
            }

        }
        return null
    }
}
