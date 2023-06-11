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
		imageSize: 250,
	};
	const bouton = <MyButton />;
	const products = [
		{ title: 'Cabbage', id: 1 },
		{ title: 'Garlic', id: 2 },
		{ title: 'Apple', id: 3 },
	];

  return (
	<div>
		<h1><a
			href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfJ8vUgJfEaBtkAd3yWLXpZb2okK11ZtfxvDj0Thc&usqp=CAE&s"
			title="big floppa"
			target="_blank"
		>
			<p className="desc">Mi <strong>gato</strong></p>
		</a></h1>
		<img
			className="flopa"
			src="https://i.kym-cdn.com/entries/icons/original/000/034/421/cover1.jpg"
			alt="flopa"
			style={{
				width: user.imageSize + 50,
				height: user.imageSize
			}}
		/>
		<input type="text" disabled />
		<input type="text" />
		{/* <h1>
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
		{bouton} */}
   </div>
  );
}

export default App;
