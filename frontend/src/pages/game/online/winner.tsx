

export default function DisplayWinner({ winnerId }: { winnerId: number }) {
	
	if (winnerId === -1)
		return (<></>);
	return (<h1 className="get_ready left-[21vw] top-[20vw]">{winnerId}</h1>);
}
