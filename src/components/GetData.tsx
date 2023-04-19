import { Box, Button } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import BarChart from "./BarChart";

const SPREADSHEET_ID = "1NXT_xWJXbuF-77TO6WjZo9QRHuO7cdlMJYF4VBbtFDU";
const RANGE = "A2:G1000";

export default function GetData() {
  const [data, setData] = useState<any>();

  const [date, setDate] = useState<Date>(new Date())


  const getDateData = useMemo(() => {

    const todayData = data?.values?.filter(
      (val: any) => date?.toLocaleDateString() === new Date(val[0]).toLocaleDateString()
    );

      const jsonTodayData = todayData?.map((item: any) => ({
        date: item[0],
        score: parseInt(item[1]),
        major: item[2],
        year: item[3],
        text: item[6]
      }));

      return jsonTodayData

  }, [data, date])

  useEffect(() => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${process.env.REACT_APP_API_KEY}`
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result)
      })
      .catch((error) => console.log(error));
  }, []);

  const getAverageScore = () => {
    
    return (
      getDateData?.reduce((acc: number, curr: any) => curr.score + acc, 0) /
      getDateData?.length
    );
  };

  const getFrequencies = () => {
    const scoreCounter: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const majorCounter: any = {};
    const yearCounter: any = {};

    getDateData?.forEach((val: any) => {
      const { score, major, year } = val;

      scoreCounter[score] = (scoreCounter[score] || 0) + 1;
      majorCounter[major] = (majorCounter[major] || 0) + 1;
      yearCounter[year] = (yearCounter[year] || 0) + 1;
    });

    return { scoreCounter, majorCounter, yearCounter };
  };

  const { scoreCounter, majorCounter, yearCounter } = getFrequencies();

  return (
    <Box sx={{display: "flex", alignItems: "center", flexDirection: "column"}}>
      <h3>Data for {date.toLocaleDateString()} </h3>
      <Box>
        <Button onClick={() => setDate(prevDate => new Date(prevDate.getTime() - 24 * 60 * 60 * 1000))}>Prev Date</Button>
        <Button onClick={() => setDate(prevDate => new Date(prevDate.getTime() + 24 * 60 * 60 * 1000))}>Next Date</Button>
      </Box>
      <h4>Responses: {getDateData?.length}</h4>
      <h4>Average Score: {getAverageScore().toFixed(1)}</h4>

      <BarChart data={scoreCounter} chartName="Scores:" />
      <br></br>
      <BarChart data={majorCounter} chartName="Majors:" />
      <br></br>
      <BarChart data={yearCounter} chartName="Years:" />

      <br></br>
      
      <h4>Quotes:</h4>
      {getDateData?.map((each: any) => <p style={{marginTop: "-8px", maxWidth: "90vw"}}>{each?.text}</p>)}

    </Box>
  );
}
