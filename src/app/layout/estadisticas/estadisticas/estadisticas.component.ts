import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexTitleSubtitle, ApexFill, ApexStroke, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header/header.component';
import { EstadisticasService } from '../../servicios/estadisticas.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;  // Añade yaxis para configurar el eje vertical
  title: ApexTitleSubtitle;
  responsive?: ApexResponsive[];
  labels?: any;
  stroke?: ApexStroke;
  fill?: ApexFill;
  colors?: string[]; // Agregar colors a la estructura

};

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [RouterOutlet, NgApexchartsModule, SidebarComponent, HeaderComponent],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;


    
  public chartOptions: ChartOptions = {
    series: [{
      name: 'Total Sales',
      data: [] as number[],  // Inicializa como array de números
      color: '#FDA608' // Especifica el color aquí directamente en la serie

    }],
    chart: {
      height: 350,
      type: 'line'
    },
    title: {
      text: ''
    },
    xaxis: {
      categories: [],
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Total Sales'
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#FDA608'] // Otra forma de especificar el color

    },
    fill: {
      type: 'solid',
      opacity: 0.7
    },
    colors: ['#FDA608'], // Color general

    responsive: []
  };
  
 

  constructor(private salesService: EstadisticasService,
              private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadSalesData();
  }


  loadSalesData(): void {
    this.salesService.getSalesData().subscribe(
      data => {
        const salesByDate: { [key: string]: number } = data.reduce((acc: any, item: any) => {
          const date = item.date_only;
          const sales = item.total_sales;
          if (acc[date]) {
            acc[date] += sales;
          } else {
            acc[date] = sales;
          }
          return acc;
        }, {});
  
        const dates: string[] = Object.keys(salesByDate).map(date => new Date(date).toISOString().split('T')[0]);
        const totals: number[] = Object.values(salesByDate);
  
        console.log('Dates:', dates);
        console.log('Totals:', totals);
  
        this.chartOptions.series = [{
          name: 'Total Sales',
          data: totals,
          color: '#FDA608' // Asegúrate de que el color esté definido aquí también
        }];
        this.chartOptions.xaxis.categories = dates;
  
        // Forzar la actualización
        this.cdr.detectChanges();  // Forzar la detección de cambios
        this.chart.updateOptions({
          xaxis: {
            categories: dates,
            type: 'datetime'
          }
        }, true);  // Actualizar el gráfico
      },
      error => {
        console.error('Error fetching sales data:', error);
      }
    );
  }
  




  
}
