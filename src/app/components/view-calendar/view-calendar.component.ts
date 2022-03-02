import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions,FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import { OrderService } from 'src/app/services/order.service';
declare var $:any;

@Component({
  selector: "app-view-calendar",
  templateUrl: "./view-calendar.component.html",
  styleUrls: ["./view-calendar.component.css"],
})
export class ViewCalendarComponent implements OnInit {
  myEvents = [];
  printers = [];
  privateEvents = [];
  showNavbar = false;
  startDate= "";
  endDate= "";
  @ViewChild("fullCalendar") calendar: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    schedulerLicenseKey: "0109492879-fcs-1622476817",
    slotMinTime: "06:00:00",
    initialView: "timeGridWeek",
    height: "auto",
    headerToolbar: {
      start: "dayGridMonth timeGridWeek dayGridDay",
      center: "title",
      end: "today prev,next",
    },
    events: this.myEvents,
    // eventSources: [this.myEvents, this.privateEvents],
    eventClick: (info) => {
      if (info.event.extendedProps._id) {
        console.log(info.event.extendedProps._id);
        this.reRouteUser(info.event.extendedProps._id);
      } else if (info.event.extendedProps.eventId) {
        if (confirm("Do you want to delete this event?")) {
          this.deleteEvent(info.event.extendedProps.eventId);
        }
      }
    },
    dateClick: (info) => {
      let title = prompt(
        `A reminder will be created on ${info.dateStr}. Please enter the title`
      );
      if (title) {
        console.log(info.dateStr, title);
        this.saveEvent(info.dateStr, title);
      }
    },
    datesSet: (arg) => {
      this.startDate = arg.startStr.split("T")[0];
      this.endDate = arg.endStr.split("T")[0];
      this.myEvents = []
      this.privateEvents = [];
      this.printers = []
      this.getAllOrders();
    },
  };

  deleteEvent(id) {
    this.orderService.deleteEvent(id).subscribe(
      (data) => {
        console.log(data);
        this.getAllEvents();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  saveEvent(date, title) {
    this.orderService.createEvent({ date, title }).subscribe(
      (data) => {
        console.log(data);
        this.getAllEvents();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllEvents() {
    this.privateEvents = [];
    this.orderService.getAllEvents().subscribe(
      (data: any) => {
        data.data.forEach((element) => {
          let d = new Date(element.date + "T00:00:00.000");
          let endDate = new Date(new Date(d).setMinutes(d.getMinutes() + 30));
          this.privateEvents.push({
            title: `${element.title}`,
            extendedProps: { eventId: element.id },
            start: this.toIsoString(d),
            end: this.toIsoString(endDate),
            resourceId: null,
            editable: false,
            allDay: false,
            durationEditable: false,
            backgroundColor: "maroon",
            borderColor: "maroon",
          });
        });
        // console.log(this.privateEvents);
        this.myEvents = [...this.tempEvents, ...this.privateEvents];
        // console.log(this.myEvents);

        // this.calendar.getApi().removeAllEvents();
        this.calendarOptions.events = this.myEvents;
        // this.calendar.getApi().refetchEvents();
        // this.calendar.getApi().render();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  reRouteUser(id) {
    console.log(id);
    window.open(`/order-details?id=${id}`, "_blank");
    // this.router.navigate(["/order-details"], {
    //   queryParams: { id: id },
    // });
  }

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    // this.getAllOrders();
  }

  tempEvents = [];
  getAllOrders() {
    this.orderService
      .getAllOrdersCalendar(
        `?startCalendarDate=${this.startDate}&endCalendarDate=${this.endDate}&calendar=true`
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          data.data.forEach((order) => {
            let str = order.name;
            str = str.replace(/\s/g, "");
            str = str.replace(/\//g, "");
            this.myEvents.push({
              title: `${order.id}/${str}/${order.total_product_count}/${order.ship_type}`,
              start: order.arrival_date,
              resourceId: order.printer_name,
              editable: false,
              allDay: true,
              extendedProps: { _id: order.id },
              durationEditable: false,
              backgroundColor: this.getEventColor(order.status),
              borderColor: this.getEventColor(order.status),
            });

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

          // duplicates
          data.data.forEach((order) => {
            if (order.printer_name) {
              let str = order.name;
              str = str.replace(/\s/g, "");
              str = str.replace(/\//g, "");

              let startDate;
              if (order.printer_schedule.length < 5) {
                // new hours
                startDate = new Date(
                  new Date(order.print_date + "T00:00:00.000").setHours(
                    this.getPrinterHoursNew(order.printer_schedule),
                    0,
                    0
                  )
                );
              } else {
                // old hours
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
                order.printer_name,
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
                // backgroundColor: this.getColor(order.printer_schedule),
                // borderColor: this.getColor(order.printer_schedule),
                backgroundColor: this.getColor(order.printer_name),
                borderColor: this.getColor(order.printer_name),
              });
            }
          });
          this.tempEvents = [...this.myEvents];

          
          this.getAllEvents();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getEventColor(status) {
    switch (status) {
      case "Production":
        return "green";
        break;
      case "Completed":
        return "gray";
        break;
      default:
        return "blue";
        break;
    }
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
}
