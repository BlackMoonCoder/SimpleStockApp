Core Features Implemented:

Stock Lookup

Search for stocks by symbol or name with a simple search input.

Select from popular stocks via dropdown (picker).

Fetch and display real-time stock quote data (current price, high, low, previous close).

Show 1-week historical stock price chart.

Simulated Trading

“Buy 1 share” button to add stocks to a local, in-memory portfolio.

Portfolio tracks: symbol, quantity, average buy price, and total cost per stock.

Portfolio Screen

Displays all bought stocks with current prices fetched live.

Calculates and shows current value and gain/loss for each holding.

“Refresh” button to update prices.

Portfolio is passed between screens via React Navigation params.

Tech Stack:

React Native for mobile app development.

React Navigation for screen transitions.

Finnhub API (or similar) for stock data (quotes, historical, search).

react-native-chart-kit for displaying price charts.

Local state management (React useState) for portfolio tracking.

What’s NOT done yet:

Portfolio is not persisted; it resets when the app closes.

No selling/sharing functionality yet.

No backend or user accounts.

Minimal UI/UX polish and error handling.

In short:
You have a working basic stock lookup and simple “buy” simulation with portfolio tracking — all in-memory and ready to build on!
