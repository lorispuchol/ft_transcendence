import previewpong from "./img/previewpong.png"
import './Header.scss'
import { NavLink } from "react-router-dom";

export default function Header() {
	return (
		<div className="basic">
				<div className="preview_pong"><NavLink to="/game" ><img src={previewpong} alt="pong.png"></img></NavLink></div>
				<div className="text_pong">
					<p className="mx-auto w-9/12 font_pong">Notre site EL PONGO est un réseau social qui vous permet de discuter dans divers salons de discussion ainsi que par messages privés.
					Il vous est également possible de jouer au jeu révolutionnaire PONG.</p>
				</div>
		</div>
	);
}