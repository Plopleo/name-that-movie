'use client'

import { useState } from 'react'
import GameContainer from '../components/GameContainer'
import GameStats from '../components/GameStats'
import RangeReviews from '../components/RangeReviews'
import DecadeSelector from '../components/DecadeSelector'
import Footer from '../components/Footer'
import GuessHistory from '../components/GuessHistory'

export default function Home() {
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [numReviews, setNumReviews] = useState(3)
  const [selectedDecades, setSelectedDecades] = useState([])
  const [guessHistory, setGuessHistory] = useState([])

  return (
    <main className="min-h-screen bg-base-200 flex flex-col">
      <div className="relative flex-grow">
        {/* Main centered content */}
        <div className="flex flex-col items-center px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Name That Movie!</h1>
            <p className="text-lg text-base-content/80">Guess the movie based on Letterboxd reviews</p>
          </div>

          {/* Mobile panel */}
          <div className="mb-8 px-4 lg:hidden">
            <div className="space-y-6">
              <GameStats score={score} attempts={attempts} />
              <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">Settings</div>
                <div className="collapse-content text-sm flex flex-col gap-4">
                  <RangeReviews numReviews={numReviews} setNumReviews={setNumReviews} />
                  <DecadeSelector onDecadesChange={setSelectedDecades} />
                </div>
              </div>

              <GuessHistory guesses={guessHistory} />
            </div>
          </div>

          <div className="w-full max-w-2xl">
            <GameContainer
              score={score}
              setScore={setScore}
              attempts={attempts}
              setAttempts={setAttempts}
              numReviews={numReviews}
              setNumReviews={setNumReviews}
              selectedDecades={selectedDecades}
              setSelectedDecades={setSelectedDecades}
              setGuessHistory={setGuessHistory}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="fixed top-8 right-4 lg:right-8 w-80 hidden lg:block">
          <div className="space-y-6">
            <GameStats score={score} attempts={attempts} />

            <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
              <input type="checkbox" />
              <div className="collapse-title font-semibold">Settings</div>
              <div className="collapse-content text-sm flex flex-col gap-4">
                <RangeReviews numReviews={numReviews} setNumReviews={setNumReviews} />
                <DecadeSelector onDecadesChange={setSelectedDecades} />
              </div>
            </div>

            <GuessHistory guesses={guessHistory} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
