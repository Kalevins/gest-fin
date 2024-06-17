import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { MovementType } from '@prisma/client';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { FileIcon } from "@/components/ui/icons"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { fixAmount, fixDate } from '@/lib/fixData';
import Skeleton from './skeleton';

// Registra los elementos de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Query de GraphQL
const GET_MOVEMENTS = gql`
  query GetMovements {
    movements {
      id
      concept
      amount
      date
      type
    }
  }
`;

type Dataset = {
  label: string;
  data: any;
  borderColor: string;
  backgroundColor: string;
  fill?: boolean;
};

type ChartState = {
  fullData: any[];
  data: {
    labels: any[];
    datasets: Dataset[];
  };
  options: any;
};

export default function Index() {
  const { loading, data } = useQuery(GET_MOVEMENTS);
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [chart, setChart] = useState<ChartState>({
    fullData: [],
    data: {
      labels: [],
      datasets: []
    },
    options: {}
  })

  // Actualiza los valores de ingresos y egresos
  useEffect(() => {
    if (data) {
      const income = data.movements.reduce((acc: any, movement: { type: string; amount: any; }) => {
        return movement.type === MovementType.INCOME ? acc + movement.amount : acc
      }, 0)
      const expense = data.movements.reduce((acc: any, movement: { type: string; amount: any; }) => {
        return movement.type === MovementType.EXPENSE ? acc + movement.amount : acc
      }, 0)
      setIncome(income)
      setExpense(expense)
    }
  }, [data])

  // Actualiza los valores del gráfico
  useEffect(() => {

    if (data) {
      const fixData = [...data.movements]
        .map((movement: { date: any; amount: any; type: string; }) => {
          return {
            date: parseInt(movement.date),
            amount: movement.amount,
            type: movement.type
          }
        })

      const sortData = fixData
        .sort((a: { date: any; }, b: { date: any; }) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })

      const viewData = sortData
        .reduce((acc: any, movement: { date: any; amount: any; type: string; }) => {
          const date = fixDate(movement.date)
          const index = acc.findIndex((item: { date: any; }) => item.date === date)
          if (index === -1) {
            acc.push({
              date,
              total: movement.type === MovementType.INCOME ? movement.amount : -movement.amount,
              incomes: movement.type === MovementType.INCOME ? movement.amount : 0,
              expenses: movement.type === MovementType.EXPENSE ? movement.amount : 0,
            })
          } else {
            if (movement.type === MovementType.INCOME) {
              acc[index].total += movement.amount
              acc[index].incomes += movement.amount
            }
            if (movement.type === MovementType.EXPENSE) {
              acc[index].total -= movement.amount
              acc[index].expenses += movement.amount
            }
          }
          return acc
        }, [])

      const labels = viewData
        .map((movement: { date: any; }) => movement.date)

      const datasets = [
        {
          label: 'Ingresos',
          data: viewData.map((movement: { incomes: any; }) => movement.incomes),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Egresos',
          data: viewData.map((movement: { expenses: any; }) => movement.expenses),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Total',
          data: viewData.map((movement: { total: { amount: any; }; }) => movement.total),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Acumulado',
          data: viewData.map((movement: { total: { amount: any; }; }) => movement.total).reduce((acc: any, total: any) => {
            acc.push((acc.length ? acc[acc.length-1] : 0) + total)
            return acc
          }
          , []),
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.5)',
          fill: false,
        }
      ]

      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += fixAmount(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
      }

      setChart({
        fullData: viewData,
        data: {
          labels,
          datasets
        },
        options
      })
    }
  }, [data])

  // Descarga el archivo CSV
  const handleDownloadCSV = () => {
    const csv = chart.fullData.reduce((acc: string, movement: { date: any; total: any; incomes: any; expenses: any; }) => {
      return acc + `${movement.date},${movement.total},${movement.incomes},${movement.expenses}\n`
    }, 'Fecha,Total,Ingresos,Egresos\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reporte.csv'
    a.click()
  }

  // Muestra un esqueleto mientras se carga la información
  if (loading) return <Skeleton />

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Saldo total</CardDescription>
              <CardTitle className="text-4xl">{fixAmount(income-expense)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{income > expense ? 'Superávit' : 'Déficit'}</div>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">{fixAmount(income)} ingresos - {fixAmount(expense)} egresos</div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ingresos</CardDescription>
              <CardTitle className="text-4xl">{fixAmount(income)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{income/(income+expense)*100}% del total</div>
            </CardContent>
            <CardFooter>
              <Progress value={income/(income+expense)*100} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Egresos</CardDescription>
              <CardTitle className="text-4xl">{fixAmount(expense)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{expense/(income+expense)*100}% del total</div>
            </CardContent>
            <CardFooter>
              <Progress value={expense/(income+expense)*100} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue="lines">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="lines">Lineas</TabsTrigger>
              <TabsTrigger value="bars">Barras</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 gap-1 text-sm" onClick={handleDownloadCSV}>
                <FileIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Descargar</span>
              </Button>
            </div>
          </div>
          <TabsContent value="lines">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Reportes</CardTitle>
                <CardDescription>A continuación se muestra un gráfico de los moviminetos financieros</CardDescription>
              </CardHeader>
              <CardContent>
                <Line options={chart.options} data={chart.data} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bars">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Reportes</CardTitle>
                <CardDescription>A continuación se muestra un gráfico de los moviminetos financieros</CardDescription>
              </CardHeader>
              <CardContent>
                <Bar options={chart.options} data={chart.data} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
