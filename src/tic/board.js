import React from "react";
import Square from "./square";

export default class Board extends React.Component{

    constructor() {
        super();
        this.squareClick = this.squareClick.bind(this)
    }

    render() {
        return (
            <div>
                {this.renderSquare()}
            </div>
        );
    }

    renderSquare(){
        const squares = []
        for (let i = 0; i < this.props.dataSource.length/3; i++) {
            squares.push(
                <div key={"row" + i} className= "board-row">
                    {this.getRow(i)}
                </div>
            )
        }
        return squares
    }

    getRow(rowIndex){
        const row = []
        for (let i = 0; i < 3; i++) {
            row.push(
                <Square key={"square" + i}
                        itemIndex={i+(rowIndex*3)}
                        label={this.props.dataSource[i+(rowIndex*3)]}
                        colIndex={i}
                        rowIndex={rowIndex}
                        winnerItem={this.checkWinnerItem(rowIndex,i)}
                        squareClick={this.squareClick}/>
            )
        }
        return row
    }

    checkWinnerItem(row,col){
        const location = col+(row*3)
        if (this.props.winnerInfo){
            return this.props.winnerInfo.indexArr.includes(location)
        }
        return false

    }

    squareClick(e){
        this.props.squareClick(e)
    }
}

