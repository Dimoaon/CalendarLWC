# Salesforce Calendar LWC

Custom calendar implementation built with Salesforce Lightning Web Components.

## Demo

https://dima2-dev-ed.develop.my.site.com/calendar  
*(Salesforce dev org)*

## Features

✔ Monthly calendar view  
✔ Month and year navigation  
✔ Event creation (quick add & full form)  
✔ Event deletion  
✔ Event persistence using localStorage  
✔ Event search with live results  
✔ Context-aware event popup  

## Architecture highlights

- Component-based LWC architecture
- Centralized design tokens (CSS variables)
- Responsive layout (desktop / tablet / mobile)
- Popup positioning based on viewport and anchor element
- Clear separation of state and presentation

## Tech stack

- Salesforce Lightning Web Components (LWC)
- CSS design tokens
- LocalStorage (client-side persistence)

## Running the project

Deploy to a Salesforce org:

```bash
sf project deploy start
