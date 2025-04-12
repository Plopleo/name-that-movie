'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

export default function DecadeSelector({ onDecadesChange }) {
    const [selectedDecades, setSelectedDecades] = useState([])
    const [isInitialized, setIsInitialized] = useState(false)
    const decades = useMemo(() => [
        { start: 1960, end: 1969 },
        { start: 1970, end: 1979 },
        { start: 1980, end: 1989 },
        { start: 1990, end: 1999 },
        { start: 2000, end: 2009 },
        { start: 2010, end: 2019 },
        { start: 2020, end: 2029 }
    ], [])

    // Memoize the initialization to prevent multiple calls
    const initializeDecades = useCallback(() => {
        if (!isInitialized) {
            const initialDecades = decades.map(d => d.start)
            setSelectedDecades(initialDecades)
            onDecadesChange(initialDecades)
            setIsInitialized(true)
        }
    }, [isInitialized, onDecadesChange, decades])

    useEffect(() => {
        initializeDecades()
    }, [initializeDecades])

    // Memoize the decade change handler
    const handleDecadeChange = useCallback((startYear) => {
        setSelectedDecades(prev => {
            const newSelected = prev.includes(startYear)
                ? prev.filter(year => year !== startYear)
                : [...prev, startYear]

            // Only call onDecadesChange if we're not in initialization phase
            if (isInitialized) {
                onDecadesChange(newSelected)
            }
            return newSelected
        })
    }, [isInitialized, onDecadesChange])

    return (
        <div className="card bg-base-200 p-4">
            <h3 className="text-lg font-semibold mb-3">Filter by Decade</h3>
            <div className="space-y-2">
                {decades.map(decade => (
                    <label key={decade.start} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={selectedDecades.includes(decade.start)}
                            onChange={() => handleDecadeChange(decade.start)}
                        />
                        <span>{decade.start}s</span>
                    </label>
                ))}
            </div>
        </div>
    )
} 