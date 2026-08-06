import { useState } from 'react'
import { Card } from '../components/Card'
import { TextInput } from '../components/TextInput'
import { Button } from '../components/Button'

export const Home = () => {
  const [name, setName] = useState('')

  return (
    <div className="flex flex-col items-center justify-center pt-32">
      <Card className="bg-[linear-gradient(135deg,#1e3a8a_0%,#0f172a_45%,#020617_100%)] w-8/12 flex justify-between items-center gap-4">
        <div className="w-2/12 flex flex-col gap-4">
          <Button onClick={() => {}}>FAQ</Button>
          <Button onClick={() => {}}>Admin</Button>
        </div>
        <div className="w-10/12 flex flex-col items-center">
          {name ? (
            <p>Hello, {name}!</p>
          ) : (
            <>
              <p>Please enter your name.</p>
              <TextInput
                value={name}
                onChange={setName}
                placeholder="Enter your name"
              />
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
