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
                        colIndex={i} rowIndex={rowIndex}
                        squareClick={this.squareClick}/>
            )
        }
        return row
    }

    squareClick(e){
        this.props.squareClick(e)
    }
}

