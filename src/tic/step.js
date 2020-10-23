import React from "react";


export default class Step extends React.Component{

    constructor() {
        super();
        this.state = {
            curSelect:null,
            reverse:false,
        }
    }

    renderStep(){
        const steps = []
        const {reverse} = this.state
        const dataSource = this.props.dataSource

        for (let i = reverse ? dataSource.length - 1 : 0 ; reverse ?  i >= 0 : i < this.props.dataSource.length; reverse ? i-- : i++ ) {
            steps.push(
                <div key={"step" + i} onClick={(e) =>this.change(e,i)}
                     style={this.state.curSelect === i ? {fontSize:20}:{}}>
                    {"第 " +  (i + 1)  + " 步  用户 : " + dataSource[i].use + "   行 ：" + (dataSource[i].row + 1) + "   列" + (dataSource[i].col+1)}
                </div>
            )
        }
        return steps

    }

    change (e ,index) {
        this.setState({
            curSelect:index
        })
    }

    reverse(){
        this.setState({
            reverse:!this.state.reverse
        })
    }

    render() {
        if (this.props.dataSource.length === 0){
            this.state.curSelect = null
        }
        return (
            <div>
                {this.renderStep()}
                <div onClick={()=>this.reverse()}>步骤倒序</div>
            </div>
        )
    }

}
