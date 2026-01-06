
import LiveGraph from './LiveGraph/LiveGraph.jsx';

// export default async function Graph({ chartId, delay }) {
//     await new Promise((res) => setTimeout(res, delay));

export default async function GraphCard({ chartId }) {

    const graphName = chartId === 'cpu' ? 'CPU' : chartId === 'memory' ? 'pamięci RAM' : chartId === 'disk' ? 'dysku' : 'nieznany zasób';

    return (
        <div className="graph-container">
            <h2 className="graph-title">Wykorzystanie {graphName}:</h2>
            <LiveGraph chartId={chartId} />
        </div>
    )
}