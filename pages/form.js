function Form({name}) {
	let a = "N/A";
	const registerUser = async event => {
		event.preventDefault()

		const res = await fetch('/api/hello', {
			body: JSON.stringify({
				name: event.target.name.value
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		})

		const result = await res.json()
		console.log("result:", result);
		name = result.name
		// result.user => 'Ada Lovelace'
	}

	return (
		<form onSubmit={registerUser}>
			<label htmlFor="name">Name</label>
			<input id="name" name="name" type="text" autoComplete="name" required />
			<button type="submit">Register</button>
			<br />
			<i>Name:{name}</i>
		</form>
	)
}

export async function getServerSideProps() {
	console.log("---getServerSideProps");
	const res = await fetch('/api/hello')
	const json = await res.json()

	return {
		props: {
			name: 'todo form page',
		},
	}
}

export default Form
