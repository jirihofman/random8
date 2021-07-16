import { useState, useEffect } from 'react'
import { success } from 'toastr';
import * as uuid from 'uuid';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import firstNames from '../first-names.json';
import lastNames from '../names.json';

export default function Home() {

  const getNames = length => {
    return Array.from({ length }, getRandomName)
  }
  const getEmails = length => {
    return Array.from({ length }, getRandomEmail)
  }
  const genPersona = (personaName) => {
    return { name: personaName, password: getHumanPwd(12), uuid: uuid.v4(), email: getRandomEmail({ disposable: true, name: personaName }) }
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

  const [names, setNames] = useState(getNames(3))
  const [emails, setEmails] = useState(getEmails(3))
  const [keys, setKeys] = useState(getKeys())
  const [passwords, setPasswords] = useState(getPasswords())
  const [numbers, setNumbers] = useState(getNumbers())
  const personaName = getRandomName()
  const [persona, setPersona] = useState(genPersona(personaName))
  const [personaEmails, setPersonaEmails] = useState([])

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
  }

  const handleInputClick = async event => {
    event.target.select()
    document.execCommand('copy');
    success(event.target.value, 'Copied!')
  }

  const handleEmailRefreshClick = async event => {
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
  }

  const handleEmailCopyAllClick = async () => {
    const hidden = document.getElementById('emailsAll');
    hidden.value = emails.join();
    hidden.select();
    document.execCommand('copy');
    success(hidden.value, 'Copied!')
    hidden.value = ''
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Random8</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <button onClick={handleGenerateClick} id={styles.random8} title="Click to generate new data for each seaction.">
          <h2>Random8</h2>
          <i>click to generate random data</i>
        </button>

        <div className={styles.grid}>

          <div className={styles.card}>
            <h3>Names</h3>
            {
              names.map(name => <input type="text" className="name" size="35" readOnly value={name} onClick={handleInputClick} key={name} />)
            }
          </div>

          <div className={styles.card}>
            <h3>Emails <button onClick={handleEmailCopyAllClick} title="comma separated">Copy all emails</button></h3>
            <input type="text" id="emailsAll" value="" style={{ display: 'block', position: 'absolute', zIndex: '-1' }} readOnly />
            {
              emails.map(email => <input type="text" className="email" size="35" readOnly value={email} onClick={handleInputClick} key={email} />)
            }
          </div>

          <div className={styles.card}>
            <h3>Persona</h3>
            <div>
              <label>Name</label>
              <input type="text" className="persona" size="18" readOnly value={persona.name} onClick={handleInputClick} />
              <button onClick={handleEmailRefreshClick}>check email</button>
            </div>
            <div>
              <label>UUID</label>
              <input type="text" className="persona" size="30" readOnly value={persona.uuid} onClick={handleInputClick} />
            </div>
            <div>
              <label>Email</label>
              <input type="text" className="persona" size="30" readOnly value={persona.email} onClick={handleInputClick} />
            </div>
            <div>
              <label>Pwd</label>
              <input type="text" className="persona" size="20" readOnly value={persona.password} onClick={handleInputClick} />
            </div>
            <hr />
            {
              personaEmails.length ? personaEmails.map(msg => <div style={{ 'font-size': '10px' }} key={msg.id}>
                <a href={`https://www.1secmail.com/mailbox/?action=readMessage&id=${msg.id}&login=${getMailNickname(persona.name)}&domain=1secmail.org`} target="_blank" rel="noopener noreferrer">{msg.date}</a>
                | {msg.firstHref ? <a target="_blank" rel="noopener noreferrer" href={msg.firstHref}>first href</a> : null}
                | <b>{msg.shortText}</b>
                {[msg.subject.substr(100), msg.from].join(' | ')}</div>) : <div>No messages</div>
            }
          </div>

          <div className={styles.card}>
            <h3>Passwords</h3>
            {
              passwords.map(password => <input type="text" className="password" size="35" readOnly value={password} onClick={handleInputClick} key={password} />)
            }
          </div>

          <div className={styles.card}>
            <h3>Keys</h3>
            {
              keys.map(key => <input type="text" className="password" size="35" readOnly value={key} onClick={handleInputClick} key={key} />)
            }
          </div>

          <div className={styles.card}>
            <h3>Numbers</h3>
            {
              numbers.map((key, index) => {
                const size = [0, 3, 6].includes(index) ? 5 : [1, 4, 7].includes(index) ? 10 : 14
                return <span key={key}>
                  <input type="text" className="number" size={size-1} readOnly value={key} onClick={handleInputClick} style={{paddingLeft: '0.5em'}} />
                  {[2, 5, 8].includes(index) && <br />}
                </span>
              })
            }
          </div>

          <div>
            <h3>Notes & tips</h3>
            <ul>
              <li>Simply <b>click the input</b> and its value is copied into clipboard automatically.</li>
              <li>            
                <div>Number of first names: {firstNames.length}</div>
                <div>Number of last names: {lastNames.length}</div>
              </li>
            </ul>
            <h3>Credits</h3>
            <ul>
              <li>Email service by <a href="https://www.1secmail.com/" rel="noopener noreferrer">https://www.1secmail.com/</a></li>
              <li>Keygen source <a href="https://randomkeygen.com/" rel="noopener noreferrer">https://randomkeygen.com/</a></li>
              <li>Random names from <a href="https://github.com/dominictarr/random-name" rel="noopener noreferrer">https://github.com/dominictarr/random-name</a></li>
            </ul>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <iframe src="https://ghbtns.com/github-btn.html?user=jirihofman&repo=random8&type=star&count=true&size=large&v=2" frameBorder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
        <iframe src="https://github.com/sponsors/jirihofman/button" title="Sponsor jirihofman" height="35" width="116" style={{border: 0}}></iframe>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  return { props: {} }
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
    key += chars[Math.floor(Math.random() * chars.length)];
  }

  return key;
}

function getRandomEmail(options) {
  const emailDomains = ['gmail.com', 'googlemail.com', 'hotmail.com']
  let domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  let nick = getRandomKey(12, true, false, true, false, false);

  if (options){
    const { disposable, name } = options
    if (disposable) {
      domain = '1secmail.org'
    }

    if (name) {
      // try to generate email address similar to the name provided
      nick = getMailNickname(name)
    }
  }

  return  nick + '@' + domain
}

function getRandomName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const middleName = Math.random() > 0.7 ? firstNames[Math.floor(Math.random() * firstNames.length)] : undefined;

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
