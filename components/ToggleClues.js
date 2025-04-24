'use client';

function ToggleClues({ showYear, setShowYear, showDirector, setShowDirector }) {
    return (
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
            <legend className="fieldset-legend">Clues</legend>
            <div className="space-y-2 flex flex-col gap-2">
                <label className="label cursor-pointer">
                    <input
                        type="checkbox"
                        className="toggle toggle-sm"
                        checked={showYear}
                        onChange={(e) => setShowYear(e.target.checked)}
                    />
                    <span className="label-text">Year</span>
                </label>
                <label className="label cursor-pointer">
                    <input
                        type="checkbox"
                        className="toggle toggle-sm"
                        checked={showDirector}
                        onChange={(e) => setShowDirector(e.target.checked)}
                    />
                    <span className="label-text">Director</span>
                </label>
            </div>
        </fieldset>
    );
}

export default ToggleClues; 