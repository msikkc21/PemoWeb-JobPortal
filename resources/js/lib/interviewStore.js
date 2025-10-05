import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'jobportal.interviews';

const STAGE_OPTIONS = [
    'Screening',
    'HR Interview',
    'Technical Interview',
    'Final Interview',
    'Offer Discussion',
];

const STATUS_OPTIONS = [
    'Scheduled',
    'In Review',
    'Completed',
    'Offered',
    'Rejected',
    'Cancelled',
];

const TYPE_OPTIONS = ['Online', 'Onsite', 'Hybrid'];

const futureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const defaultInterviews = [
    {
        id: 'int-1001',
        candidateName: 'Aisyah Rahma',
        candidateEmail: 'aisyah.rahma@example.com',
        position: 'Frontend Engineer',
        stage: 'Screening',
        status: 'Scheduled',
        date: futureDate(3),
        time: '10:00',
        location: 'Zoom Meeting',
        type: 'Online',
        companyName: 'PT Digital Nusantara',
        contactPerson: 'Budi Santoso',
        meetingLink: 'https://zoom.us/j/123456789',
        notes: 'Perkenalkan diri dan siapkan portofolio terbaru.',
        resumeUrl: '#',
    },
    {
        id: 'int-1002',
        candidateName: 'Bagus Pratama',
        candidateEmail: 'bagus.pratama@example.com',
        position: 'UI/UX Designer',
        stage: 'Technical Interview',
        status: 'In Review',
        date: futureDate(5),
        time: '14:30',
        location: 'Kantor Jakarta',
        type: 'Onsite',
        companyName: 'PT Talenta Kreatif',
        contactPerson: 'Siti Aulia',
        meetingLink: '',
        notes: 'Bawa contoh studi kasus desain mobile.',
        resumeUrl: '#',
    },
    {
        id: 'int-1003',
        candidateName: 'Citra Dewi',
        candidateEmail: 'citra.dewi@example.com',
        position: 'Data Analyst',
        stage: 'HR Interview',
        status: 'Completed',
        date: futureDate(-2),
        time: '09:00',
        location: 'Teams Meeting',
        type: 'Online',
        companyName: 'PT Analitika Cerdas',
        contactPerson: 'Rudi Hartono',
        meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting',
        notes: 'Menunggu keputusan akhir dari manajer.',
        resumeUrl: '#',
    },
    {
        id: 'int-1004',
        candidateName: 'Dimas Saputra',
        candidateEmail: 'dimas.saputra@example.com',
        position: 'Backend Engineer',
        stage: 'Final Interview',
        status: 'Scheduled',
        date: futureDate(9),
        time: '13:00',
        location: 'Google Meet',
        type: 'Online',
        companyName: 'PT Solusi Cerdas',
        contactPerson: 'Mega Lestari',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Diskusi sistem yang pernah dibangun.',
        resumeUrl: '#',
    },
];

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const normalizeInterview = (raw) => {
    if (!raw) return null;

    const interview = {
        id: String(raw.id ?? generateId()),
        candidateName: raw.candidateName?.trim() ?? '',
        candidateEmail: raw.candidateEmail?.trim() ?? '',
        position: raw.position?.trim() ?? '',
        stage: raw.stage ?? STAGE_OPTIONS[0],
        status: raw.status ?? STATUS_OPTIONS[0],
        date: raw.date ?? futureDate(3),
        time: raw.time ?? '09:00',
        location: raw.location?.trim() ?? '',
        type: raw.type ?? TYPE_OPTIONS[0],
        companyName: raw.companyName?.trim() ?? '',
        contactPerson: raw.contactPerson?.trim() ?? '',
        meetingLink: raw.meetingLink?.trim() ?? '',
        notes: raw.notes?.trim() ?? '',
        resumeUrl: raw.resumeUrl ?? '#',
    };

    return interview;
};

const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `int-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
};

const parseStoredInterviews = (value) => {
    try {
        const parsed = JSON.parse(value);
        return ensureArray(parsed)
            .map(normalizeInterview)
            .filter(Boolean);
    } catch (error) {
        console.warn('Failed to parse interview storage. Resetting to default.', error);
        return defaultInterviews;
    }
};

export const interviewOptions = {
    stages: STAGE_OPTIONS,
    statuses: STATUS_OPTIONS,
    types: TYPE_OPTIONS,
};

export function useInterviewStore() {
    const [interviews, setInterviews] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const stored = window.localStorage.getItem(STORAGE_KEY);
        const initial = stored ? parseStoredInterviews(stored) : defaultInterviews;

        setInterviews(initial);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady || typeof window === 'undefined') return;

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
    }, [interviews, isReady]);

    const addInterview = useCallback((payload) => {
        const normalized = normalizeInterview(payload);
        setInterviews((prev) => [...prev, normalized]);
        return normalized;
    }, []);

    const updateInterview = useCallback((id, updates) => {
        setInterviews((prev) =>
            prev.map((item) =>
                String(item.id) === String(id)
                    ? {
                          ...item,
                          ...normalizeInterview({ ...item, ...updates }),
                          id: String(item.id),
                      }
                    : item,
            ),
        );
    }, []);

    const removeInterview = useCallback((id) => {
        setInterviews((prev) => prev.filter((item) => String(item.id) !== String(id)));
    }, []);

    const findInterview = useCallback(
        (id) => interviews.find((item) => String(item.id) === String(id)) ?? null,
        [interviews],
    );

    const sortedInterviews = useMemo(() => {
        return [...interviews].sort((a, b) => {
            const dateComparison = (a.date || '').localeCompare(b.date || '');
            if (dateComparison !== 0) {
                return dateComparison;
            }

            return (a.time || '').localeCompare(b.time || '');
        });
    }, [interviews]);

    return {
        interviews: sortedInterviews,
        rawInterviews: interviews,
        isReady,
        addInterview,
        updateInterview,
        removeInterview,
        findInterview,
        options: interviewOptions,
        reset: () => setInterviews(defaultInterviews),
    };
}

export const isPastInterview = (date, time) => {
    if (!date) return false;
    const [hour = '00', minute = '00'] = (time || '00:00').split(':');
    const interviewDate = new Date(`${date}T${hour}:${minute}:00`);
    return interviewDate.getTime() < new Date().setHours(0, 0, 0, 0);
};

export const getUpcomingLabel = (date, time) => {
    if (!date) return 'Jadwal belum ditentukan';

    const schedule = new Date(`${date}T${time || '00:00'}:00`);
    const formatter = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return formatter.format(schedule);
};

export const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'Scheduled':
            return 'bg-[#0A6CF5]/10 text-[#0A6CF5]';
        case 'In Review':
            return 'bg-[#08B2D0]/10 text-[#067C96]';
        case 'Completed':
            return 'bg-emerald-100 text-emerald-700';
        case 'Offered':
            return 'bg-blue-100 text-blue-700';
        case 'Rejected':
            return 'bg-rose-100 text-rose-700';
        case 'Cancelled':
            return 'bg-slate-100 text-slate-600';
        default:
            return 'bg-slate-100 text-slate-600';
    }
};
