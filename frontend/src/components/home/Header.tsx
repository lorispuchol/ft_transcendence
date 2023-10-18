import previewpong from "./img/previewpong.png"
import './Header.scss'

export default function Header() {
	return (
		<div className="basic">
				<img className="preview_pong" src={previewpong} alt="pong.png"></img>
				<div className="text_pong">
					<p className="mx-auto w-9/12 font_pong">Notre site EL PONGO est un réseau social qui vous permet de discuter dans divers salons de discussion ainsi que par messages privés.
					Il vous est également possible de jouer au jeu révolutionnaire PONG.</p>
				</div>
		</div>
	);
}