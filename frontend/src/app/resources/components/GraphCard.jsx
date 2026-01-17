
'use client'
import { useTranslation } from '@/context/LanguageProvider.js';
import LiveGraph from './LiveGraph/LiveGraph.jsx';


// export default async function Graph({ chartId, delay }) {
//     await new Promise((res) => setTimeout(res, delay));

export default function GraphCard({ chartId }) {

    const { lang } = useTranslation();

    return (
        <div className="graph-card">
            <h2 className="graph-title">{lang.resources.graphs.title[chartId]}</h2>
            <LiveGraph chartId={chartId} />
        </div>
    )
}