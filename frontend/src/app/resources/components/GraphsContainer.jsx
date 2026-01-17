
import GraphCard from './GraphCard.jsx';

export default function GraphsContainer() {

    return (
        <div>
            <GraphCard chartId={'cpu'} />
            <GraphCard chartId={'memory'} />
            <GraphCard chartId={'disk'} />
        </div>
    )
}