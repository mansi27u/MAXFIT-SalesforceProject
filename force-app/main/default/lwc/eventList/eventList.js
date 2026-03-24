import { LightningElement, wire } from 'lwc';
import getEvents from '@salesforce/apex/EventController.getEvents';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Start Date', fieldName: 'Start_Date_Time__c', type: 'date' }
];

export default class EventList extends LightningElement {

    columns = columns;
    events;

    @wire(getEvents)
    wiredEvents({ error, data }) {
        if (data) {
            this.events = data;
        } else if (error) {
            console.error(error);
        }
    }
}