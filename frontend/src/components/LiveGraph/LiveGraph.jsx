'use client';
import { useState, useEffect } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import io from 'socket.io-client';
import './liveGraph.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx';

const graphConfigs = {
    cpu: {
        domain: [0, 100],
        tickCount: 11,
        unit: '%'
    },
    memory: {
        domain: [0, 8000],
        tickCount: 9,
        unit: 'MB'
    }
};

export default function LiveGraph({ chartId }) {
    
    const config = graphConfigs[chartId] || graphConfigs['cpu'];
    const maxPoints = 10;
    const [ isConnected, setIsConnected ] = useState(false);
    
    const [data, setData] = useState(new Array(maxPoints).fill().map( (_, index) => ({
        time: new Date(Date.now() - (10  - index*2) * 1000).toLocaleTimeString("it-IT"),
        value: 0
    })));


    // ============ WebSocket connection and data handling ============

    useEffect( () => {
        console.log("Connecting to WebSocket for chart ", chartId);
        const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

        socket.on("connect", () => {
            setIsConnected(true);
            console.log("Debug: Graph WebSocket connected.");
            console.log("Debug: requested data for: ", chartId);
            socket.emit('data request', { chartId: chartId} )
        });

        socket.on("error", (error) => {
            console.error("Error: Graph WebSocket error: \n", error);
        });


        socket.on("data update", (event) => {
            // console.log(`Debug: Received data for chart ${chartId}: \n`, event.data);

            setData( (prevData) => {
                const newData = [...prevData, event.data];
                console.log("Debug: Updated data array: \n", newData);

                if( newData.length > maxPoints ) {
                    return newData.slice(1) // keep only the last maxPoints entries
                }
                return newData;
            } );
        });

        return () => {
            console.log(`Debug: Cleaning up connection for: ${chartId}`);
            socket.off("connect");
            socket.off("disconnect");
            socket.off("data update");
            socket.off("connect_error");
            socket.disconnect();
            console.log(`Debug: Charts ${chartId} WebSocket disconnected.`);
            
            setIsConnected(false);
        }

    }, [chartId]);



    if(!isConnected) {
        return (
            <div className="graph-loading">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <LineChart width={500} height={350} data={data}>
            <XAxis dataKey={"time"} angle={-45} height={60} textAnchor="end" />
            <YAxis dataKey={"value"} domain={config.domain} tickCount={config.tickCount}/>
            <Line dataKey={"value"} isAnimationActive={false} dot={false}/>
            <CartesianGrid stroke="#797979ff" strokeDasharray="1 1" />
            <Tooltip 
                labelFormatter={ (time) => [`Godzina: ${time}`]}
                formatter={ (value) => [`Wykorzystanie: ${value.toFixed(2)}${config.unit}`]}
                />
        </LineChart>
    )
}