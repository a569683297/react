import React from 'react';
import ReactDOM from 'react-dom';
import GraphicalModels  from "./graphicalModels";
import {createSquare,transformL,transformUL,transformZ,transformUZ,transformT} from "./squareType";
import './index.css';

var timer = null;
export default class SubfaceGame extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			graphicalModel : new GraphicalModels(),//下落图形的画布
			subfaceModel   : new GraphicalModels(),//保存图形的画布
			squareItem     : createSquare(),//下落的图形
			timeInterval   : {interval:1000},//下落时间
			nextSquareItem : {nextSquare:createSquare()},//下一个图形
			tIndex         : {type:'',index:-1}, // 变换图形的下标
			tLock          : {cState:false},//旋转锁
		}
	}
	//初始化下落画布,白色的可以看见
	createSubfaceMap(){
		let data = this.state.graphicalModel.subface;
		let rs = [];
		for(let i = 0;i<data.length * data[0].length;i++){
			let col = parseInt((i / data[0].length).toString());// /号代表除法32/15 = 2代表的是行
			let row = parseInt((i % data[0].length).toString()); // %号代表的是求余  32%15 = 2 代表的是列
			let sideL = 30;
			let color = data[col][row][1];
			rs.push(
				<div key={'graphicalModel'+i} style={{
					width:sideL,
					height:sideL,
					position:"absolute",
					top:col * sideL,
					left:row * sideL,
					backgroundColor:color,
					border:data[col][row][0] === 1 ? 'black solid thin' : 'black solid thin'
				}}
				></div>
			)
		}
		return rs
	}
	//初始化保存图形的画布
	createGraphicalMap(){
		let data = this.state.subfaceModel.subface;
		let rs = [];
		for(let i = 0;i<data.length * data[0].length;i++){
			let col = parseInt((i / data[0].length).toString());// /是除法，代表的是行
			let row = parseInt((i % data[0].length).toString());// %是求余   代表的是列
			let sideL = 30;
			let color = data[col][row][1];
			rs.push(
				<div key={"subfaceModel"+i} style={{
					width:sideL,
					height:sideL,
					position:"absolute",
					top:sideL * col,
					left:sideL * row,
					backgroundColor:color,
					border:'black solid thin',
					opacity:data[col][row][0] == 1 ? 1:0
				}}></div>
			)
		}
		return rs;
	}
	//初始化右侧下一步图形
	nextSquareShow(){
		let data = [];
		let rs = [];
		for(let i = 0;i<6;i++){
			data.push([]);
			for(let j = 0;j<6;j++){
				data[i].push(["0","white"])
			}
		}
		let nextSquareItem = this.state.nextSquareItem.nextSquare.square;
		for(let k = 0;k<nextSquareItem.length;k++){
			for(let m = 0;m<nextSquareItem[k].length;m++){
				if(nextSquareItem[k][m] == 1){
					//这里的+2和+1没有重大的意义   只是如果不加的话 下一个图形会紧贴着白色下落菜单区域
					data[k+2][m+1][0] =  1;
					data[k+2][m+1][1] = this.state.nextSquareItem.nextSquare.color;
				}
			}
		}
		for (let i = 0; i < data.length * data[0].length; i++) {
			let col = parseInt((i / data[0].length).toString());
			let row = parseInt((i % data[0].length).toString());
			let sideL = 30;
			let color = data[col][row][1];
			rs.push(
				<div key={'nextSquare' + i} style={{
					position: 'absolute',
					top: sideL * col,
					left: 450 + sideL * row,
					width: sideL,
					height: sideL,
					backgroundColor:color,
					border: 'black solid thin',
					opacity:data[col][row][0] == 1 ? 1: 0
				}}></div>
			)
		}
		return rs
	}
	//初始当前下落的图形
	initOneSquare(){
		let squareItem = this.state.squareItem;
		for(let i = 0;i<squareItem.square.length;i++){
			for(let j = 0;j<squareItem.square[i].length;j++){
				if(squareItem.square[i][j] == 1){
					this.state.graphicalModel.subface[i + squareItem.top][j + squareItem.left][0] = 1;
					this.state.graphicalModel.subface[i + squareItem.top][j + squareItem.left][1] = squareItem.color
				}
			}
		}
		this.setState({
			tLock : {cState:false},
			graphicalModel:this.state.graphicalModel
		})
	}
	//React钩子函数
	componentDidMount(){
		window.addEventListener("keydown",(e)=>{
			if(e.key == "ArrowLeft"){
				this.move("left")
			}else if(e.key == "ArrowRight"){
				this.move("right")
			}else if(e.key == "ArrowDown"){
				this.autoSquareFalling();
			}else if(e.key == "ArrowUp"){
				let maxLength = 0;
				if(this.state.squareItem.type == "Z" || this.state.squareItem.type == "UZ" || this.state.squareItem.type == "I" || this.state.squareItem.type == "O"){
					maxLength = 1;
				}else{
					maxLength = 3;
				}
				if(this.state.tIndex.index >= maxLength){
					this.state.tIndex.index = 0;
				}else{
					this.state.tIndex.index++;
				}
				this.changeSquare();
			}else if(e.key == " "){
				window.clearInterval(this.timePromise);
				this.timePromise = setInterval(()=>this.autoSquareFalling(),1)
			}
		})
		this.start();
	}
	//图形变换
	changeSquare(){
		//如果被锁定  不能转换图形
		if (this.state.tLock.cState == true) return;
		//清空画布  处理旋转  再渲染图形
		let newGraphicalModel = new GraphicalModels();
		let squareItem = this.state.squareItem;
		this.state.graphicalModel.subface = newGraphicalModel.subface;
		if(squareItem.type == "I"){
			let trI = [];
			//棍形是列变成行  行变成列
			for(let i = 0;i < squareItem.square[0].length;i++){
				trI[i] = []
			}
			for(let i = 0;i < squareItem.square.length;i++){
				for(let j = 0;j < squareItem.square[i].length;j++){
					trI[j][i] = squareItem.square[i][j]
				}
			}
			this.checkTransformSpace(trI);
			console.log(trI);
		}else if(squareItem.type == "Z"){
			this.checkTransformSpace(transformZ()[this.state.tIndex.index]);
		}else if(squareItem.type == "UZ"){
			this.checkTransformSpace(transformUZ()[this.state.tIndex.index]);
		}else if(squareItem.type == "L"){
			this.checkTransformSpace(transformL()[this.state.tIndex.index]);
		}else if(squareItem.type == "UL"){
			this.checkTransformSpace(transformUL()[this.state.tIndex.index]);
		}else if(squareItem.type == "T"){
			this.checkTransformSpace(transformT()[this.state.tIndex.index]);
		}
	}
	checkTransformSpace(p){
		console.log(p);
		if(this.state.graphicalModel.subface.length < p.length + this.state.squareItem.top||
		this.state.graphicalModel.subface[0].length < p[0].length + this.state.squareItem.left){
			return false;
			this.state.tLock.cState = true;
		}
		let curSquareXY = [];
		for(let i = 0;i< p.length;i++){
			for(let j = 0;j < p[i].length;j++){
				if(p[i][j] == 1){
					curSquareXY.push(
						[this.state.squareItem.top + i,this.state.squareItem.left + j]
					)
				}
			}
		}
		let subFacePosition = [];
		for(let k = 0;k < curSquareXY.length;k++){
			subFacePosition.push(
				this.state.subfaceModel.subface[curSquareXY[k][0]][curSquareXY[k][1]][0]
			)
		}
		let isTransform = subFacePosition.includes(1);//为true的时候不能旋转
		if(!isTransform){
			this.state.squareItem.square = p;
			this.initOneSquare()
		}else{
			// 出现一次不能旋转后 锁定旋转操作 左右操作或新生成块是解锁
			this.state.tLock.cState = true;
		}
		
	}
	//自动下落
	autoSquareFalling(){
		//每次需要重新新建一个当前下落图形的画布  不然会出现下落的图形重复的问题
		this.state.graphicalModel.subface = new GraphicalModels().subface;
		let isDown = this.checkNextSquareLocation(this.state.squareItem);
		this.state.squareItem.top += 1;
		if(isDown === -1){
			this.initOneSquare();
		}else{
			//图形触底，需要保存当前下落的图形 并新生出一个图形
			clearInterval(this.timePromise);
			this.saveToSubfaceMap();//保存图形
			this.resetAndNewSquare();//生成下一个图形
		}
	}
	//开始
	start(){
		this.initOneSquare();
		this.timePromise = setInterval(()=>this.autoSquareFalling(),this.state.timeInterval.interval)
	}
	//检验当前图形是否还能再往下落
	checkNextSquareLocation(squareItem){
		let curSquareXY = [];
		if(squareItem.top >= this.state.graphicalModel.subface.length - squareItem.square.length) return 1;
		for(let i = 0;i<squareItem.square.length;i++){
			for(let j = 0;j<squareItem.square[i].length;j++){
				if(squareItem.square[i][j] == 1){
					curSquareXY.push(
						[squareItem.top + i + 1,squareItem.left + j]
					)
				}
			}
		}
		//判断保存画布上是否该坐标区域内包含1  包含1代表存在图形  就不能继续下落
		let subFacePosition = [];
		for(let i = 0;i < curSquareXY.length;i++){
			subFacePosition.push(
				this.state.subfaceModel.subface[curSquareXY[i][0]][curSquareXY[i][1]][0]
			)
		}
		let isDown = subFacePosition.indexOf(1);
		return isDown;
	}
	//保存当前图形
	saveToSubfaceMap(){
		let saveIndex = [];
		for(let i = 0;i<this.state.squareItem.square.length;i++){
			for(let j = 0;j<this.state.squareItem.square[i].length;j++){
				if(this.state.squareItem.square[i][j] == 1){
					//这里top - 1是因为拿当前坐标的下一坐标去判断的   所以要减去1  保存当前坐标的图形
					saveIndex.push([
						(this.state.squareItem.top) + i - 1, (this.state.squareItem.left) +j
					])
				}
			}
		}
		for(let k = 0;k < saveIndex.length;k++){
			this.state.subfaceModel.subface[saveIndex[k][0]][saveIndex[k][1]][0] = 1;
			this.state.subfaceModel.subface[saveIndex[k][0]][saveIndex[k][1]][1] = this.state.squareItem.color;
 		}
		//找到满足删除的行
		let allSubFaceValue = [];
		for(let i = 0;i<this.state.subfaceModel.subface.length;i++){
			let columnValue = [];
			for(let j = 0;j < this.state.subfaceModel.subface[i].length;j++){
				columnValue.push(this.state.subfaceModel.subface[i][j][0])
			}
			if(!columnValue.includes(0)){
				allSubFaceValue.push(i);
			}
		}
		for(let k = 0;k < allSubFaceValue.length;k++){
			this.state.subfaceModel.subface.splice(allSubFaceValue[k],1);
			this.state.subfaceModel.subface.unshift(new GraphicalModels().subface[0]);
		}
		//判断是否需要停止
		let oneList = [];//保存图形的画布第一步是否存在值
		for(let n = 0;n < this.state.subfaceModel.subface[0].length;n++){
			oneList.push(this.state.subfaceModel.subface[0][n][0]);
		}
		if(oneList.includes(1)){
			clearInterval(this.timePromise);
		}
		this.setState({
			subfaceModel:this.state.subfaceModel
		})
	}
	//当前图形触底了，把右上角展示的下一个图形付给当前下落的对象
	resetAndNewSquare(){
		//将右侧的下个图形赋给当前下落图形
		this.state.squareItem = this.state.nextSquareItem.nextSquare;
		this.state.nextSquareItem.nextSquare = createSquare();
		this.initOneSquare();
		this.timePromise = setInterval(() => this.autoSquareFalling(), this.state.timeInterval.interval);
	}
	//移动
	move(type){
		this.state.tLock.cState = false;
		//先清空下落的图形画布  再新生成一个滑块  不然移动的时候会有卡顿的感觉
		this.state.graphicalModel.subface = new GraphicalModels().subface;
		if(type == 'left'){
			if(this.state.squareItem.left < 1) return
			if(!this.checkAroundSquareLocation("left")){
				this.state.squareItem.left -= 1;
			}
		}else if(type == "right"){
			//这里为什么要-1  因为判断是下一步的位置  所以要减1
			if(this.state.squareItem.left > this.state.graphicalModel.subface[0].length - this.state.squareItem.square[0].length - 1) return
			if(!this.checkAroundSquareLocation("right")){
				this.state.squareItem.left += 1;
			}
		}
		this.initOneSquare();
	}
	//判断当前块是否能移动
	checkAroundSquareLocation(type){
		let curSquareXY = [];
		//获取到移动后的下落块的坐标
		for(let i = 0;i < this.state.squareItem.square.length;i++){
			for(let j = 0;j < this.state.squareItem.square[i].length;j++){
				if(this.state.squareItem.square[i][j] == 1){
					curSquareXY.push(
						[this.state.squareItem.left + j + (type == 'left'? -1 : 1),this.state.squareItem.top + i]
					)
				}
			}
		}
		//判断当前块下一个位置上是否有图形  也就是是否可以移动
		let subFacePosition = [];
		for(let i = 0;i < curSquareXY.length;i++){
			subFacePosition.push(
				this.state.subfaceModel.subface[curSquareXY[i][1]][curSquareXY[i][0]][0]
			)
		}
		//为true的时候  证明包含图形不能移动
		let isMove = subFacePosition.includes(1);
		return isMove;
	}
	render() {
	    return (
	        <div>
				{this.createSubfaceMap()}
				{this.createGraphicalMap()}
				{this.nextSquareShow()}
	        </div>
	    )
	}
}