import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  calculateDiffInDays(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  getArrivalType(type: string) {
    const types = {
      '7_10_days': '7-10 Business Days',
      '5_business_days': '5 Business Days',
      'eow': 'End of Week',
      '3_days': '3 Days',
      '2_days': '2 Days',
      'next_day': 'Next Day',
      'arrival_others': 'Custom'
    }
    if (types[type])
      return types[type];
    return undefined;
  }

  getResourceType(type: string) {
    const types = {
      'in_home': 'In - house',
      'out_side': 'OutSide Resource'
    };
    if (types[type])
      return types[type];
    return undefined;
  }

  getOrderType(type: string) {
    const types = {
      'screen_printing': 'Screen Printing',
      'direct_to_garment': 'Direct To Garment',
      'embroidery': 'Embroidery',
      'order_others': 'Others'
    };
    if (types[type])
      return types[type];
    return undefined;
  }

  getOrderTypes() {
    return [
      {
        key: 'screen_printing',
        value: 'Screen Printing'
      },
      {
        key: 'direct_to_garment',
        value: 'Direct To Garment'
      },
      {
        key: 'embroidery',
        value: 'Embroidery'
      },
      {
        key: 'order_others',
        value: 'Other'
      },
    ]
  }

  getShipping(type: string) {
    let response = undefined;
    this.getShippingTypes().map(shipping => {
      if (shipping.key === type)
        response = shipping.value;
    });

    return response;
  }

  getShippingTypes() {
    return [
      {
        key: 'pickup',
        value: 'Pickup'
      },
      {
        key: 'courier',
        value: 'Courier'
      },
      {
        key: 'hand_deliver',
        value: 'Hand Deliver'
      },
      {
        key: 'shipping_others',
        value: 'Other'
      },
      {
        key: 'USPS First Class Mail',
        value: 'USPS First Class Mail'
      },
      {
        key: 'USPS Media Mail',
        value: 'USPS Media Mail'
      },
      {
        key: 'USPS Parcel Select Ground',
        value: 'USPS Parcel Select Ground'
      },
      {
        key: 'USPS Priority Mail',
        value: 'USPS Priority Mail'
      },
      {
        key: 'USPS Priority Mail Express',
        value: 'USPS Priority Mail Express'
      },
      {
        key: 'FedEx Ground',
        value: 'FedEx Ground'
      },
      {
        key: 'FedEx Home Delivery',
        value: 'FedEx Home Delivery'
      },
      {
        key: 'FedEx 2Day',
        value: 'FedEx 2Day'
      },
      {
        key: 'FedEx 2Day A.M.',
        value: 'FedEx 2Day A.M.'
      },
      {
        key: 'FedEx Express Saver',
        value: 'FedEx Express Saver'
      },
      {
        key: 'FedEx Standard Overnight',
        value: 'FedEx Standard Overnight'
      },
      {
        key: 'FedEx Priority Overnight',
        value: 'FedEx Priority Overnight'
      },
      {
        key: 'FedEx First Overnight',
        value: 'FedEx First Overnight'
      },
      {
        key: 'FedEx 1Day Freight',
        value: 'FedEx 1Day Freight'
      },
      {
        key: 'FedEx 2Day Freight',
        value: 'FedEx 2Day Freight'
      },
      {
        key: 'FedEx 3Day Freight',
        value: 'FedEx 3Day Freight'
      },
      {
        key: 'FedEx First Overnight Freight',
        value: 'FedEx First Overnight Freight'
      },
      {
        key: 'UPS Ground',
        value: 'UPS Ground'
      },
      {
        key: 'UPS 3 Day Select',
        value: 'UPS 3 Day Select'
      },
      {
        key: 'UPS 2nd Day Air',
        value: 'UPS 2nd Day Air'
      },
      {
        key: 'UPS Next Day Air Saver',
        value: 'UPS Next Day Air Saver'
      },
      {
        key: 'UPS Next Day Air',
        value: 'UPS Next Day Air'
      },
      {
        key: 'UPS Next Day Air Early',
        value: 'UPS Next Day Air Early'
      },
      {
        key: 'UPS 2nd Day Air AM',
        value: 'UPS 2nd Day Air AM'
      },
    ];
  }

  getStatesList() {
    return [
      'AL',
      'AK',
      'AZ',
      'AR',
      'CA',
      'CO',
      'CT',
      'DE',
      'DC',
      'FL',
      'GA',
      'HI',
      'ID',
      'IL',
      'IN',
      'IA',
      'KS',
      'KY',
      'LA',
      'ME',
      'MD',
      'MA',
      'MI',
      'MN',
      'MS',
      'MO',
      'MT',
      'NE',
      'NV',
      'NH',
      'NJ',
      'NM',
      'NY',
      'NC',
      'ND',
      'OH',
      'OK',
      'OR',
      'PA',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VT',
      'VA',
      'WA',
      'WV',
      'WI',
      'WY'
    ];
  }
}
