import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 如果一个react组件只包含，render，不包含state


function Square(props){
	return(
		<button className="square" onClick={() => props.onClick()}>
		  {props.value}
		</button>
	);
}

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
			onClick = {()=>this.props.onClick(i)}
			/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  handleClick(i){
	  //这一步是为了,如果我们回到过去了,再次点击的时候,就会有问题,所以在历史记录的中截取从第0开始到当前步骤的数据
	  //例如现在又1,2,3  3步,那么当我们回到了第二部,再次点击的时候,如果不截取就会造成,之前点击过的无法点击.
	  // const history = this.state.history.slice(0,this.state.stepNumber + 1);
	  const history = this.state.history;
	  console.log(history);
	  const current = history[history.length - 1];
	  console.log(current);
	  const squares = current.squares.slice();
	  console.log(squares);
  	  if(calculateWinner(squares) || squares[i]){
  		  return
  	  }
  	  squares[i] = this.state.xIsNext?"X":"O";
  	  this.setState({
  		  history: history.concat([{
			  squares: squares,
			}]),
		  stepNumber:history.length,
  		  xIsNext:!this.state.xIsNext,
  	  });
  }
  jumpTo(step){
	  console.log(step);
	  this.setState({
		  stepNumber:step,
		  xIsNext:(step%2) === 0
	  })
  }
  constructor(props) {
      super(props);
	  this.state = {
		  history:[{
			  squares:Array(9).fill(null)
		  }],
		  stepNumber:0,
		  xIsNext:true
	  }
  }
  render() {
	const history = this.state.history;
	const current = history[this.state.stepNumber];
	const winner = calculateWinner(current.squares);
	
	const moves = history.map((step, move) => {
	  const desc = move ?
		'Go to move #' + move :
		'Go to game start';
		return(
			<li key={move}>
				<button onClick={()=>this.jumpTo(move)}>{desc}</button>
			</li>
		
		)
	});
	let status;
	if(winner){
		status = "Winner is :" + winner
	}else{
		status = "Next player is :" + (this.state.xIsNext?"X":"O")
	}
	
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
				 onClick = {(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares){
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
