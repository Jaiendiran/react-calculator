/* eslint-disable default-case */
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './AppStyle.css';

export const ACTIONS = {
  ADD: 'add',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  DELETE: 'delete',
  EVALUATE: 'evaluate',
}

function reducer (state, { type, payload }) {
    switch (type) {
      case ACTIONS.ADD:
        if(state.overwrite) {
          return {
            ...state,
            currentOperand: payload.digit,
            overwrite: false,
          }
        }
        if(payload.digit === '0' && state.currentOperand === '0') {
          return state
        }
        if(payload.digit === '.' && state.currentOperand.includes('.')) {
          return state
        }
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        }
      case ACTIONS.CHOOSE_OPERATION:
          if(state.currentOperand == null && state.previousOperand == null) {
            return state
          }

          if(state.currentOperand == null) {
            return {
              ...state,
              opeartion: payload.operation,
            }
          }

          if(state.previousOperand == null) {
            return {
              ...state,
              previousOperand: state.currentOperand,
              currentOperand: null,
              operation: payload.operation,
            }
          }

          return {
            ...state,
            previousOperand: evaluate(state),
            operation: payload.operation,
            currentOperand: null,
          }
          
      case ACTIONS.CLEAR:
        return {}

      case ACTIONS.DELETE:
        if(state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }

        if(state.currentOperand == null) return state

        if(state.currentOperand.length === 1) {
          return {...state, currentOperand: null}
        }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        }

      case ACTIONS.EVALUATE:
        if(state.previousOperand == null || state.currentOperand == null || state.operation == null) {
          return state;
        }
        
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
    }
}

function evaluate({previousOperand, currentOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  let computation = '';
  
  if(isNaN(prev) || isNaN(curr)) return ""

  switch (operation) {
    case "+":
      computation = prev + curr
      break
    case "-":
      computation = prev - curr
      break
    case "*":
      computation = prev * curr
      break
    case "/":
      computation = prev / curr
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if(operand == null) return

  const [integer, decimal] = operand.split('.')

  if(decimal == null) return INTEGER_FORMATTER.format(integer)

  return INTEGER_FORMATTER.format(integer) + "." + decimal
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});
  
  return (
    <div className="calulator-grid">
      <div className="output">
        <div className="prevOperand">{formatOperand(previousOperand)} {operation}</div>
        <div className="currentOperand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE})}>DEL</button>
      <OperationButton operation='+' dispatch={dispatch} />      
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App;