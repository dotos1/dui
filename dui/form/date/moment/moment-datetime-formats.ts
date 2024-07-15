import { MatDateFormats } from "@angular/material/core";
import { MatDatetimeFormats } from "@dotos/dui/form/date/adapter";

export const MAT_MOMENT_DATETIME_FORMATS: MatDatetimeFormats = {
  parse: {
    dateInput: "L",
    monthInput: "MMMM",
    timeInput: "LT",
    datetimeInput: "L LT"
  },
  display: {
    dateInput: "L",
    monthInput: "MMMM",
    datetimeInput: "L LT",
    timeInput: "LT",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
    popupHeaderDateLabel: "ddd, DD MMM"
  }
};
export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
      dateInput: 'DD/MM/YYYY'
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM Y',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM Y'
  }
};

const dateNames: string[] = [];
for (let date = 1; date <= 31; date++) {
    dateNames.push(String(date));
}
