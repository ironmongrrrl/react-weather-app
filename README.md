# Weather App

Welcome to my 5 day weather forecasting app. The motivation behind this was to get comfortable using:

- React
- JSX
- API calls
- Documenting my understanding!

---

## User Stories

As an **MVP**:

1. Users should be able to see the name and country of the city the forecast is for.
2. Users should be able to see a summary of each day of the forecast, including the date, general description of the weather that day, and maximum temperature.

- We also need to repeat this for each day of the forecast.

3. Users should be able to click on one of the summaries to view all of the forecasted information for that date.

The goal was to make the app look like this:

![Weather App Example](https://github.com/ironmongrrrl/react-weather-app/blob/main/img/weather-app-example.png "Weather App Example")

## Thinking in React

Based on the super helpful [Thinking in React](https://reactjs.org/docs/thinking-in-react.html) I approached the project in the same way:

### 1. Start With A Mock

Before jumping into an API call, we started with some [static JSON data](https://s3.eu-west-2.amazonaws.com/mcrcodes/weather/forecast.json).

---

### 2. Break The UI Into A Component Hierarchy

By applying the single responsibility principle (a component should only do one thing) it helps keep the components as 'dumb' as possible and makes sure that where possible, we abstract data.

As we are displaying a JSON data model to a user, as long as the data model is sound, the Weather App UI (and therefore component structure) should map in a similar fashion, as they tend to adhere to the same information architecture.

Looking at the data then, we can see that it is broken down into an object which has as its first key:

- Location

Which offers an object containing "city" and "country" as keys within it.

The second key is:

- Forecasts

Which offers an array of objects. Each object contains data such as the date, temperature, humidity, wind, weather icon and description.

Based on this data model and the example image, it would make sense then that the component hierarchy might look something like this - starting with the overarching picture and then drilling down:

- Location (red) : encompassing the first object in the data 'Location'.
- Forecast Summaries (blue): encompassing the second object in the data ('Forecasts'), which is an array of objects.
- Forecast Summary (yellow) : individual components which represent each object within the 'Forecasts' array, showing a selection of key/value pairs from it (date, temperature, weather icon and description).
- Forecast Details (green) : a component which represents specific key/value pairs from one of the objects within the Forecasts array.

![Weather App Components](https://github.com/ironmongrrrl/react-weather-app/blob/main/img/weather-app-components.png "Weather App Components")

The hierarchy of the components would likely go:

- Index.js
  - App.js
    - Location Details
    - Forecast Summaries
      - Forecast Summary
      - Forecast Details

---

### 3. Build A Static Version in React

Now we have a component hierarchy, we can build this in the app. The React team advises separating the 'building components' task from the 'adding interactivity' task. In other words, adding state, which is 'data that changes over time' is definitely not static and is not included in this step. It will come later!

The key goal at the end of this step is to have a library of reusable stateless components that render the data model.

So to build a static version of the weather app that renders the data model, we want to:

- Build components that re-use other components
- Pass data through these components using props

Components are functions, and the arguments they receive are called props (short for properties).

For this project I worked top down. As props are passed down, the component at the top of the hierarchy (in this case, it's index.js) takes the data model as a prop. If I change some of this data, the UI will be updated and changes rendered. React's one-way data flow (one-way binding) is keeping everything modular, as are we the components.

Let's dig into this a bit:

- Raw data is stored in data/forecast.json.

#### Index.js

Index.js file is where App.js is rendered. For this reason, the raw data is imported into index.js and passed down into App.js as 2 props:

- Location
- Forecasts

#### App.js

As the props 'location' and 'forecasts' arrive, the 'location' props are destructured at this point as we want to pass city and country into the component 'Location Details'. 'Location Details' is next down the component tree, and is rendered in App.js. This meets point 1 of our MVP:

> Users should be able to see the name and country of the city the forecast is for.

To do this, the first bit of the code looks like this:

**Within App.js**

```
const App = ({ location, forecasts }) => {
  const { city, country } = location;
  return (
    <div className="weather-app">
      <LocationDetails city={city} country={country} />
```

**Within LocationDetails.js**

```
const LocationDetails = (props) => {
  const { city, country } = props;
  return <h1>{`${city}, ${country}`}</h1>;
};
```

Forecast Summaries which is also rendered in App.js (below 'Location Details') is passed the 'forecasts' props.

#### Forecast Summaries

This receives the 'forecasts' props. Forecast Summary is a component rendered within Forecast Summaries, which requires the 'date', 'temperature', 'description' and 'icon', so at this point 'forecasts' is destructured to separate these props and pass them ultimately into the Forecasr Summary component.

As Forecast Summaries (as the plural name implies) will render more than one Forecast Summary, this is also where the map function is used. So simple, but has an awesome application within React.

To give you a glimpse of the code:

```
const ForecastSummaries = ({ forecasts }) => {
  return (
    <div className="forecast-summaries">
      {forecasts.map((forecast) => {
        const { date, temperature, description, icon } = forecast;
        return (
          <ForecastSummary
            date={date}
            temperature={temperature}
            description={description}
            icon={icon}
            key={date}
          />
        );
      })}
    </div>
  );
};
```

This now meets point 2 of the MVP:

> Users should be able to see a summary of each day of the forecast, including the date, general description of the weather that day, and maximum temperature. We also need to repeat this for each day of the forecast.

It is good practice to give the individual elements inside an array a stable identity; this is done through giving them each a [unique key](https://reactjs.org/docs/lists-and-keys.html#keys) - that is, genuinely unique, and not based on the array index (which can be shuffled!). This is what the 'key' key is above - I have used the date as this is unique to each daily weather report. The reasoning behind using a key is that React can then zone in on which specific elements to update, rather than updating the whole array each time there is a change, which is more efficient.

Prop types are also imported and invoked throughout the project as a way of validating the data that is being passed through to reduce errors.

#### Forecast Summary

This is where the props for the date, temperature, description and icon are rendered.

It's worth mentioning that I am using the [BEM naming conventions](http://getbem.com/naming/) to keep things tidy!

Weather icons are imported as a npm module, as is 'Moment' to format the date.

#### Forecast Details

The final requirement for the MVP is:

> Users should be able to click on one of the summaries to view all of the forecasted information for that date.

This component is triggered to change by the user clicking on the 'More info' button in the Forecast Summary component. As this stage is just concerned with a static model, I simply created a stateless component within App.js. More on it next!

---

### 4. Identify The Minimal (but complete) Representation Of UI State

In the React sense, “state” is an object that represents the parts of the app that can change. State allows us to keep track of how the user has interacted with our app.

With this codebase I'm using functional components as opposed to class components, and therefore React Hooks to manage state.

#### The first State challenge

I made a 'More info' button within the Forecast Summary.

First let's talk about how the state change is setup, which will explain the chain of events when this button is clicked.

#### Within App.js

I'm a visual thinker, find it helpful to break this process down into the key players:

- Setting state in the parent component (the parent)
- A function in the parent component that has the power to change the state (the wife)
- The process of passing this power down to the child (the gossip)
- The end result (a happy family holiday)

---

**Setting State in the Parent Component (the parent)**

I added some initial state using:

```
const [selectedDate, setSelectedDate] = useState(forecasts[0].date);
```

- **selectedDate** When you first load the Weather App, the selectedDate state variable is set to the first forecast in the array. Makes sense as this will typically be 'today's date'.

- **setSelectedDate** The parent! This is the function to change the state of selectedDate.

---

**A function in the parent component that has the power to change the state (the wife)**

- **handleForecastSelect** this is a function which takes a date parameter, and inputs it into the setSelectedDate function, which is the way of updating the state on selectedDate.

```
  const handleForecastSelect = (date) => {
    setSelectedDate(date);
  };
```

It's interesting that state has to be changed in this way, e.g. a button onClick event in a child component can't directly invoke setSelectedDate(date) in the parent, but must instead invoke a function in the parent that then can directly mutate the state of the parent.

---

**The process of passing this power down to the child (the gossip)**

Changing the state on the parent is a cool power, right?! Even cooler if it can be done by a child!

So, very simply the wife's power (handleForecastSelect) is passed down as a prop. Give the prop a name (in this case, onForecastSelect), and pass it down.

In App.js:

```
<ForecastSummaries
        forecasts={forecasts}
        onForecastSelect={handleForecastSelect}
      />
```

In ForecastSummaries.js:

```
<ForecastSummary
            date={date}
            temperature={temperature}
            description={description}
            icon={icon}
            key={date}
            onForecastSelect={onForecastSelect}
```

In ForecastSummary.js (the target child component):

```
<div className="forecast-summaries__button">
        <button type="button" onClick={() => onForecastSelect(date)}>
          More info
        </button>
```

Boom! The date is fed in from the child, which is then passed into handleForecastSelect (the wife)...which is then passed into the setSelectedDate (the parent) - which changes the state.

---

**The end result (a happy family holiday)**

So, what do we actually do with the new and improved state variable (selectedDate)?

We ultimately use it in a constructive way. What are we looking to achieve? We want to select the correct object from the array, that matches the selectedDate.

So really it's now quite a simple approach; we store the desired outcome in a variable (selectedForecast) and get it but using a === operator with our new information.

```
const selectedForecast = forecasts.find(
    (forecast) => selectedDate === forecast.date
  );
```

This selectedForecast is then finally rendered in our 'Forecast Details' component. Woo!

```
In App.js:
<ForecastDetails forecast={selectedForecast} />
```

In Forecast Details the prop { forecast } is then destructured and the data rendered.
