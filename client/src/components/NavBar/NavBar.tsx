import { NavLink, useLocation } from 'react-router-dom';
import './NavBar.scss'
import { useState } from 'react';

import menu_btn from './img/menu_btn.png'

import Avatar from '@mui/material/Avatar';
import { defaultAvatar } from '../../pages/Profile/Profile';
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
				<img className='nav_bar_img' src={'data:image/jpeg;base64,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'} alt="oui img"/>
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