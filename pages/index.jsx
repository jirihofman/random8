import { useState, useEffect } from 'react'
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
    return { name: personaName, password: getRandomKey(12), uuid: uuid.v4(), email: getRandomEmail({ disposable: true, name: personaName }) }
  }

  const [names, setNames] = useState(getNames(3))
  const [emails, setEmails] = useState(getEmails(3))
  const [keys, setKeys] = useState([getRandomKey(16, false, true, false, false), getRandomKey(12), uuid.v4()])
  const [passwords, setPasswords] = useState([getRandomKey(8), getRandomKey(12), getRandomKey(16)])
  const personaName = getRandomName()
  const [persona, setPersona] = useState(genPersona(personaName))
  const [personaEmails, setPersonaEmails] = useState([])

  const handleGenerateClick = async event => {
    event.preventDefault()

    setNames(getNames(3))
    setEmails(getEmails(3))
    setKeys([getRandomKey(16, false, true, false, false), getRandomKey(16), uuid.v4()])
    setPasswords([getRandomKey(8), getRandomKey(12), getRandomKey(16)])

    const personaName = getRandomName()
    const newPersona = genPersona(personaName)
    setPersona(newPersona)
    setPersonaEmails([])
  }

  const handleInputClick = async event => {
    event.target.select()
    document.execCommand('copy');
  }

  const handleEmailRefreshClick = async event => {
    const newNick = getMailNickname(persona.name)
    const res = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${newNick}&domain=1secmail.org`)
    const json = await res.json()

    if (json.length) {
      setPersonaEmails(json)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Random8</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <button onClick={handleGenerateClick} >
          <h1>Random8 &rarr; click</h1>
        </button>

        <div className={styles.grid}>

          <div className={styles.card}>
            <h3>Names</h3>
            {
              names.map(name => <input type="text" className="name" size="20" readOnly value={name} onClick={handleInputClick} key={name} />)
            }
            <hr />
            <div>Total first names: {firstNames.length}</div>
            <div>Total last names: {lastNames.length}</div>
          </div>

          <div className={styles.card}>
            <h3>Persona</h3>
            <button onClick={handleEmailRefreshClick}>check email</button>
            <input type="text" className="persona" size="20" readOnly value={persona.name} onClick={handleInputClick} />
            <input type="text" className="persona" size="40" readOnly value={persona.uuid} onClick={handleInputClick} />
            <input type="text" className="persona" size="40" readOnly value={persona.email} onClick={handleInputClick} />
            <input type="text" className="persona" size="20" readOnly value={persona.password} onClick={handleInputClick} />
            <hr />
            {
              personaEmails.length ? personaEmails.map(msg => <div>{[msg.date, msg.subject, msg.from].join(' | ')}</div>) : <div>No messages</div>
            }
          </div>

          <div className={styles.card}>
            <h3>Emails</h3>
            {
              emails.map(email => <input type="text" className="email" size="40" readOnly value={email} onClick={handleInputClick} key={email} />)
            }
          </div>

          <div className={styles.card}>
            <h3>Passwords</h3>
            {
              passwords.map(password => <input type="text" className="password" size="20" readOnly value={password} onClick={handleInputClick} key={password} />)
            }
          </div>

          <div className={styles.card}>
            <h3>Keys</h3>
            {
              keys.map(key => <input type="text" className="password" size="40" readOnly value={key} onClick={handleInputClick} key={key} />)
            }
          </div>

          <div>
            <h3>Notes & tips</h3>
            <ul>
              <li>Just click the input and its value is copied into clipboard automatically.</li>
              <li>Keygen source <a href="https://randomkeygen.com/">https://randomkeygen.com/</a></li>
              <li>Random names from <a href="https://github.com/dominictarr/random-name">https://github.com/dominictarr/random-name</a></li>
            </ul>
          </div>
        </div>
      </main>

      <footer className={styles.footer}></footer>
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
  if (useSpecial) chars += special;
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

  return firstName + ' ' + lastName
}

function getMailNickname(name) {
  return name.replace(' ', '.').toLowerCase();
}
