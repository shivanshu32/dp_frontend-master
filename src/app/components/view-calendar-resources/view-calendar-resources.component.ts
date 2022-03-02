import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CalendarOptions } from "@fullcalendar/angular"; // useful for typechecking
import { OrderService } from "src/app/services/order.service";

@Component({
  selector: "app-view-calendar-resources",
  templateUrl: "./view-calendar-resources.component.html",
  styleUrls: ["./view-calendar-resources.component.css"],
})
export class ViewCalendarResourcesComponent implements OnInit {
  myEvents = [];
  printers = [];
  showNavbar = false;
  startDate = "";
  endDate = "";

  calendarOptions: CalendarOptions = {
    schedulerLicenseKey: "0109492879-fcs-1622476817",
    initialView: "resourceTimelineDay",
    height: "auto",
    resourceAreaWidth: "125px",
    expandRows: true,
    slotMinTime: "06:00:00",
    slotMaxTime: "23:00:00",
    headerToolbar: {
      start: "dayGridMonth resourceTimelineWeek resourceTimelineDay",
      center: "title",
      end: "today prev,next",
    },
    events: this.myEvents,
    resourceAreaHeaderContent: "Printers",
    resources: this.printers,
    eventClick: (info) => {
      console.log(info.event.extendedProps._id);
      this.reRouteUser(info.event.extendedProps._id);
    },
    datesSet:(arg) => {
      this.myEvents = [];
      this.printers = [];
      this.startDate = arg.startStr.split("T")[0]
      this.endDate = arg.endStr.split("T")[0];
      console.log(this.startDate,this.endDate,"DATES SET")
      console.log(
        this.myEvents.length,
        this.printers.length,
        "starting loading"
      );
      this.getAllOrders()
      
    }
  };

  reRouteUser(id) {
    console.log(id);
    window.open(`/order-details?id=${id}`, "_blank");
    // this.router.navigate(["/order-details"], {
    //   queryParams: { id: id },
    // });
  }

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    
  }

  getAllOrders() {
    // this.myEvents = []; 
    // this.printers = [];
    this.orderService.getAllOrdersCalendar(`?startCalendarDate=${this.startDate}&endCalendarDate=${this.endDate}`).subscribe(
      (data: any) => {
        console.log(data);
        
        data.data.forEach((order) => {
          if (order.printer_name) {
            let str = order.name;
            str = str.replace(/\s/g, "");
            str = str.replace(/\//g, "");

            let startDate;
            if(order.printer_schedule.length < 5){
              // new time
              startDate = new Date(
                new Date(order.print_date + "T00:00:00.000").setHours(
                  this.getPrinterHoursNew(order.printer_schedule),
                  0,
                  0
                )
              );
            }else{
              // old time
              startDate = new Date(
                new Date(order.print_date + "T00:00:00.000").setHours(
                  this.getPrinterHours(order.printer_schedule),
                  0,
                  0
                )
              );
            }
            

            let endDate = new Date(
              new Date(startDate).setMinutes(
                startDate.getMinutes() +
                  this.getPrinterMinutes(order.printer_duration)
              )
            );

            console.log(
              order.name,
              order.print_date,
              order.printer_schedule,
              order.printer_duration,
              this.toIsoString(startDate),
              this.toIsoString(endDate)
            );

            this.myEvents.push({
              title: `${order.id}/${str}/${order.total_product_count}/${order.ship_type}`,
              start: this.toIsoString(startDate),
              end: this.toIsoString(endDate),
              resourceId: order.printer_name,
              editable: false,
              allDay: false,
              extendedProps: { _id: order.id },
              durationEditable: false,
              backgroundColor: this.getColor(order.printer_name),
              borderColor: this.getColor(order.printer_name),
            });
          }

          // check if printer already
          if (
            !this.printers.includes(order.printer_name) &&
            order.printer_name
          ) {
            this.printers.push({
              id: order.printer_name,
              title: order.printer_name,
            });
          }
        });
        
        this.calendarOptions.resources = this.printers;
        this.calendarOptions.events = this.myEvents;

        console.log(this.myEvents.length,this.printers.length,"finished loading")
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getPrinterHoursNew(sch) {
    let hour = 0;
    switch (sch) {
      case "6AM":
        hour = 6;
        break;
      case "7AM":
        hour = 7;
        break;
      case "8AM":
        hour = 8;
        break;
      case "9AM":
        hour = 9;
        break;
      case "10AM":
        hour = 10;
        break;
      case "11AM":
        hour = 11;
        break;
      case "12PM":
        hour = 12;
        break;
      case "1PM":
        hour = 13;
        break;
      case "2PM":
        hour = 14;
        break;
      case "3PM":
        hour = 15;
        break;
      case "4PM":
        hour = 16;
        break;
      case "5PM":
        hour = 17;
        break;
      case "6PM":
        hour = 18;
        break;
      case "7PM":
        hour = 19;
        break;
      case "8PM":
        hour = 20;
        break;
      case "9PM":
        hour = 21;
        break;
      case "10PM":
        hour = 22;
        break;
      default:
        hour = 6;
        break;
    }
    return hour;
  }

  getPrinterHours(sch) {
    let hour = 0;
    switch (sch) {
      case "First 8AM":
        console.log("First 8AM");
        hour = 8;
        break;
      case "Mid 11AM":
        hour = 11;
        break;
      case "Last 3PM":
        console.log("Last 3PM");
        hour = 15;
        break;
      case "EOD 5PM":
        hour = 17;
        break;
      case "Rush All Day":
        hour = 7;
        break;
      case "Overtime 6PM":
        hour = 18;
        break;
      default:
        hour = 8;
        break;
    }
    console.log(hour);
    return hour;
  }

  masterColors = [
    "Tomato",
    "orange",
    "MediumSeaGreen",
    "SlateBlue",
    "Gray",
    "Violet",
    "LightGray",
    "Brown",
    "BlueViolet",
    "CadetBlue",
    "Chocolate",
    "CornflowerBlue",
    "DarkCyan",
  ];
  printerColor = [];
  getColor(printerName) {
    if (this.printerColor.some((pc) => pc.name == printerName)) {
      // color already assigned
      console.log(this.printerColor);
      return this.printerColor.filter((pc) => pc.name == printerName)[0].color;
    } else {
      let obj = { name: printerName, color: this.masterColors[0] };
      this.printerColor.push(obj);
      this.masterColors.splice(0, 1);
      console.log(this.printerColor);
      return obj.color;
    }
  }

  // getColor(sch) {
  //   let color = "blue";
  //   switch (sch) {
  //     case "First 8AM":
  //       color = "blue";
  //       break;
  //     case "Mid 11AM":
  //       color = "#baba02";
  //       break;
  //     case "EOD 5PM":
  //       color = "pink";
  //       break;
  //     case "Rush All Day":
  //       color = "orange";
  //       break;
  //     case "Overtime 6PM":
  //       color = "green";
  //       break;
  //     default:
  //       color = "blue";
  //       break;
  //   }
  //   return color;
  // }

  getPrinterMinutes(duration) {
    let minutes = 0;
    switch (duration) {
      case "30 Min":
        console.log("30 Min");
        minutes = 30;
        break;
      case "1 Hr":
        minutes = 60;
        break;
      case "1.5 Hr":
        minutes = 90;
        break;
      case "2 Hr":
        minutes = 120;
        break;
      case "2.5 Hr":
        minutes = 150;
        break;
      case "3 Hr":
        minutes = 180;
        break;
      case "3.5 Hr":
        console.log("3.5 Hr");
        minutes = 210;
        break;
      case "4 Hr":
        minutes = 240;
        break;
      case "5 Hr":
        minutes = 300;
        break;
      case "6 Hr":
        minutes = 360;
        break;
      case "7 Hr":
        minutes = 420;
        break;
      default:
        minutes = 0;
        break;
    }
    console.log(minutes);
    return minutes;
  }

  toIsoString(date) {
    var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? "0" : "") + norm;
      };

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ":" +
      pad(tzo % 60)
    );
  }
}
