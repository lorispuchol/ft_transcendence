import { Avatar } from '@mui/material';
import lsuau from './img/lsuau.jpg'
import lpuchol from './img/lpuchol.jpg'
import mapontil from './img/mapontil.jpg'
import './Us.scss'
import '../../pages/LogIn/LogIn.scss'

export default function Us() {
	return (
		<div className='basic'>
			<div className='flex justify-center container_m mr-4'>
					<div className='avatar'><Avatar src={lsuau} sx={{ width: 128, height: 128 }}></Avatar></div>
					<p className='font'>Lucas Suau</p>
					<p className='font'>bla bla bla bla bla bla bla</p>
			</div>
			<div className='flex justify-center container_m'>
					<div className='avatar'><Avatar src={lpuchol} sx={{ width: 128, height: 128 }}></Avatar></div>
					<p className='font'>Loris Puchol</p>
					<p className='font'>bla bla bla bla</p>
			</div>
			<div className='flex justify-center container_m ml-4'>
					<div className='avatar'><Avatar src={mapontil} sx={{ width: 128, height: 128 }}></Avatar></div>
					<p className='font'>Maxime Pontille</p>
					<p className='font'>blablabla fssdfj</p>
			</div>
		</div>
	);
}