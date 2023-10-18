import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import ErrorHandling from "../../utils/Error";
import Loading from "../../utils/Loading";
import { Avatar, Paper } from "@mui/material";

import { defaultAvatar } from "../../pages/Profile/Profile";

import './MatchHistory.scss'
import { UserContext } from "../../utils/Context";

interface UserData {
	id: number,
	avatar: string,
	login: string,
	username: string,
	nb_victory: number,
	nb_defeat: number,
}

interface MatchData {
	id: number,
	winner: UserData,
	loser: UserData,
	mode: string,
	winner_score: number,
	loser_score: number,
	date: Date,
}

interface Response {
	status: string,
	Match?: MatchData,
	error?: string,
}

interface MatchProps {
	Match: MatchData,
}

interface UserProps {
	ProfileId: number
}

function MatchHistoryElem({ Match }: MatchProps) {
	// console.log(Match);
	const me = useContext(UserContext);
	console.log(me);
	if (Match.winner.username === me)
		return (
			<Paper className="mh_card_w">
				{Match.loser.avatar === null ?<Avatar src={defaultAvatar} alt="defaultAvatar"/> : <Avatar src={Match.loser.avatar} alt="loserAvatar"/>}
				<div>{Match.loser.username}</div>
				<div>{Match.winner_score} - {Match.loser_score}</div>
				<div>{Match.mode}</div>
			</Paper>
		)
	else
		return (
			<Paper className="mh_card_l">
				{Match.winner.avatar === null ?<Avatar src={defaultAvatar} alt="defaultAvatar"/> : <Avatar src={Match.winner.avatar} alt="winnerAvatar"/>}
				<div>{Match.winner.username}</div>
				<div>{Match.winner_score} - {Match.loser_score}</div>
				<div>{Match.mode}</div>
			</Paper>
		)
}

export default function MatchHistory(props: UserProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [matches, setMatches]: [MatchData[], Function] = useState([]);
	useEffect(() => {
		GetRequest("/game/history/" + props.ProfileId).then((response) => {
			setResponse(response);
			if (response.data)
				setMatches(response.data);
		});
	}, [props.ProfileId]);

	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	// const Match = {
	// 	id: response.Match.id,
	// 	winner: response.Match.winner,
	// 	loser: response.Match.loser,
	// 	mode: response.Match.mode,
	// 	winner_score: response.Match.winner_score,
	// 	loser_score: response.Match.loser_score,
	// 	date: response.Match.date,
	// }
	
	return (
		<div className="mh_base">
			{matches.length > 0 ?
				matches.sort((matcha: MatchData, matchb: MatchData) => (matchb.id - matcha.id)).slice(0, 5).map((match: MatchData) => (
					// <div className='grid grid-cols-7'>
					// 	<div className='mh_score col-span-2'>{match.winner.username}</div>
					// 	<div className='mh_score'>{match.winner_score}</div>
					// 	<div className='mh_score'>VS</div>
					// 	<div className='mh_score'>{match.loser_score}</div>
					// 	<div className='mh_score col-span-2'>{match.loser.username}</div>
					// </div>
					<MatchHistoryElem key={match.id} Match={match}/>
				))
			:
			<div>NUUUUL</div>
		}
		</div>
	);
}