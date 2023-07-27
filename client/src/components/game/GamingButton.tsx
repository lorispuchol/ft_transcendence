import { VideogameAsset } from "@mui/icons-material"
import { Button } from "@mui/material"
import { primaryColor } from "../../fonts/color"

interface GamingButtonProps {
	login: string
}

export default function GamingButton({ login }: GamingButtonProps) {

	return (
		<>
			<Button sx={{backgroundColor: primaryColor}} color="error" variant="outlined" startIcon={<VideogameAsset />}>challenge</Button>
		</>
	)
}
