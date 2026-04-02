import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getEvents from '@salesforce/apex/EventController.getEvents';
import deleteEvent from '@salesforce/apex/EventController.deleteEvent';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Start Date', fieldName: 'Start_Date_Time__c', type: 'date' },

    {
        type: 'button',
        typeAttributes: {
            label: 'View',
            name: 'view',
            variant: 'brand'
        }
    },
    {
        type: 'button',
        typeAttributes: {
            label: 'Delete',
            name: 'delete',
            variant: 'destructive'
        }
    }
];

export default class EventList extends NavigationMixin(LightningElement) {

    events;
    columns = columns;

    @wire(getEvents)
    wiredEvents(result) {
        this.wiredResult = result;

        if (result.data) {
            this.events = result.data;
        } else if (result.error) {
            console.error(result.error);
        }
    }

    handleRowAction(event) {

        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view') {

            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: row.Id,
                    objectApiName: 'Event__c',
                    actionName: 'view'
                }
            });

        } else if (actionName === 'delete') {

            deleteEvent({ eventId: row.Id })
                .then(() => {

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Deleted',
                            message: 'Event deleted successfully',
                            variant: 'success'
                        })
                    );

                    // Refresh UI
                    this.events = this.events.filter(e => e.Id !== row.Id);

                })
                .catch(error => {
                    console.error(error);

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Error deleting event',
                            variant: 'error'
                        })
                    );
                });
        }
    }
}