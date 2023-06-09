import React from 'react';
import './App.css';

function MyButton() {
	return (
		<button>
			log in
		</button>
	);
}


function App() {
	const user = {
		name: 'loris',
		imageUrl: 'https://cdn.intra.42.fr/users/2eb074494d7888e1d6cabd69dea349d0/lpuchol.jpg',
		imageSize: 90,
	};

  return (
	<div>
		<h1>
			{user.name}
		</h1>
		<img 
			className="avatar"
			src={user.imageUrl}
			alt={'photo of ' + user.name}
			style={{
				width: user.imageSize,
				height: user.imageSize
			}}
		/>
		<h1>Welcome</h1>
		<MyButton />
   </div>
  );
}

export default App;
