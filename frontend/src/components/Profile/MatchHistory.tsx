import { useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import ErrorHandling from "../../utils/Error";
import Loading from "../../utils/Loading";
import { Paper } from "@mui/material";

import { defaultAvatar } from "../../pages/Profile/Profile";

import './MatchHistory.scss'
import { NavLink } from "react-router-dom";

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
	userId: number
}

interface UserProps {
	ProfileId: number
}

function MatchHistoryElem({ Match, userId }: MatchProps) {
	if (Match.winner.id === userId)
		return (
			<Paper className="mh_card_w">
				{Match.loser.avatar === null ? <NavLink className="mh_card_navlink" to={'/profile/' + Match.loser.username}><img className="mh_card_avatar" src={defaultAvatar} alt="defaultAvatar" /></NavLink> 
				: <NavLink className="mh_card_navlink" to={'/profile/' + Match.loser.username}><img className="mh_card_avatar" src={Match.loser.avatar} alt="loserAvatar" /></NavLink>}
				<div className="mh_card_username"><NavLink to={'/profile/' + Match.loser.username}>{Match.loser.username}</NavLink></div>
				<div className="mh_card_result">
					<div>{Match.winner_score} - {Match.loser_score}</div>
					<div>{Match.mode}</div>
				</div>
			</Paper>
		)
	else
		return (
			<Paper className="mh_card_l">
				{Match.winner.avatar === null ?<NavLink className="mh_card_navlink" to={'/profile/' + Match.winner.username}><img className="mh_card_avatar" src={defaultAvatar} alt="defaultAvatar" /></NavLink>
				: <NavLink to={'/profile/' + Match.winner.username}><img className="mh_card_avatar" src={Match.winner.avatar} alt="winnerAvatar" /></NavLink>}
				<div className="mh_card_username"><NavLink to={'/profile/' + Match.winner.username}>{Match.winner.username}</NavLink></div>
				<div className="mh_card_result">
					<div>{Match.winner_score} - {Match.loser_score}</div>
					<div>{Match.mode}</div>
				</div>
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
	
	return (
		<div className="mh_base">
			{matches.length > 0 ?
				matches.sort((matcha: MatchData, matchb: MatchData) => (matchb.id - matcha.id)).slice(0, 5).map((match: MatchData) => (
					<MatchHistoryElem key={match.id} Match={match} userId={props.ProfileId}/>
				))
			:
			<Paper className="mh_card_l"><div>NO GAME</div><div>NO MATCH HISTORY</div></Paper>
		}
		</div>
	);
}