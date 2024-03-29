import { NavLink, useLocation } from 'react-router-dom';
import './NavBar.scss'
import { useContext, useEffect, useState } from 'react';
import menu_btn from './img/menu_btn.png';
import kirby from './img/kirby.jpeg';
import title from './img/splatong.png';
import Avatar from '@mui/material/Avatar';
import EventList from '../event/EventList';
import { Paper } from '@mui/material';
import { UserContext } from '../../utils/Context';
import { GetRequest } from '../../utils/Request';
import Loading from '../../utils/Loading';
import ErrorHandling from '../../utils/Error';
import { defaultAvatar } from '../../pages/Profile/Profile';

interface Response {
	status: string,
	data?: string,
	error?: string,
}



export const NavBar = () => {
	const pages = [['GAMING', '/game'], ['CHAT', '/chat']];
	const [select, setSelect]: [string, Function] = useState(useLocation().pathname);
	const username = useContext(UserContext);


	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
		GetRequest("/user/avatar/" + username).then((response) => setResponse(response));
	}, [username]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	
	const avatar = response.data ? response.data : (defaultAvatar as string);

	function hanldeClick(path: string) {
		setSelect(path);
	}

	function openMenu() {
		const menu_btn = document.querySelector(".menu_btn");
		const nav_links = document.querySelector(".nav_bar_link");
		const mobile_notif = document.querySelector(".mobile_notif");

		if (menu_btn) {
				if (nav_links) {
					nav_links.classList.toggle('mobile_menu');
					if (mobile_notif)
						mobile_notif.classList.toggle('mobile_notif_off');
				}

		}
	}

	function handleResize() {
		const nav_links = document.querySelector(".nav_bar_link");
		const mobile_menu = document.querySelector(".mobile_menu");
		const mobile_notif_off = document.querySelector(".mobile_notif_off")
		const width = window.outerWidth;

		if (width > 637)
		{
			if (nav_links)
				if (mobile_menu) {
					mobile_menu.classList.toggle('mobile_menu');
				}
			if (mobile_notif_off)
				mobile_notif_off.classList.toggle('mobile_notif_off');
		}
	}

	window.addEventListener('resize', handleResize);

	return (
		<div>
			<Paper className='nav_bar'>
				<NavLink to={'/'} onClick={() => hanldeClick("home")}>
					<img className='nav_bar_img' src={kirby} alt="oui img"/>
				</NavLink>
				<img className='nav_bar_img' src={title} alt="splatong" />
				<nav className='nav_bar_link'>
					{pages.map((page) => (
						<NavLink key={page[0]} className={select === page[1] ? 'nav_bar_link_a' : 'nav_bar_link_p'} onClick={() => hanldeClick(page[1])} to={page[1]}>{page[0]}</NavLink>
					))}
					<EventList className='nav_bar_link_p' />
					<NavLink to={'/profile/' + username} onClick={() => hanldeClick("profile")}>
						<Avatar className={select === "profile" ? 'nav_bar_avatar_a' : 'nav_bar_avatar_p'}  src={avatar} alt="TEST"></Avatar>
					</NavLink>
				</nav>
				<div className='mobile_notif'><EventList className=''/></div>
				<button className='menu_btn'><img onClick={() => openMenu()} src={menu_btn} alt='menu_btn'/></button>
			</Paper>
		</div>
	)
}