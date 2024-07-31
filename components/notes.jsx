import firstNames from '../first-names.json';
import lastNames from '../names.json';

export default function Notes() {
	return <div>
		<h3>Notes & tips</h3>
		<ul>
			<li>Simply <b>click the input</b> and its value is copied into clipboard automatically.</li>
			<li>
				<div>Number of first names: {firstNames.length}</div>
				<div>Number of last names: {lastNames.length}</div>
			</li>
			<li>UUID is <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)">version 4</a> (random).</li>
		</ul>
		<h3>Credits</h3>
		<ul>
			<li>Email service by <a href="https://www.1secmail.com/" rel="noopener noreferrer">https://www.1secmail.com/</a></li>
			<li>Keygen source <a href="https://randomkeygen.com/" rel="noopener noreferrer">https://randomkeygen.com/</a></li>
			<li>Random names from <a href="https://github.com/dominictarr/random-name" rel="noopener noreferrer">https://github.com/dominictarr/random-name</a></li>
		</ul>
	</div>;
}
