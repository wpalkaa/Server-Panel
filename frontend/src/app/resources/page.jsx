
import GraphCard from './components/GraphCard'
import './Resources.css'

export default function Resources() {


    return (
        <div className="resources-page">
            <div className="graphs-container">
                <GraphCard chartId={'cpu'} />
                <GraphCard chartId={'memory'} />
            </div>
            <div className="graphs-container">
                <GraphCard chartId={'disk'} />
            </div>
        </div>
    )
}