
import { Suspense } from 'react';
import GraphCard from './GraphCard.jsx';

export default function GraphsContainer() {

    return (
        // <div>
        //     <Suspense 
        //     fallback={<div>Ładowanie wykresu...</div>}  
        //     >
        //         <GraphCard chartId={'cpu'} /*delay={2000}*/ />
        //     </Suspense>

        //     <Suspense 
        //     fallback={<div>Ładowanie wykresu...</div>}  
        //     >
        //         <GraphCard chartId={'memory'} /*delay={4000}*/ />
        //     </Suspense>

        //     <Suspense 
        //     fallback={<div>Ładowanie wykresu...</div>}  
        //     >
        //         <GraphCard chartId={'disk'} /*delay={4000}*/ />
        //     </Suspense>
        // </div>
        <div>
            <GraphCard chartId={'cpu'} />
            <GraphCard chartId={'memory'} />
            <GraphCard chartId={'disk'} />
        </div>
    )
}