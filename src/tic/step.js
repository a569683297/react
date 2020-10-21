import React from "react";


export default class Step extends React.Component{


    renderStep(){
        return  this.props.dataSource.map((item,index)=> (
                <div>
                    {"用户 : " + item.use + "   行 ：" + (item.row + 1) + "   列" + (item.col+1)}
                </div>
            )
        )
    }

    render() {
        return (
            <div>
                {this.renderStep()}
            </div>
        )
    }

}
