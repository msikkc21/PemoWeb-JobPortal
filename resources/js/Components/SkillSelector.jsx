import React, { useMemo, useState } from 'react';

export default function SkillSelector({ skills = [], value = [], onChange = () => {} }) {
	// support skills as array or paginated response { data: [...] }
	const skillList = Array.isArray(skills) ? skills : (skills?.data ?? []);

	// normalize incoming value to array of ids
	const normalizedValue = (Array.isArray(value) ? value : []).map(v => (typeof v === 'object' && v !== null) ? Number(v.id) : Number(v));

	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return skillList;
		return skillList.filter(s => (s.name || '').toLowerCase().includes(q));
	}, [skillList, query]);

	const toggle = (id) => {
		// compute from latest normalizedValue to avoid stale closure
		const next = new Set(normalizedValue);
		if (next.has(id)) next.delete(id); else next.add(id);
		onChange(Array.from(next));
	};

	return (
		<div>
			<input
				type="search"
				placeholder="Search skills..."
				value={query}
				onChange={e => setQuery(e.target.value)}
				style={{ width: '100%', padding: 6, boxSizing: 'border-box' }}
			/>

			<div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #e5e7eb', padding: 8, marginTop: 8 }}>
				{filtered.length === 0 && <div style={{ color: '#6b7280' }}>No skills found.</div>}
				{filtered.map(skill => {
					const id = Number(skill.id);
					const checked = normalizedValue.includes(id);
					return (
						<label key={id} style={{ display: 'block', marginBottom: 6, cursor: 'pointer' }}>
							<input
								type="checkbox"
								checked={checked}
								onChange={() => toggle(id)}
								style={{ marginRight: 8 }}
							/>
							{skill.name}
						</label>
					);
				})}
			</div>
		</div>
	);
}
