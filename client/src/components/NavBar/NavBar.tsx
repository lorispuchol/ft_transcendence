import { NavLink, useLocation } from 'react-router-dom';
import './NavBar.scss'
import { useState } from 'react';
import menu_btn from './img/menu_btn.png';
import kirby from './img/kirby.jpeg';
import Avatar from '@mui/material/Avatar';
import { defaultAvatar } from '../../user/Profile';
import EventList from '../event/EventList';
import { Paper } from '@mui/material';

export const NavBar = () => {
	const pages = [['GAMING', '/game'], ['EVERYONE', '/everyone'], ['CHAT', '/chat'], ['404', '/ratio']];
	const [select, setSelect]: [string, Function] = useState(useLocation().pathname);

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

	// A optimiser
	function handleResize() {
		const nav_links = document.querySelector(".nav_bar_link");
		const mobile_menu = document.querySelector(".mobile_menu");
		const mobile_notif_off = document.querySelector(".mobile_notif_off")
		const width = window.outerWidth;

		// console.log(width);
		// console.log('i');
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
				<div className='title'>EL PONGO</div>
				<nav className='nav_bar_link'>
					{pages.map((page) => (
						<NavLink key={page[0]} className={select === page[1] ? 'nav_bar_link_a' : 'nav_bar_link_p'} onClick={() => hanldeClick(page[1])} to={page[1]}>{page[0]}</NavLink>
					))}
					<EventList className='nav_bar_link_p' />
					<NavLink to={'/profile'} onClick={() => hanldeClick("profile")}>
						<Avatar className={select === "profile" ? 'nav_bar_avatar_a' : 'nav_bar_avatar_p'}  src={defaultAvatar} alt="TEST"></Avatar>
					</NavLink>
				</nav>
				<div className='mobile_notif'><EventList className=''/></div>
				<button className='menu_btn'><img onClick={() => openMenu()} src={menu_btn} alt='menu_btn'/></button>
			</Paper>
		</div>
	)
}