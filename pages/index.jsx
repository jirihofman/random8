import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import firstNames from '../first-names.json';
import lastNames from '../names.json';

export default function Home({reloading}) {

  const [name, setName] = useState(getRandomName())
  const [email, setEmail] = useState(getRandomEmail())
  const [keys, setKeys] = useState([getRandomKey(16, false, true, false, false), getRandomKey(12), getRandomKey(16)])
  const [passwords, setPasswords] = useState([getRandomKey(8), getRandomKey(12), getRandomKey(16)])

  const handleGenerateClick = async event => {
    event.preventDefault()
    setName(getRandomName())
    setEmail(getRandomEmail())
    setKeys([getRandomKey(16,false,true,false,false), getRandomKey(12), getRandomKey(16)])
    setPasswords([getRandomKey(8), getRandomKey(12), getRandomKey(16)])
  }
  const handleInputClick = async event => {
      event.target.select()
      document.execCommand('copy');
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
            <div>Total first names: {firstNames.length}</div>
            <div>Total last names: {lastNames.length}</div>
            <input type="text" className="name" size="20" readOnly value={name} onClick={handleInputClick} />
          </div>

          <a className={styles.card}>
            <h3>Emails</h3>
            <input type="text" className="email" size="40" readOnly value={email} onClick={handleInputClick} />
          </a>

          <a className={styles.card}>
            <h3>Passwords</h3>
            {
              passwords.map(password => <input type="text" className="password" size="20" readOnly value={password} onClick={handleInputClick} key={password}/>)
            }
          </a>

          <a className={styles.card}>
            <h3>Keys</h3>
            {
              keys.map(key => <input type="text" className="password" size="20" readOnly value={key} onClick={handleInputClick} key={key}/>)
            }
          </a>

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

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {

  const displayName = getRandomKey(3);
  const email = getRandomEmail();
  const keys = [getRandomKey(16, false, true, false, false), getRandomKey(12), getRandomKey(16)]
  const passwords = [getRandomKey(8), getRandomKey(12), getRandomKey(16)]

  return {
    props: {
      email, keys, passwords
    },
  }
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
function getRandomEmail() {
  const emailDomains = ['gmail.com', 'googlemail.com', 'hotmail.com']
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  return getRandomKey(12, true, false, true, false, false) + '@' + domain
}

function getRandomName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return firstName + ' ' + lastName
}
