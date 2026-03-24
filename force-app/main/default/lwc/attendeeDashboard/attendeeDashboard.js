import { LightningElement, wire } from 'lwc';
import getAttendees from '@salesforce/apex/AttendeeController.getAttendees';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email__c' },
    { label: 'Phone', fieldName: 'Phone__c' }
];

export default class AttendeeDashboard extends LightningElement {

    attendees = [];
    filteredAttendees = [];
    columns = columns;

    @wire(getAttendees)
    wiredData({ error, data }) {
        if (data) {
            this.attendees = data;
            this.filteredAttendees = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();

        this.filteredAttendees = this.attendees.filter(att =>
            att.Name.toLowerCase().includes(searchKey)
        );
    }
}