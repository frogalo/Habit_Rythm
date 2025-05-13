'use client';

import React, { useState } from 'react';

const HabitForm: React.FC = () => {
    const [habit, setHabit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add habit logic
        setHabit('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={habit}
                onChange={(e) => setHabit(e.target.value)}
                placeholder="New habit"
            />
            <button type="submit">Add Habit</button>
        </form>
    );
};

export default HabitForm;