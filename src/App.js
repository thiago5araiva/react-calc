import React, { useEffect, useRef, useState } from 'react'
import './App.css'

//#endregion
//#region Calculator
//#region Button
const Button = ({ className, value, onClick }) => {
  return (
    <button
      className={className}
      onClick={() => {
        onClick(value)
      }}
    >
      {value}
    </button>
  )
}
//#endregion

const Calculator = () => {
  const calcRegex = /^([0-9] | - |\+|\*|\.)*$/
  const [error, setError] = useState('')
  const [display, setDisplay] = useState('')
  const [showAd, toggleAd] = useState(false)
  const [history, setHistory] = useState([])
  const [showHist, toggleHist] = useState(false)
  const histRef = useRef()
  const keyboard = [
    7,
    8,
    9,
    '/',
    'C',
    4,
    5,
    6,
    '*',
    'Del',
    1,
    2,
    3,
    '-',
    'Ad',
    0,
    '.',
    '+',
    '=',
  ]
  const AdvancedKeys = ['(', ')', 'Hist', 'Up', 'AC']
  useEffect(() => {
    if (error) {
      setError()
    }
  }, [display])

  useEffect(() => {
    if (history.length > 2 && showHist) {
      histRef.current.scrollTop = histRef.current.scrollHeight
    }
  }, [history.length, showHist])

  const doTheMath = () => {
    try {
      const result = eval(display)
      setHistory([].concat(history, { calculation: display, result }))
      setDisplay('' + result)
    } catch (err) {
      setError(`Invalid Expression: ${err.message}`)
    }
  }

  const handleClick = (value) => {
    switch (value) {
      case '=':
        doTheMath()
        break
      case 'C':
        setDisplay('')
        break
      case 'Del':
        setDisplay(display.substring(0, display.length - 1))
        break
      case 'Ad':
        toggleAd(!showAd)
        toggleHist(false)
        break
      case 'Hist':
        toggleHist(!showHist)
        break
      case 'AC':
        setDisplay('')
        setHistory([])
        break
      case 'Up':
        const lastIndex = history.length - 1
        if (lastIndex > -1) {
          const newDisplay = history[lastIndex].calculation
          const newHistory = history.slice(0, lastIndex)
          setDisplay(newDisplay)
          setHistory(newHistory)
        }
        break
      default:
        setDisplay(`${display}${value}`)
    }
  }

  const buildButtonKey = (value, idx) => {
    const span2Class = value === 0 ? 'span2' : ''
    const primaryClass = isNaN(value) ? 'primary' : ''
    return (
      <Button
        className={`teste ${span2Class}${primaryClass}`}
        key={value}
        value={value}
        onClick={handleClick}
      />
    )
  }

  return (
    <div className="calculator">
      {showHist && (
        <div ref={histRef} className="history">
          {history.map(({ calculation, result }, idx) => (
            <p key={idx}>{`${calculation}= ${result}`}</p>
          ))}
        </div>
      )}
      <input
        type="text"
        className="display"
        value={display}
        onChange={(e) => {
          const { value } = e.target.value
          calcRegex.test(value) && setDisplay(e.target.value)
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            doTheMath()
          } else if (e.key.toLowerCase() === 'c') {
            setDisplay('')
          }
        }}
      />
      {error && <p className="error">{error}</p>}
      {showAd && (
        <div className="keyboard">{AdvancedKeys.map(buildButtonKey)}</div>
      )}
      <div className="keyboard">{keyboard.map(buildButtonKey)}</div>
    </div>
  )
}

const App = () => {
  return (
    <div className="App">
      <Calculator />
    </div>
  )
}

export default App
