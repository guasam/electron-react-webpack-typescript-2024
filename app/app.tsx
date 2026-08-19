import { WindowFrame } from './shell'
import { Playground } from './demo'
import './styles/app.css'

/**
 * App root: the core shell with the playground mounted inside. To strip the playground, remove the
 * <Playground /> line below and delete app/demo + conveyor/demo (see README).
 */
export default function App() {
  return (
    <WindowFrame title="Electron React App">
      <Playground />
    </WindowFrame>
  )
}
