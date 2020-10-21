import React from "react";


export default class Square extends React.Component{
    render() {
        return (
            <button className="square" onClick={()=>this.squareClick()}>
                {this.props.label}
            </button>
        )
    }

    squareClick(){
        const squareInfo = {
            index:this.props.itemIndex,
            row:this.props.rowIndex,
            col:this.props.colIndex,
        }
        if (!this.props.label){
            this.props.squareClick(squareInfo)
        }

    }
}
