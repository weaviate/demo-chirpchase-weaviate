# ChirpChase Frontend Documentation

### 🔧 Installation

To install all dependencies first make sure to have `Node => 19.0.0` installed and then use `npm install`

### ✨ Getting started!

Start the app by `npm run dev`

### ⚙️ **React Components**

Here are all the components used in the app and their functionality:

### `index.tsx`

represents the home page for "Chirp Chase" that analyzes and leverages content generation based on tweets. It utilizes several custom components and hooks for state management, as well as the react-dnd library for handling drag and drop functionality.

The main components used in this file are:

    - Table: A component that displays a list of tweets, allowing users to select a tweet by clicking on it.
    - Dropzone: A component that accepts dropped tweets dragged from the Table component.
    - InputCard: A component that enables users to input text and tags to send along with the dropped tweets for processing.
    - OutputCard: A component that displays the processed output and keys after sending the tweets for analysis.

The main Home function component contains several state hooks to manage the selected tweet, dropped tweets, response text, key text, and a loading state. It defines handlers for selecting a tweet, dropping a tweet, clearing the drop zone, and sending the input data for processing.

When the user interacts with the application by selecting tweets, dropping them into the drop zone, and inputting text and tags, the handleSend function is triggered, which sends a request to the /process_tweets API endpoint. The response is then parsed and displayed in the OutputCard component.

### `table.tsx`

The table.tsx file contains a TypeScript React component named Table, which is responsible for displaying a list of tweets, allowing users to interact with the table through sorting, searching, filtering by date, user, or tags, and opening the tweet URL in a new tab when a row is clicked. The component uses react-window's FixedSizeList for efficiently rendering the list of tweets, react-datepicker for date selection, and react-select for user and tag selection.

When the component is mounted, it fetches the tweet data from a local server with an API endpoint at http://localhost:8000/tweets. The data is then filtered, sorted, and displayed in the table based on user interactions.

### `tweetRow.tsx`

Responsible for displaying an individual tweet in the table. The TweetRow component receives a row object of type Tweet, an index number, and an onRowClick callback function as props.

The TweetRow component is responsible for rendering an individual tweet row in the table, enabling drag-and-drop functionality, and handling click events to interact with the parent Table component.

### `dropzone.tsx`

It receives two callback functions as props: onDrop and onClear. This component is responsible for handling the drag-and-drop functionality for tweets.

The rendered output of the Dropzone component consists of a div element containing a drop zone with a custom textarea for entering custom tweets and buttons for adding and deleting tweets. The drop zone is styled using Tailwind CSS utility classes.

In summary, the Dropzone component is responsible for handling drag-and-drop functionality for tweets, managing the state of the tweets list, and providing a custom textarea for adding tweets manually.

### `inputCard.tsx`

This component takes a callback function onSend as a prop, which is invoked with the input text and selected tags when the "Send" button is clicked.

The rendered output of the InputCard component consists of a div element containing a select dropdown for prompts, a multi-select dropdown for context tags, and a TextareaAutosize component for entering custom input text. The component also includes a "Send" button, which calls the onSend callback with the current input text and selected tags when clicked.

In summary, the InputCard component provides an interface for selecting a prompt and context tags, as well as entering custom input text, and sends the data to a parent component via a callback function when the "Send" button is clicked.

### `outputCard.tsx`

This component takes three props: output, keys, and isLoading. output is an array of strings or null, representing the generated output text. keys is an array of strings or null, representing the keys associated with the output text. isLoading is a boolean that indicates whether the output is being fetched or not.

The OutputCard component renders a div element containing a title with an icon and a list of output text elements. If isLoading is true, the component displays a loading message. If the output and keys arrays are not null, it maps over the output array and renders each output text along with its corresponding key.

In summary, the OutputCard component displays the generated output text along with their associated keys, and shows a loading message while the output is being fetched.