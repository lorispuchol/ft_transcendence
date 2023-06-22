
export default function ErrorHandling(params: any)
{
	return (
		<>
			<strong>{params.status + ": " + params.message}</strong>
		</>
	);
}
