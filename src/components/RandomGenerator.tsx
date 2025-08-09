'use client';
import { useState, useEffect } from 'react'
import NotifixPkg from 'notiflix/build/notiflix-notify-aio';
const { Notify } = NotifixPkg;
import * as uuid from 'uuid';
import random from 'lodash/random';
import nodePetNames from 'node-petname';
import firstNames from '../../first-names.json';
import lastNames from '../../names.json';
import Notes from './Notes';

export default function RandomGenerator() {

	const getNames = length => {
		return Array.from({ length }, getRandomName)
	}
	const getEmails = length => {
		return Array.from({ length }, getRandomEmail)
	}
	const genPersona = (personaName) => {
		return { name: personaName, password: getHumanPwd(12), uuid: uuid.v4(), email: getRandomEmail({ disposable: true, name: personaName }), refreshingEmail: false, phoneNumber: getRandomPhoneNumber([ 'cz', 'us', 'uk' ][random(0, 2)])}
	}
	const getPasswords = () => {
		return [
			getHumanPwd(8),
			getRandomKey(12),
			getRandomKey(16, true, true, true, '._;', false),
			getRandomKey(32)
		]
	}
	const getKeys = () => {
		return [getRandomKey(16, false, true, false, false), getRandomKey(16), uuid.v4()]
	}
	const getNumbers = () => {
		return [
			getRandomKey(4, false, false, true, false, false),
			getRandomKey(8, false, false, true, false, false),
			getRandomKey(12, false, false, true, false, false),
			getRandomKey(4, false, false, true, false, false),
			getRandomKey(8, false, false, true, false, false),
			getRandomKey(12, false, false, true, false, false),
			getRandomKey(4, false, false, true, false, false),
			getRandomKey(8, false, false, true, false, false),
			getRandomKey(12, false, false, true, false, false),
		]
	}

	const getDates = () => {
		return [
			getRandomDate().toISOString(),
			getRandomDate().toISOString(),
			getRandomDate().toLocaleDateString(),
			getRandomDate().toLocaleDateString(),
			getRandomDate().getTime(),
			getRandomDate().getTime(),
			getRandomDate(),
			getRandomDate(),
		]
	}

	const getPhoneNumbers = () => {
		return [
			getRandomPhoneNumber('cz'),
			getRandomPhoneNumber('us'),
			getRandomPhoneNumber('uk'),
			getRandomPhoneNumber('in'),
		]
	}
	const getPetNames = () => [
		nodePetNames(2, '-') + '-' + Math.floor(random(1000, 9999)),
		nodePetNames(3, '-'),
		nodePetNames(5, '_'),
	]
	
	const countries = ['🇨🇿', '🇺🇸', '🇬🇧', '🇮🇳'];

	const emptyArray = ['', '', ''];
	const [names, setNames] = useState(emptyArray)
	const [emails, setEmails] = useState(emptyArray)
	const [keys, setKeys] = useState(emptyArray)
	const [passwords, setPasswords] = useState([...emptyArray, ''])
	const [numbers, setNumbers] = useState([...emptyArray, ...emptyArray, ...emptyArray]);
	const [persona, setPersona] = useState([])
	const [personaEmails, setPersonaEmails] = useState([])
	const [dates, setDates] = useState([...emptyArray, ...emptyArray, '', ''])
	const [phoneNumbers, setPhoneNumbers] = useState(emptyArray)
	const [petNames, setPetNames] = useState(emptyArray)

	useEffect(() => {
		const personaName = getRandomName()

		setNames(getNames(3))
		setEmails(getEmails(3))
		setKeys(getKeys())
		setPasswords(getPasswords())
		setNumbers(getNumbers())
		setPersona(genPersona(personaName))
		setPersonaEmails([])
		setDates(getDates())
		setPhoneNumbers(getPhoneNumbers())
		setPetNames(getPetNames())
	}, []);

	const handleGenerateClick = async event => {
		event.preventDefault()

		setNames(getNames(3))
		setEmails(getEmails(3))
		setKeys(getKeys())
		setPasswords(getPasswords())
		setNumbers(getNumbers())

		const personaName = getRandomName()
		const newPersona = genPersona(personaName)
		setPersona(newPersona)
		setPersonaEmails([])
		setDates(getDates())
		setPhoneNumbers(getPhoneNumbers())
		setPetNames(getPetNames())
	}

	const handleInputClick = async event => {
		event.target.select()
		document.execCommand('copy');
		Notify.success(['<b>Copied!</b>', event.target.value].join(' '), { plainText: false });
	}

	const handleEmailRefreshClick = async event => {
		setPersona({ ...persona, refreshingEmail: true })
		const newNick = getMailNickname(persona.name)
		const res = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${newNick}&domain=1secmail.org`)
		const emails = await res.json()

		let i = 0;
		for (const email of emails) {
			const res = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${newNick}&domain=1secmail.org&id=${email.id}`)
			const emailDetails = await res.json();
			// Should be enough for messages like "Your confirmation code is 355245"
			emails[i].shortText = emailDetails.body.substring(0, 50);

			// Try to get the first link href
			const href = emailDetails.body.match(/.*href="([^"]+)".*/)
			if (href && href[1]) emails[i].firstHref = href[1];
			i++;
		}
		if (emails.length) {
			setPersonaEmails(emails)
		}
		setPersona({ ...persona, refreshingEmail: false })
	}

	const handleEmailCopyAllClick = async () => {
		const hidden = document.getElementById('emailsAll');
		hidden.value = emails.join(' ');
		hidden.select();
		document.execCommand('copy');
		Notify.success(['<b>Copied!</b>', hidden.value].join(' '), { plainText: false });
		hidden.value = ''
	}

	return (
		<div className="container">
			<main className="main">

				<button onClick={handleGenerateClick} id="random8" title="Click to generate new data for each seaction.">
					<h2>Random8</h2>
					<i>click to generate random data</i>
				</button>

				<div className="grid">

					<div className="card">
						<h3>Names</h3>
						{
							names.map((name, i) => <input type="text" className="name" style={{ width: '100%' }} readOnly value={name} onClick={handleInputClick} key={i} />)
						}
					</div>

					<div className="card">
						<h3>Emails <button onClick={handleEmailCopyAllClick}>Copy all emails</button> {tooltip('Copied emails are comma separated')}</h3>
						<input type="text" id="emailsAll" value="" style={{ display: 'block', position: 'absolute', zIndex: '-1' }} readOnly />
						{
							emails.map((email, i) => <input type="text" className="email" style={{ width: '100%' }} readOnly value={email} onClick={handleInputClick} key={i} />)
						}
					</div>

					<div className="card">
						<h3>Numbers {tooltip('Number sizes: 4, 8, 12')}</h3>
						{
							numbers.map((key, i) => {
								const width = [0, 3, 6].includes(i) ? 20 : [1, 4, 7].includes(i) ? 30 : 45
								return <span key={i}>
									<input type="text" className="number" readOnly value={key} onClick={handleInputClick} style={{ paddingLeft: '0.5em', width: `${width}%` }} />
									{[2, 5, 8].includes(i) && <br />}
								</span>
							})
						}
					</div>

					<div className="card">
						<h3>Passwords</h3>
						{
							passwords.map((password, i) => <input type="text" className="password" style={{ width: '100%' }} readOnly value={password} onClick={handleInputClick} key={i} />)
						}
					</div>

					<div className="card">
						<h3>Phone numbers</h3>
						{
							phoneNumbers.map((key, i) => {
								return <span key={i}>
									{countries[i]}
									<input type="text" className="phone-number" readOnly value={key} onClick={handleInputClick} style={{ marginLeft: '0.5em', paddingLeft: '0.5em', width: '90%' }} />
									<br />
								</span>
							})
						}
					</div>

					<div className="card">
						<h3>Date & Time</h3>
						{
							dates.map((key, i) => {
								return <span key={i}>
									<input type="text" className="date" readOnly value={key} onClick={handleInputClick} style={{ paddingLeft: '0.5em', width: '50%' }} />
									{/* {[2, 5, 8].includes(index) && <br />} */}
								</span>
							})
						}
					</div>

					<div className="card">
						<h3>Persona</h3>
						<div>
							<label>Name</label>
							<input type="text" className="persona" size="18" readOnly value={persona.name} onClick={handleInputClick} />
							<button onClick={handleEmailRefreshClick}>check email</button>
						</div>
						<div>
							<label>UUID</label>
							<input type="text" className="persona" style={{ width: '80%' }} readOnly value={persona.uuid} onClick={handleInputClick} />
						</div>
						<div>
							<label>Email</label>
							<input type="text" className="persona" style={{ width: '80%' }} readOnly value={persona.email} onClick={handleInputClick} />
						</div>
						<div>
							<label>Phone</label>
							<input type="text" className="phone-number" style={{ width: '80%' }} readOnly value={persona.phoneNumber} onClick={handleInputClick} />
						</div>
						<div>
							<label>Pwd</label>
							<input type="text" className="persona" style={{ width: '80%' }} readOnly value={persona.password} onClick={handleInputClick} />
						</div>
						<hr />
						<div id='persona-messages'>
							{
								persona.refreshingEmail ? <i>Loading emails ...</i> :
									personaEmails.length ? personaEmails.map(msg => <div style={{ 'fontSize': '10px' }} key={msg.id}>
										<a href={`https://www.1secmail.com/mailbox/?action=readMessage&id=${msg.id}&login=${getMailNickname(persona.name)}&domain=1secmail.org`} target="_blank" rel="noopener noreferrer" title='View email'>{msg.date}</a>
										| {msg.firstHref ? <a target="_blank" rel="noopener noreferrer" href={msg.firstHref} title={'Link to: ' + msg.firstHref}>first link</a> : null}
										| <b>{msg.shortText}</b>
										{[msg.subject.substr(100), msg.from].join(' | ')}</div>) : <div>No messages</div>
							}
							<span id='persona-tooltip'>{tooltip('The first link opens 1secmail.org mailbox. The second one directly opens the first link that is found in the email message. Useful for confirming email addresses for example.')}</span>
						</div>
					</div>

					<div className="card">
						<h3>Pet names</h3>
						{petNames.map((name, i) => <input type="text" className="name" style={{ width: '100%' }} readOnly value={name} onClick={handleInputClick} key={i} />)}
					</div>

					<div className="card">
						<h3>Keys</h3>
						{
							keys.map((key, i) => <input type="text" className="password" style={{ width: '100%' }} readOnly value={key} onClick={handleInputClick} key={i} />)
						}
					</div>


					<Notes/>
				</div>
			</main>

			<footer className="footer">
				<iframe src="https://ghbtns.com/github-btn.html?user=jirihofman&repo=random8&type=star&count=true&size=large&v=2" frameBorder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
			</footer>
		</div>
	)
}

function getRandomKey(
	length = 12,
	useLowerCase = true,
	useUpperCase = true,
	useNumbers = true,
	useSpecial = true,
	useHex = false
) {

	const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
	const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numbers = '1234567890';
	const special = '`~!@#$%^&*()-=_+[]{}|;\':",./<>?';
	const hex = '123456789ABCDEF';

	let chars = '';
	let key = '';

	if (useLowerCase) chars += lowerCase;
	if (useUpperCase) chars += upperCase;
	if (useNumbers) chars += numbers;
	if (useSpecial) {
		if (typeof useSpecial === 'boolean') chars += special;
		if (typeof useSpecial === 'string') chars += useSpecial;
	}
	if (useHex) chars += hex;

	for (let i = 0; i < length; i++) {
		key += chars[Math.floor(getSecureRandomNumber() * chars.length)];
	}

	return key;
}

function getRandomEmail(options) {
	const emailDomains = ['gmail.com', 'googlemail.com', 'hotmail.com']
	let domain = emailDomains[Math.floor(getSecureRandomNumber() * emailDomains.length)];
	let nick = getRandomKey(12, true, false, true, false, false);

	if (options) {
		const { disposable, name } = options
		if (disposable) {
			domain = '1secmail.org'
		}

		if (name) {
			// try to generate email address similar to the name provided
			nick = getMailNickname(name)
		}
	}

	return nick + '@' + domain
}

function getRandomName() {
	const firstName = firstNames[Math.floor(getSecureRandomNumber() * firstNames.length)];
	const lastName = lastNames[Math.floor(getSecureRandomNumber() * lastNames.length)];
	const middleName = getSecureRandomNumber() > 0.7 ? firstNames[Math.floor(getSecureRandomNumber() * firstNames.length)] : undefined;

	return [firstName, middleName, lastName].filter(Boolean).join(' ');
}

function getMailNickname(name = '') {
	return name.replace(/ /g, '.').toLowerCase();
}

function getHumanPwd(length) {
	if (length < 8) throw 'Max pwd length must be 8';
	let pwd = getRandomKey(2, true, false, false, false, false)
		+ getRandomKey(2, false, true, false, false, false)
		+ getRandomKey(2, false, false, false, '._', false)
		+ getRandomKey(2, false, false, true, false, false)
	if (length > 8) {
		pwd += getRandomKey(length - 8, true, true, true, false, false)
	}

	return pwd;
}

function getRandomDate() {
	const date = new Date();
	date.setDate(date.getDate() + Math.floor(random(-365, 365)));
	return date;
}


function tooltip(text) {
	return <div className="tooltip">❓<div className="tooltiptext">{text}</div></div>;
}

// Similar to Math.random() but more secure. Returns number between 0 and 1.
function getSecureRandomNumber() {
	return random(0, 1, true);
}

function getRandomPhoneNumber(countryCode) {
	if (countryCode === 'cz') {
		return '+420 ' + Math.floor(random(100000000, 999999999));
	}
	if (countryCode === 'us') {
		return '+1 ' + Math.floor(random(100, 999)) + '-' + Math.floor(random(100, 999)) + '-' + Math.floor(random(1000, 9999));
	}
	if (countryCode === 'uk') {
		return '+44' + Math.floor(random(1000000000, 9999999999));
	}
	if (countryCode === 'in') {
		return '+91 ' + Math.floor(random(10000, 99999)) + ' ' + Math.floor(random(10000, 99999));
	}
	
}