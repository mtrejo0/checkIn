import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";

const SPREADSHEET_ID = "1NXT_xWJXbuF-77TO6WjZo9QRHuO7cdlMJYF4VBbtFDU";
const RANGE = "A2:D6";

export default function GetData() {
  const [data, setData] = useState<any>();


  useEffect(() => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${process.env.REACT_APP_API_KEY}`
    )
      .then((response) => response.json())
      .then((result) => {
        const todayData = result.values.filter((val: any) => {
          
          const todayDateString = new Date().toLocaleDateString(); // convert today's date to a string in the format 'mm/dd/yyyy'

          const timestampDate = new Date(val[0]);
          const timestampDateString = timestampDate.toLocaleDateString();

          return todayDateString === timestampDateString
        })

        const jsonTodayData = todayData.map((item: any) => ({
          "date": item[0],
          "score": parseInt(item[1]),
          "major": item[2],
          "year": item[3]
        }))

        setData(jsonTodayData)

      
      
      })
      .catch((error) => console.log(error));

  }, []);


  const getAverageScore = () => {
    return data?.reduce((acc: number, curr: any) => curr.score + acc, 0) / data?.length
  }

  const getFrequencies = () => {

    const scoreCounter: any = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    const majorCounter: any = {}
    const yearCounter: any = {}

    data?.forEach((val: any) => {

      const {score, major, year} = val


      scoreCounter[score] = (scoreCounter[score] || 0) + 1;
      majorCounter[major] = (majorCounter[major] || 0) + 1;
      yearCounter[year] = (yearCounter[year] || 0) + 1;

    })

    return {scoreCounter, majorCounter, yearCounter}
  }

  const {scoreCounter, majorCounter, yearCounter} = getFrequencies()

  return (
    <div>

      <h3>Average Score for today: {getAverageScore().toFixed(1)}</h3>

      <BarChart data={scoreCounter} chartName="Scores:"/>
      <BarChart data={majorCounter} chartName="Majors:"/>
      <BarChart data={yearCounter} chartName="Years:"/>
    </div>
  );
}
