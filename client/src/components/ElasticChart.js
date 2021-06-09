import React, {useEffect , useState} from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import '../App.css'
const ElasticChart = props =>  {
    const [data, setData] = useState([]);

    async function getData(url) {
        const response = await fetch(url);
        const data = await response.json();
        let barChartData = data.buckets.map(bar => ({ 
        name: bar.key,
        avg: bar.status_stats.avg , 
        count: bar.status_stats.count ,
        min: bar.status_stats.min ,
        max: bar.status_stats.max

        }));
        setData(barChartData);
        console.log(barChartData);
      }
  
    useEffect(() => {
        getData('/orderStats')
        
    },[]);

    if(data){
    return (
        <div className ="barDiv">
            <BarChart
            width={800}
            height={400}
            data={data}
            margin={{
              top:0, right: 0, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="max" fill="#8884d8" />
            <Bar dataKey="min" fill="#82ca9d" />
            <Bar dataKey="avg" fill="#C86635" />
            <Bar dataKey="count" fill="#C835C5" />
          </BarChart>
        </div>
          
    );
    }
    else{
        return (
            <div>Loading...</div>
        );
    }
  
   
  }

  export default ElasticChart;