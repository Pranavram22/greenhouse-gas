// app/api/getEmissions/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

interface EmissionData {
  Country: string;
  Year: string;
  'CO2 Emissions': string;
  'CH4 Emissions': string;
  'N2O Emissions': string;
}

export async function GET() {
  const csvFilePath = path.join(process.cwd(), 'public', 'emissions_data.csv');
  const file = fs.readFileSync(csvFilePath, 'utf8');

  const parsedData: EmissionData[] = await new Promise((resolve) => {
    Papa.parse<EmissionData>(file, {
      header: true,
      complete: (result) => {
        resolve(result.data);
      },
    });
  });

  return NextResponse.json(parsedData);
}
