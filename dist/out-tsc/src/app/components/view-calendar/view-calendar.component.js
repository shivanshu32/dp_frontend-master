import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ViewCalendarComponent = /** @class */ (() => {
    let ViewCalendarComponent = class ViewCalendarComponent {
        constructor(orderService, router) {
            this.orderService = orderService;
            this.router = router;
            this.myEvents = [];
            this.printers = [];
            this.showNavbar = false;
            this.calendarOptions = {
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
                eventClick: (info) => {
                    console.log(info.event.extendedProps._id);
                    this.reRouteUser(info.event.extendedProps._id);
                },
            };
            this.masterColors = [
                "Tomato",
                "orange",
                "MediumSeaGreen",
                "SlateBlue",
                "Gray",
                "Violet",
                "LightGray",
            ];
            this.printerColor = [];
        }
        reRouteUser(id) {
            console.log(id);
            this.router.navigate(["/order-details"], {
                queryParams: { id: id },
            });
        }
        ngOnInit() {
            this.getAllOrders();
        }
        getAllOrders() {
            this.orderService.getAllOrders().subscribe((data) => {
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
                        backgroundColor: order.status == "Completed" ? "gray" : "blue",
                        borderColor: order.status == "Completed" ? "gray" : "blue",
                    });
                    // check if printer already
                    if (!this.printers.includes(order.printer_name) &&
                        order.printer_name) {
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
                        let startDate = new Date(new Date(order.print_date).setHours(this.getPrinterHours(order.printer_schedule), 0, 0));
                        let endDate = new Date(new Date(startDate).setMinutes(startDate.getMinutes() +
                            this.getPrinterMinutes(order.printer_duration)));
                        console.log(order.name, order.print_date, order.printer_schedule, order.printer_duration, order.printer_name, this.toIsoString(startDate), this.toIsoString(endDate));
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
            }, (err) => {
                console.log(err);
            });
        }
        toIsoString(date) {
            var tzo = -date.getTimezoneOffset(), dif = tzo >= 0 ? "+" : "-", pad = function (num) {
                var norm = Math.floor(Math.abs(num));
                return (norm < 10 ? "0" : "") + norm;
            };
            return (date.getFullYear() +
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
                pad(tzo % 60));
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
        getColor(printerName) {
            if (this.printerColor.some((pc) => pc.name == printerName)) {
                // color already assigned
                console.log(this.printerColor);
                return this.printerColor.filter((pc) => pc.name == printerName)[0].color;
            }
            else {
                let obj = { name: printerName, color: this.masterColors[0] };
                this.printerColor.push(obj);
                this.masterColors.splice(0, 1);
                console.log(this.printerColor);
                return obj.color;
            }
        }
    };
    ViewCalendarComponent = __decorate([
        Component({
            selector: "app-view-calendar",
            templateUrl: "./view-calendar.component.html",
            styleUrls: ["./view-calendar.component.css"],
        })
    ], ViewCalendarComponent);
    return ViewCalendarComponent;
})();
export { ViewCalendarComponent };
//# sourceMappingURL=view-calendar.component.js.map