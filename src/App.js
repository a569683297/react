import React from 'react';
import SnakeGame from './component/snake/index.js'
import SubfaceGame from "./component/subface/index.js"
const App = () => {
    //入口切换
  return (
    <div className="App">
        {/* <SnakeGame /> */}
		{<SubfaceGame />}
    </div>
  );
};

export default App;